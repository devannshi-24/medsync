import { HumanMessage } from "@langchain/core/messages";
import { getGraph } from "../ai/graph.js";
import { deleteConversation } from "../ai/mongodb.js";

export const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    // console.log("Controller reached");

    const graph = await getGraph();

    // console.log("Graph initialized");

    const result = await graph.invoke(
      {
        messages: [new HumanMessage(message)],
      },
      {
        configurable: {
          thread_id: req.user._id.toString(),
        },
      }
    );

    // Last message is always the AI response
    const reply = result.messages[result.messages.length - 1].content;

    return res.status(200).json({
      success: true,
      reply,
    });

  } catch (error) {
    console.error("AI Chat Error:", error);

    return res.status(500).json({
      message: "Failed to generate AI response.",
      error: error.message,
    });
  }
};

export const newChat = async (req, res) => {
  try {
    const threadId = req.user._id.toString();

    await deleteConversation(threadId);

    return res.status(200).json({
      success: true,
      message: "Started a new conversation."
    });

  } catch (error) {
    console.error("New Chat Error:", error);
    
    return res.status(500).json({
      message: "Failed to start a new conversation.",
      error: error.message
    });
  }
};