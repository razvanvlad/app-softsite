import { createClient } from '@supabase/supabase-js';
import { generateEmbedding } from '../../lib/embeddings.js';
import { recursiveCharacterTextSplitter } from '../../lib/textSplitter.js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        // Check for admin authentication (simplified for now, check for a secret header or session)
        // In production, verify user role from Supabase auth token
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response('Unauthorized', { status: 401 });
        }

        // Verify token (simplified logic: just check if it exists for this demo, 
        // ideally verify JWT and check role='admin' or specific email)
        // const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
        // if (authError || !user) return new Response('Unauthorized', { status: 401 });

        const { content, filename } = await req.json();

        if (!content) {
            return new Response('Content is required', { status: 400 });
        }

        // 1. Split text into chunks
        const chunks = recursiveCharacterTextSplitter(content);
        console.log(`Split into ${chunks.length} chunks`);

        // 2. Generate embeddings for each chunk
        // Process in batches to avoid rate limits if necessary, but Gemini is fast
        const embeddings = await Promise.all(
            chunks.map(chunk => generateEmbedding(chunk))
        );

        // 3. Prepare data for insertion
        const documents = chunks.map((chunk, i) => ({
            content: chunk,
            metadata: { filename, chunkIndex: i },
            embedding: embeddings[i],
        }));

        // 4. Insert into Supabase
        const { error } = await supabase.from('documents').insert(documents);

        if (error) {
            console.error('Supabase insertion error:', error);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, chunksProcessed: chunks.length }), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Ingestion error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
