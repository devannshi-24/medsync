import api from "./api";

export const sendMessage = async (message) => {
  const { data } = await api.post("/ai/chat", {
    message,
  });
  return data;
};

export const startNewChat = async () => {
  const { data } = await api.delete("/ai/new-chat");
  return data;
};