
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

// Initialize Supabase Client (Backend)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

// Initialize Gemini Client
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const embeddingModel = client.getGenerativeModel({ model: "text-embedding-004" });

const STARTUP_NATION_CONTEXT = `
You are an expert consultant for the Romanian "Start-up Nation 2025" program.
Your goal is to help users understand eligibility, budget allocation, and application processes.

*** OFFICIAL PROGRAM RULES 2025 (SIMULATED) ***

1. **Target Audience**:
   - Pillar 1: Young people under 30 years old.
   - Pillar 2: Unemployed, people with disabilities, people from rural areas.
   
2. **Financial Aid**:
   - Maximum Grant (AFN): 250,000 RON (~50,000 EUR).
   - Own Contribution: Minimum 10% of eligible value.
   
3. **Evaluation Grid (Total 100 points)**:
   - **Green Energy**: Investment in renewable energy / energy efficiency (Min 5% of grant) = 20 points.
   - **Digitalization**: Investment in software/hardware (Min 5% of grant) = 20 points.
   - **Training**: Digital skills training = 20 points.
   - **Innovation**: R&D component or patent usage = 20 points.
   - **Sustainable Development**: Eco-friendly practices = 20 points.

4. **Eligible Expenses**:
   - Equipment: Machinery, furniture, IT equipment (Servers, Laptops).
   - Vehicles: Only 100% electric vehicles are eligible (Max 1 vehicle per company).
   - Software: Website (limit 25k RON), ERP, CRM, Operating Systems.
   - Salaries: Up to 12 months (capped at average gross salary).
   - Rent & Utilities: Up to 12 months.
   - Consulting: Max 10,000 RON.

5. **Ineligible Expenses**:
   - Second-hand equipment.
   - Vehicles with combustion engines.
   - Loans, interest, fines.

If the user asks about specific equipment, check if it falls under eligible categories.
If recommending SoftSite services, mention they cover the "Digitalization" criteria (Website, App, Digital Marketing).
`;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, history, userId } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const apiHistory = history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        // 1. RAG: Retrieve relevant context
        let ragContext = "";
        try {
            const embeddingResult = await embeddingModel.embedContent(message);
            const embedding = embeddingResult.embedding.values;

            const { data: documents, error: searchError } = await supabase.rpc('match_documents', {
                query_embedding: embedding,
                match_threshold: 0.5,
                match_count: 3,
            });

            if (!searchError && documents && documents.length > 0) {
                ragContext = "\n\n*** OFFICIAL DOCUMENTATION CONTEXT ***\n" +
                    documents.map((doc: any) => `[Source: ${doc.metadata?.filename || 'Unknown'}]\n${doc.content}`).join("\n\n") +
                    "\n\nUse the above context to answer the user's question if relevant. Cite the source if possible.";
            }
        } catch (err) {
            console.error("RAG retrieval failed:", err);
            // Continue without RAG context if it fails
        }

        const chat = client.chats.create({
            model: 'gemini-2.5-flash',
            history: apiHistory,
            config: {
                systemInstruction: STARTUP_NATION_CONTEXT + ragContext,
                temperature: 0.7,
            }
        });

        const result = await chat.sendMessage({ message });
        const responseText = result.text;

        // 2. Save to Supabase (if userId is provided)
        if (userId) {
            await supabase.from('chat_sessions').insert({
                user_id: userId,
                role: 'user',
                content: message,
            });

            await supabase.from('chat_sessions').insert({
                user_id: userId,
                role: 'assistant',
                content: responseText,
            });
        }

        return res.status(200).json({ response: responseText });
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
