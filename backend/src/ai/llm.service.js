import { ChatGroq } from "@langchain/groq";

let llm = null;

export function getLLM() {
  if (!llm) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("GROQ_API_KEY is missing in .env");
    }

    llm = new ChatGroq({
      apiKey,
      model: process.env.GROQ_MODEL,
      temperature: 0.3,
    });
  }

  return llm;
}