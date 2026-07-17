import React from "react";
function PersonalInfoCard({ profile, handleChange }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8">

      <h2 className="text-xl font-semibold text-slate-800 mb-1">
        Personal Information
      </h2>

      <p className="text-slate-500 text-sm mb-8">
        Your account details.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Full Name
          </label>

          <input
            type="text"
             name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={profile.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 outline-none"
          />
        </div>

      </div>

    </div>
  );
}

export default PersonalInfoCard;