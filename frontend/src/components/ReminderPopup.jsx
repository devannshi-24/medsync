import React from "react";

function ReminderPopup({
  schedule,
  onTaken,
  onMissed,
  onSnooze,
  onClose
}) {

  if (!schedule) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl shadow-xl p-6 w-[420px]">

        <h2 className="text-2xl font-bold text-center">
          💊 Medicine Reminder
        </h2>

        <div className="mt-6 space-y-2">

          <p>
            <span className="font-semibold">
              Medicine:
            </span>{" "}
            {schedule.medicine}
          </p>

          <p>
            <span className="font-semibold">
              Dosage:
            </span>{" "}
            {schedule.dosage}
          </p>

          <p>
            <span className="font-semibold">
              Frequency:
            </span>{" "}
            {schedule.frequency}
          </p>

          <p>
            <span className="font-semibold">
              Time:
            </span>{" "}
            {schedule.times.join(", ")}
          </p>

        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">

          <button
            onClick={onTaken}
            className="bg-green-600 text-white rounded-xl py-2 hover:bg-green-700"
          >
            ✓ Taken
          </button>

          <button
            onClick={onMissed}
            className="bg-red-600 text-white rounded-xl py-2 hover:bg-red-700"
          >
            ✗ Missed
          </button>

          <button
            onClick={onSnooze}
            className="bg-yellow-500 text-white rounded-xl py-2 hover:bg-yellow-600"
          >
            ⏰ Snooze
          </button>

        </div>

        <button
          onClick={onClose}
          className="mt-5 text-sm text-slate-500 hover:text-black"
        >
          Close
        </button>

      </div>

    </div>
  );
}

export default ReminderPopup;