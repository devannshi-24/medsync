import { StateGraph, START, END } from "@langchain/langgraph";
import { SystemMessage } from "@langchain/core/messages";

import { State } from "./state.js";
import { getLLM } from "./llm.service.js";
import { getCheckpointer } from "./mongodb.js";
import systemPrompt from "./prompt.js";

async function chatbot(state) {
//   console.log("Chatbot node executed");
  const response = await getLLM().invoke([
    new SystemMessage(systemPrompt),
    ...state.messages,
  ]);

  return {
    messages: [response],
  };
}

let graph = null;

export async function getGraph() {
  if (graph) return graph;

  const checkpointer = await getCheckpointer();

  graph = new StateGraph(State)
    .addNode("chatbot", chatbot)
    .addEdge(START, "chatbot")
    .addEdge("chatbot", END)
    .compile({
      checkpointer,
    });

  return graph;
}