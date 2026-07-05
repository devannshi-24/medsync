import { MongoClient } from "mongodb";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";

let checkpointer = null;

export async function getCheckpointer() {
  if (checkpointer) {
    return checkpointer;
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined in .env");
  }

  const client = new MongoClient(uri);

  await client.connect();

  checkpointer = new MongoDBSaver({
    client,
  });

  // Creates the checkpoint collections the first time
  await checkpointer.setup();

  console.log("✅ LangGraph MongoDBSaver initialized");

  return checkpointer;
}