import api from "./api";

export const registerDevice = async (fcmToken) => {
  const response = await api.post("/device/register", {
    fcmToken,
    platform: "web"
  });

  return response.data;
};