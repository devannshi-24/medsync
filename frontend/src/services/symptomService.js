import api from "./api";

// Get all symptoms
export const getSymptoms = async () => {
  const response = await api.get("/symptom");
  return response.data;
};

// Add symptom
export const addSymptom = async (symptomData) => {
  const response = await api.post(
    "/symptom",
    symptomData
  );

  return response.data;
};

// Delete symptom
export const deleteSymptom = async (id) => {
  const response = await api.delete(
    `/symptom/${id}`
  );

  return response.data;
};