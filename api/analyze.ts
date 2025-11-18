
import { GoogleGenAI, Type } from '@google/genai';

// Initialize Gemini Client
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, data } = req.body;

    if (!type || !data) {
        return res.status(400).json({ error: 'Type and data are required' });
    }

    try {
        let prompt = '';
        let schema = null;

        if (type === 'seo') {
            const { url, keyword } = data;
            prompt = `
        Analyze the potential SEO performance for a website with URL: "${url}" targeting the keyword: "${keyword}".
        Since you cannot browse the live web, simulate a realistic SEO audit report based on common best practices for this niche.
        Return the data strictly as a JSON object.
      `;
            schema = {
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
                                priority: { type: Type.STRING },
                                text: { type: Type.STRING }
                            }
                        }
                    },
                    keywords: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            };
        } else if (type === 'speed') {
            const { url } = data;
            prompt = `
        Simulate a Google PageSpeed Insights report for the website: "${url}".
        Since you cannot browse the live web, generate realistic metrics and recommendations based on typical issues for this type of website.
        Return the data strictly as a JSON object.
      `;
            schema = {
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
            };
        } else if (type === 'budget') {
            const { industry, location } = data;
            prompt = `
        Create a recommended list of purchases (budget plan) for a startup in the "${industry}" industry located in a "${location}" area, specifically optimized for the "Start-up Nation 2025" grant (250,000 RON limit).
        Include:
        1. Mandatory digitalization (Laptop, Software, Website).
        2. Green energy (Solar panels/Electric car) if relevant for points.
        3. Industry-specific equipment.
        Return strictly a JSON array of objects.
      `;
            schema = {
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
            };
        } else {
            return res.status(400).json({ error: 'Invalid type' });
        }

        const result = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema,
            }
        });

        const responseText = result.text;
        return res.status(200).json(JSON.parse(responseText));

    } catch (error) {
        console.error('Error in analyze endpoint:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
