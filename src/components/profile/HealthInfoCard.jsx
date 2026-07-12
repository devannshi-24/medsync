import React from "react";

function HealthInfoCard({ profile, handleChange }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
      <h2 className="text-xl font-semibold text-slate-800 mb-1">
        Health Information
      </h2>

      <p className="text-slate-500 text-sm mb-8">
        Information used by MedSync AI.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Age
          </label>
          <input
            type="number"
            placeholder="Enter age"
            value={profile.age}
            onChange={handleChange}
            name="age"
             min="0"
             max="150"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Gender
          </label>
          <select  name="gender"  value={profile.gender} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 outline-none">
            <option value="">Select Gender</option>
            <option value = "male">Male</option>
            <option value = "female">Female</option>
            <option value = "other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Weight (kg)
          </label>

          <input
            type="number"
            value={profile.weight}
            onChange={handleChange}
            name="weight"
            min="1"
            max="500"
            placeholder="e.g. 72"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Height (cm)
          </label>

          <input
            type="number"
            value={profile.height}
            onChange={handleChange}
            name="height"
            min="30"
            max="300"
            placeholder="e.g. 175"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Chronic Conditions
          </label>

          <textarea
            rows={3}
            placeholder="Diabetes, Hypertension..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400"
          />
        </div>

         <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Allergies
          </label>

          <textarea
            rows={3}
            placeholder="Penicillin, Dust..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400"
          />
        </div>

      </div>
    </div>
  );
}

export default HealthInfoCard;