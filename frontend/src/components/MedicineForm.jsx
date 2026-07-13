import { useState, useEffect } from "react";

function MedicineForm({
  onSubmit,
  initialData = null,
  buttonText = "Save Medicine"
}) {

  const [formData, setFormData] = useState({
    name: "",
    purpose: "",
    notes: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        purpose: initialData.purpose || "",
        notes: initialData.notes || ""
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);

    if (!initialData) {
      setFormData({
        name: "",
        purpose: "",
        notes: ""
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

    {/* Name */}

    <div>
      <label className="block mb-2 font-medium">
        Medicine Name
      </label>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Paracetamol"
        className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Purpose */}

    <div>
      <label className="block mb-2 font-medium">
        Purpose
      </label>

      <input
        type="text"
        name="purpose"
        value={formData.purpose}
        onChange={handleChange}
        placeholder="Fever, Pain Relief..."
        className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Notes */}

    <div>
      <label className="block mb-2 font-medium">
        Notes
      </label>

      <textarea
        name="notes"
        rows="4"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Take after meals..."
        className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
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

export default MedicineForm;