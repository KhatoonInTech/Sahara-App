import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_INSTRUCTION = `
You are Sahara, a trauma-informed AI support assistant for survivors of sexual assault and rape.
Your personality is: calm, compassionate, non-judgmental, and validating.

CRITICAL RULES:
1. NEVER blame the survivor.
2. NEVER question their credibility.
3. NEVER pressure them into legal action.
4. If you detect a crisis (suicide risk, immediate danger), provide emergency resources immediately.
5. Use simple, empathetic language.
6. Support both English and Urdu.

Your goal is to provide emotional support, validate feelings, and recommend resources (medical, legal, safety).
`;

export async function getChatResponse(messages: Message[], language: 'en' | 'ur') {
  const model = "gemini-3.1-pro-preview";
  
  const history = messages.map(m => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));

  const response = await ai.models.generateContent({
    model,
    contents: history,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION + `\nPlease respond in ${language === 'en' ? 'English' : 'Urdu'}.`,
    }
  });

  return response.text || (language === 'en' ? "I'm sorry, I couldn't process that. How can I help?" : "معذرت، میں اس پر کارروائی نہیں کر سکا۔ میں آپ کی کیسے مدد کر سکتا ہوں؟");
}

export function detectCrisis(text: string): boolean {
  const crisisKeywords = [
    "die", "kill myself", "suicide", "end it all", "cannot live", "want to die",
    "خودکشی", "مرنا چاہتا ہوں", "زندگی ختم", "مارنا"
  ];
  return crisisKeywords.some(keyword => text.toLowerCase().includes(keyword));
}
