import { useState } from "react";

function DoselogForm({
  schedules,
  onSubmit,
  buttonText = "Save Log"
}) {

  const [formData, setFormData] = useState({
    scheduleId: "",
    status: "taken"
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="block mb-2 font-medium">
          Schedule
        </label>

        <select
          name="scheduleId"
          value={formData.scheduleId}
          onChange={handleChange}
          required
          className="w-full border rounded-xl px-4 py-2.5"
        >
          <option value="">
            Select Schedule
          </option>

          {schedules.map(schedule => (
            <option
              key={schedule._id}
              value={schedule._id}
            >
              {schedule.medicineId?.name || "Unknown Medicine"}({schedule.dosage})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Status
        </label>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-2.5"
        >
          <option value="taken">
            Taken
          </option>

          <option value="missed">
            Missed
          </option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition"
      >
        {buttonText}
      </button>

    </form>
  );
}

export default DoselogForm;