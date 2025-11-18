import { createClient } from '@supabase/supabase-js';
import { generateEmbedding } from '../lib/embeddings.js';

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
        const { query } = await req.json();

        if (!query) {
            return new Response('Query is required', { status: 400 });
        }

        // 1. Generate embedding for the query
        const embedding = await generateEmbedding(query);

        // 2. Search in Supabase
        const { data: documents, error } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.5, // Adjust threshold as needed
            match_count: 5, // Retrieve top 5 chunks
        });

        if (error) {
            console.error('Supabase search error:', error);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify({ documents }), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Search error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
