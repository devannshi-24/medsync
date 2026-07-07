import dotenv from "dotenv";
dotenv.config();

import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
  temperature: 0.2,
});

const response = await llm.invoke("Say hello in one sentence.");

console.log(response.content);