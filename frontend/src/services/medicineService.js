import api from "./api";

// Get all medicines
export const getMedicines = async () => {
  const response = await api.get("/medicine");
  return response.data;
};

// Add medicine
export const addMedicine = async (medicineData) => {
  const response = await api.post("/medicine", medicineData);
  return response.data;
};

// Update medicine
export const updateMedicine = async (id, medicineData) => {
  const response = await api.put(`/medicine/${id}`, medicineData);
  return response.data;
};

// Delete medicine
export const deleteMedicine = async (id) => {
  const response = await api.delete(`/medicine/${id}`);
  return response.data;
};