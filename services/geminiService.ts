
import { Message, SeoReport, SpeedReport, BudgetItem } from "../types";

export const streamChatResponse = async (
  history: Message[],
  newMessage: string,
  onChunk: (text: string) => void,
  userId?: string
): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: newMessage,
        history: history.filter(msg => msg.role !== 'system'),
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chat response');
    }

    const data = await response.json();
    const fullText = data.response;

    onChunk(fullText);
    return fullText;
  } catch (error) {
    console.error('Error in streamChatResponse:', error);
    return "Sorry, I'm having trouble connecting to the server right now.";
  }
};

export const analyzeSeoWithGemini = async (url: string, keyword: string): Promise<SeoReport> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'seo',
      data: { url, keyword }
    })
  });

  if (!response.ok) throw new Error("Failed to analyze SEO");
  return await response.json();
};

export const analyzeSpeedWithGemini = async (url: string): Promise<SpeedReport> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'speed',
      data: { url }
    })
  });

  if (!response.ok) throw new Error("Failed to analyze speed");
  return await response.json();
};

export const generateBudgetPlan = async (industry: string, location: string): Promise<BudgetItem[]> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'budget',
      data: { industry, location }
    })
  });

  if (!response.ok) throw new Error("Failed to generate budget plan");
  return await response.json();
};
