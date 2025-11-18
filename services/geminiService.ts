
import { GoogleGenAI, Type } from "@google/genai";
import { Message, SeoReport, SpeedReport, BudgetItem } from "../types";

// Simulated Knowledge Base for Start-up Nation 2025
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

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY || ''; 
    // In a real app, handle missing key gracefully or prompt user
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const streamChatResponse = async (
  history: Message[], 
  newMessage: string,
  onChunk: (text: string) => void
): Promise<string> => {
  const client = getClient();
  
  // Filter history to only user and model for the API context
  const apiHistory = history
    .filter(msg => msg.role !== 'system')
    .map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

  const chat = client.chats.create({
    model: 'gemini-2.5-flash',
    history: apiHistory,
    config: {
      systemInstruction: STARTUP_NATION_CONTEXT,
      temperature: 0.7,
    }
  });

  const result = await chat.sendMessageStream({ message: newMessage });
  
  let fullText = '';
  for await (const chunk of result) {
    const text = chunk.text;
    if (text) {
      fullText += text;
      onChunk(fullText);
    }
  }
  return fullText;
};

export const analyzeSeoWithGemini = async (url: string, keyword: string): Promise<SeoReport> => {
  const client = getClient();
  
  const prompt = `
    Analyze the potential SEO performance for a website with URL: "${url}" targeting the keyword: "${keyword}".
    Since you cannot browse the live web, simulate a realistic SEO audit report based on common best practices for this niche.
    
    Return the data strictly as a JSON object matching this structure:
    {
      "url": string,
      "score": number (0-100),
      "title": string (suggested improved title),
      "recommendations": [
        { "priority": "High" | "Medium" | "Low", "text": string }
      ],
      "keywords": string[] (list of 5 related semantic keywords)
    }
  `;

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          url: { type: Type.STRING },
          score: { type: Type.NUMBER },
          title: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                text: { type: Type.STRING }
              }
            }
          },
          keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as SeoReport;
};

export const analyzeSpeedWithGemini = async (url: string): Promise<SpeedReport> => {
  const client = getClient();

  const prompt = `
    Simulate a Google PageSpeed Insights report for the website: "${url}".
    Since you cannot browse the live web, generate realistic metrics and recommendations based on typical issues for this type of website.

    Return the data strictly as a JSON object matching this structure:
    {
      "url": string,
      "performanceScore": number (mobile score 0-100),
      "fcp": string (e.g. "1.5s"),
      "lcp": string (e.g. "3.2s"),
      "cls": string (e.g. "0.15"),
      "recommendations": string[] (list of 3 technical recommendations like "Serve images in next-gen formats", "Reduce unused JavaScript")
    }
  `;

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          url: { type: Type.STRING },
          performanceScore: { type: Type.NUMBER },
          fcp: { type: Type.STRING },
          lcp: { type: Type.STRING },
          cls: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as SpeedReport;
};

export const generateBudgetPlan = async (industry: string, location: string): Promise<BudgetItem[]> => {
  const client = getClient();
  
  const prompt = `
    Create a recommended list of purchases (budget plan) for a startup in the "${industry}" industry located in a "${location}" area, specifically optimized for the "Start-up Nation 2025" grant (250,000 RON limit).

    Include:
    1. Mandatory digitalization (Laptop, Software, Website).
    2. Green energy (Solar panels/Electric car) if relevant for points.
    3. Industry-specific equipment (e.g., if Bakery: Ovens; if IT: Servers).
    
    Return strictly a JSON array of objects:
    {
      "category": "IT" | "Equipment" | "Software" | "Vehicle" | "Other",
      "item": string (Name of item),
      "estimatedCost": number (in RON),
      "isEligible": boolean,
      "reason": string (Why this helps the business or grant score)
    }
  `;

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            item: { type: Type.STRING },
            estimatedCost: { type: Type.NUMBER },
            isEligible: { type: Type.BOOLEAN },
            reason: { type: Type.STRING }
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as BudgetItem[];
}
