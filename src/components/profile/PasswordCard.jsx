import React from "react";

function PasswordCard() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">

      <h2 className="text-xl font-semibold text-slate-800 mb-1">
        Security
      </h2>

      <p className="text-slate-500 text-sm mb-8">
        Update your account password.
      </p>

      <div className="space-y-6">

        <div>

          <label className="block text-sm font-medium text-slate-600 mb-2">
            Current Password
          </label>

          <input
            type="password"
            placeholder="Enter current password"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
          />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>

            <label className="block text-sm font-medium text-slate-600 mb-2">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

          <div>

            <label className="block text-sm font-medium text-slate-600 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

        </div>

        <div className="flex justify-end">

          <button
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Update Password
          </button>

        </div>

      </div>

    </div>
  );
}

export default PasswordCard;