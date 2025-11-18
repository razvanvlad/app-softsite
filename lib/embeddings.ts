import { GoogleGenerativeAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const result = await model.embedContent(text);
        const embedding = result.embedding;
        return embedding.values;
    } catch (error) {
        console.error("Error generating embedding:", error);
        throw error;
    }
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
        // Gemini batch embedding might be limited, so we map for now or use batchEmbedContents if available and needed for scale
        // For simplicity and robustness with the current SDK version, we'll process in parallel
        const promises = texts.map(text => generateEmbedding(text));
        return Promise.all(promises);
    } catch (error) {
        console.error("Error generating embeddings batch:", error);
        throw error;
    }
}
