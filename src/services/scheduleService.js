import api from "./api";

export const getSchedules = async () => {
  const response = await api.get("/schedule");
  return response.data;
};

export const addSchedule = async (scheduleData) => {
  const response = await api.post("/schedule", scheduleData);
  return response.data;
};

export const deleteSchedule = async (id) => {
  const {data} = await api.delete(`/schedule/${id}`);
  return data;
};

export const updateSchedule = async (
  id,
  scheduleData
) => {
  const response =
    await api.put(
      `/schedule/${id}`,
      scheduleData
    );

  return response.data;
};

export const snoozeReminder = async (scheduleId, minutes = 10) => {
  const response = await api.post("/schedule/snooze", {
    scheduleId,
    minutes,
  });

  return response.data;
};