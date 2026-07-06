import { useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";

function SymptomForm({
  onSubmit,
  buttonText = "Save Entry"
}) {

  const commonSymptoms = [
    "Headache", "Fatigue", "Nausea", "Fever", "Cough",
    "Dizziness", "Chest Pain", "Shortness of Breath", "Sore Throat", "Body Ache"
  ];

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState("");

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(item => item !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const getUrgency = () => {
    if (severity <= 3) return "Low";
    if (severity <= 6) return "Monitor";
    return "See Doctor";
  };

  const urgencyColor = () => {
    const u = getUrgency();
    if (u === "Low") return "text-green-600";
    if (u === "Monitor") return "text-yellow-500";
    return "text-red-600";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let allSymptoms = [...selectedSymptoms];
    if (customSymptom.trim()) {
      allSymptoms.push(customSymptom.trim());
    }

    let severityText = "";
    if (severity <= 3) severityText = "mild";
    else if (severity <= 6) severityText = "moderate";
    else severityText = "severe";

    onSubmit({
      symptom: allSymptoms.join(", "),
      severity: severityText,
      notes
    });

    setSelectedSymptoms([]);
    setCustomSymptom("");
    setSeverity(5);
    setNotes("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Common Symptoms */}
      <div>
        <p className="mb-3 text-sm text-slate-500">Common Symptoms</p>
        <div className="flex flex-wrap gap-2">
          {commonSymptoms.map(symptom => (
            <button
              key={symptom}
              type="button"
              onClick={() => toggleSymptom(symptom)}
              className={`px-3 py-1.5 text-sm rounded-full border transition ${
                selectedSymptoms.includes(symptom)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Symptom */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-800">
          Add Custom Symptom
        </label>
        <input
          type="text"
          value={customSymptom}
          onChange={(e) => setCustomSymptom(e.target.value)}
          placeholder="Enter symptom..."
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
        />
      </div>

      {/* Severity */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-slate-800">Severity</label>
          <span className="text-sm font-semibold text-slate-700">{severity}/10</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={severity}
          onChange={(e) => setSeverity(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1.5">
          <span>Mild</span>
          <span>Moderate</span>
          <span>Severe</span>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-800">Notes</label>
        <textarea
          rows="3"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="When did it start? What makes it worse?"
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 resize-none text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
        />
      </div>

      {/* Urgency + Save */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
            <FiAlertTriangle className="text-yellow-500 text-sm" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Urgency</p>
            <h3 className={`text-base font-semibold ${urgencyColor()}`}>
              {getUrgency()}
            </h3>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-sm transition"
        >
          {buttonText}
        </button>
      </div>

    </form>
  );
}

export default SymptomForm;