import { useState, useEffect } from "react";

function ScheduleForm({
  medicines,
  onSubmit,
  initialData = null,
  buttonText = "Save Schedule"
}) {

  const [formData, setFormData] = useState({
    medicineId: "",
    dosage: "",
    frequency: "daily",
    times: "",
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        medicineId: initialData.medicineId?._id || "",
        dosage: initialData.dosage || "",
        frequency: initialData.frequency || "daily",
        times: initialData.times?.join(", ") || "",
        startDate: initialData.startDate?.slice(0, 10) || "",
        endDate: initialData.endDate?.slice(0, 10) || ""
      });
    } else {
      setFormData({
        medicineId: "",
        dosage: "",
        frequency: "daily",
        times: "",
        startDate: "",
        endDate: ""
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const times = formData.times
      .split(",")
      .map((time) => time.trim())
      .filter(Boolean);
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!times.every((time) => timeRegex.test(time))) {
      alert(
        "Please enter time(s) in HH:MM format.\nExample: 08:00, 14:30, 20:00",
      );
      return;
    }
    onSubmit({
      ...formData,
      times,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Medicine */}

      <div>
        <label className="block mb-2 font-medium">
          Medicine
        </label>

        <select
          name="medicineId"
          value={formData.medicineId}
          onChange={handleChange}
          required
          className="w-full border rounded-xl px-4 py-2.5"
        >
          <option value="">
            Select Medicine
          </option>

          {medicines.map((medicine) => (
            <option
              key={medicine._id}
              value={medicine._id}
            >
              {medicine.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dosage + Frequency */}

      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="block mb-2 font-medium">
            Dosage
          </label>

          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            placeholder="500 mg"
            required
            className="w-full border rounded-xl px-4 py-2.5"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Frequency
          </label>

          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2.5"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="alternate">Alternate</option>
          </select>
        </div>

      </div>

      {/* Times */}

      <div>
        <label className="block mb-2 font-medium">
          Time(s)
        </label>

        <input
          type="text"
          name="times"
          value={formData.times}
          onChange={handleChange}
          placeholder="08:00, 20:00"
          required
          className="w-full border rounded-xl px-4 py-2.5"
        />
      </div>

      {/* Dates */}

      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="block mb-2 font-medium">
            Start Date
          </label>

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-4 py-2.5"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            End Date
          </label>

          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-4 py-2.5"
          />
        </div>

      </div>

      {/* Submit */}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition"
      >
        {buttonText}
      </button>

    </form>
  );
}

export default ScheduleForm;