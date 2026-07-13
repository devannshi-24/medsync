import api from "./api";

export const getDoseLogs = async () => {
  const response = await api.get("/doselog");
  return response.data;
};
export const addDoseLog = async (logData) => {
  const response = await api.post("/doselog", logData);
  return response.data;
};