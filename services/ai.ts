
import { GoogleGenAI, Type } from "@google/genai";

// Always use process.env.API_KEY directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ValidationResult {
  isAuthentic: boolean;
  score: number;
  riskFlags: string[];
  justification: string;
}

export const validatePeaceWork = async (title: string, description: string): Promise<ValidationResult> => {
  const model = 'gemini-3-flash-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: `Analyze this peace project submission for authenticity and potential fraud.
    Title: ${title}
    Description: ${description}
    
    Evaluate based on historical context, verifiability, and potential for sybil-attack exploitation.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isAuthentic: { type: Type.BOOLEAN },
          score: { type: Type.NUMBER, description: "0-100 quality/veracity score" },
          riskFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          justification: { type: Type.STRING }
        },
        required: ["isAuthentic", "score", "riskFlags", "justification"]
      }
    }
  });

  // Access the .text property directly (not as a method call) as per guidelines
  return JSON.parse(response.text || '{}');
};
