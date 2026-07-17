import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import { getDashboardData } from "../services/dashboardService";
import {
  FiActivity,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import ReminderPopup from "../components/ReminderPopup";
import { GiMedicines } from "react-icons/gi";
import PageHeader from "../components/PageHeader";
import { addDoseLog } from "../services/doselogService";
import { snoozeReminder } from "../services/scheduleService";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const scheduleId = searchParams.get("scheduleId");
  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const stats = dashboardData?.stats;
  const todaySchedules = dashboardData?.todaySchedules || [];
  const recentActivity = dashboardData?.recentActivity || [];

  const fetchDashboard = async () => {
    try {
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getGreeting = () => {
    const hour = new Date().getHours(); // 0-23
    if (hour < 12) return "Good Morning  ☀️";
    if (hour < 17) return "Good Afternoon 🌤️";
    if (hour < 21) return "Good Evening 🌆";
    return "Good Night 🌙";
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (!scheduleId || todaySchedules.length === 0) return;

    const schedule = todaySchedules.find((item) => item._id === scheduleId);

    if (schedule) {
      setSelectedSchedule(schedule);
      setShowReminderPopup(true);
    }
  }, [scheduleId, todaySchedules]);

  useEffect(() => {
    const handleReminder = (event) => {
      const incomingScheduleId = event.detail.scheduleId;

      const schedule = todaySchedules.find(
        (item) => item._id === incomingScheduleId,
      );

      if (schedule) {
        setSelectedSchedule(schedule);
        setShowReminderPopup(true);
      }
    };

    window.addEventListener("medicine-reminder", handleReminder);

    return () => {
      window.removeEventListener("medicine-reminder", handleReminder);
    };
  }, [todaySchedules]);

  if (loading) {
    return (
      <DashboardLayout>
        <h2>Loading Dashboard...</h2>
      </DashboardLayout>
    );
  }

  const handleTaken = async () => {
    try {
      await addDoseLog({
        scheduleId: selectedSchedule._id,
        status: "taken",
      });
      alert("Dose logged successfully!");
      setShowReminderPopup(false);
      fetchDashboard();
    } catch (err) {
      console.log(err);
    }
  };
  const handleMissed = async () => {
    try {
      await addDoseLog({
        scheduleId: selectedSchedule._id,
        status: "missed",
      });
      alert("Dose marked as missed!");
      setShowReminderPopup(false);
      fetchDashboard();
    } catch (err) {
      console.log(err);
    }
  };
  const handleSnooze = async () => {
    try {
      await snoozeReminder(selectedSchedule._id, 10);
      alert("Reminder snoozed for 10 minutes!");
      setShowReminderPopup(false);
      setSearchParams({});
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {showReminderPopup && (
        <ReminderPopup
          schedule={selectedSchedule}
          onTaken={handleTaken}
          onMissed={handleMissed}
          onSnooze={handleSnooze}
          onClose={() => {
            setShowReminderPopup(false);
            setSearchParams({});
          }}
        />
      )}
      <DashboardLayout>
        <PageHeader
          title={getGreeting()}
          subtitle="Here's how your health is tracking today."
        />
        <div className="p-6 pb-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            <StatCard
              title="Total Medicines"
              value={stats?.totalMedicines}
              icon={<GiMedicines />}
              subtitle="Registered medicines"
              color="blue"
            />

            <StatCard
              title="Active Schedules"
              value={stats?.activeSchedules}
              icon={<FiCalendar />}
              subtitle="Currently active"
              color="purple"
            />

            <StatCard
              title="Taken Doses"
              value={stats?.takenDoses}
              icon={<FiCheckCircle />}
              subtitle="Successfully logged"
              color="green"
            />

            <StatCard
              title="Missed Doses"
              value={stats?.missedDoses}
              icon={<FiXCircle />}
              subtitle="Needs attention"
              color="red"
            />

            <StatCard
              title="Adherence Score"
              value={`${stats?.adherenceScore}%`}
              icon={<FiActivity />}
              subtitle="Medication compliance"
              color="yellow"
            />
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Today's Schedule</h2>

            {todaySchedules.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <p className="text-slate-500">
                  No medicines scheduled for today.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todaySchedules.map((schedule, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 hover:shadow-md hover:border-blue-100 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-base font-bold text-slate-800">
                        {schedule.medicine}
                      </h3>
                      <span className="shrink-0 text-xs font-medium text-blue-500 bg-blue-50 px-2.5 py-0.5 rounded-full capitalize">
                        {schedule.frequency}
                      </span>
                    </div>

                    <p className="text-sm text-slate-400 mb-3">
                      💊 {schedule.dosage}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <FiClock className="text-blue-400 text-xs shrink-0" />
                      {schedule.times.map((time, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4 mt-8">
              <h2 className="text-2xl font-bold text-slate-800">
                Recent Activity
              </h2>
            </div>

            {recentActivity.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <p className="text-slate-400 text-sm">
                  No recent activity yet.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {recentActivity
                  .filter((activity) => activity.medicine)
                  .map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition"
                    >
                      {/* Left: dot + medicine name */}
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            activity.status === "taken"
                              ? "bg-green-500"
                              : "bg-red-400"
                          }`}
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {activity.medicine}
                        </span>
                      </div>

                      {/* Middle: status badge */}
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          activity.status === "taken"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-500"
                        }`}
                      >
                        {activity.status === "taken" ? "Taken" : "Missed"}
                      </span>

                      {/* Right: date + time */}
                      <div className="text-right">
                        <p className="text-xs text-slate-500">
                          {new Date(activity.loggedAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(activity.loggedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          {/* ── Weekly Stats ── */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Weekly Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Taken */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Taken this week
                  </p>
                  <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                    <FiCheckCircle className="text-green-500 text-sm" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-600">
                  {dashboardData?.weeklyStats?.weeklyTakenDoses}
                </p>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${dashboardData?.weeklyStats?.weeklyAdherenceScore}%`,
                    }}
                  />
                </div>
              </div>

              {/* Missed */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Missed this week
                  </p>
                  <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                    <FiXCircle className="text-red-400 text-sm" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-red-500">
                  {dashboardData?.weeklyStats?.weeklyMissedDoses}
                </p>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-red-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        dashboardData?.weeklyStats?.weeklyTakenDoses +
                          dashboardData?.weeklyStats?.weeklyMissedDoses ===
                        0
                          ? 0
                          : Math.round(
                              (dashboardData?.weeklyStats?.weeklyMissedDoses /
                                (dashboardData?.weeklyStats?.weeklyTakenDoses +
                                  dashboardData?.weeklyStats
                                    ?.weeklyMissedDoses)) *
                                100,
                            )
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Weekly Adherence */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Weekly adherence
                  </p>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                    <FiActivity className="text-blue-500 text-sm" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  {dashboardData?.weeklyStats?.weeklyAdherenceScore}%
                </p>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      dashboardData?.weeklyStats?.weeklyAdherenceScore >= 80
                        ? "bg-green-400"
                        : dashboardData?.weeklyStats?.weeklyAdherenceScore >= 50
                          ? "bg-yellow-400"
                          : "bg-red-400"
                    }`}
                    style={{
                      width: `${dashboardData?.weeklyStats?.weeklyAdherenceScore}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

export default Dashboard;
