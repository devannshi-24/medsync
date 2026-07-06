import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import { getDashboardData } from "../services/dashboardService";
import {
  FiActivity,
  FiCalendar,
  FiCheckCircle,
  FiXCircle
} from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import ReminderPopup from "../components/ReminderPopup";
import { GiMedicines } from "react-icons/gi";
import PageHeader from "../components/PageHeader";
import { addDoseLog } from "../services/doseLogService";
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
    if (hour < 12) return "Good Morning 🌅";
    if (hour < 17) return "Good Afternoon ☀️";
    if (hour < 21) return "Good Evening 🌆";
    return "Good Night 🌙";
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {

    if (!scheduleId || todaySchedules.length === 0)
        return;

    const schedule = todaySchedules.find(
        item => item._id === scheduleId
    );

    if (schedule) {
        setSelectedSchedule(schedule);
        setShowReminderPopup(true);
    }

  }, [scheduleId, todaySchedules]);

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
            status: "taken"
        });
        alert("Dose logged successfully!");
        setShowReminderPopup(false);
        fetchDashboard();
    } catch (err) {
        console.log(err);
    }
  };
  const handleMissed = async () => {
    try{
        await addDoseLog({
          scheduleId: selectedSchedule._id,
            status: "missed"
        });
        alert("Dose marked as missed!");
        setShowReminderPopup(false);
        fetchDashboard();
    }
    catch(err){
      console.log(err);
    }
  };
  const handleSnooze = async () => {
    try{
      await snoozeReminder(
        selectedSchedule._id,
        10
      );
      alert("Reminder snoozed for 10 minutes!");
      setShowReminderPopup(false);
      setSearchParams({});
    }
    catch(err){
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
        onClose = {() => {
          setShowReminderPopup(false);
          setSearchParams({});
        }}
      />
    )}
    <DashboardLayout>
      <PageHeader
        title={getGreeting()}
        subtitle="Here's how your health is tracking today."
        showSearch={true}
        searchPlaceholder="Search medicines..."
        actionButton={
          <button className="bg-blue-600 text-white px-5 py-3 rounded-xl">
            Log Dose
          </button>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

        <StatCard
          title="Total Medicines"
          value={stats?.totalMedicines}
          icon={<GiMedicines />}
          subtitle="Registered medicines"
        />

        <StatCard
          title="Active Schedules"
          value={stats?.activeSchedules}
          icon={<FiCalendar />}
          subtitle="Currently active"
        />

        <StatCard
          title="Taken Doses"
          value={stats?.takenDoses}
          icon={<FiCheckCircle />}
          subtitle="Successfully logged"
        />

        <StatCard
          title="Missed Doses"
          value={stats?.missedDoses}
          icon={<FiXCircle />}
          subtitle="Needs attention"
        />

        <StatCard
          title="Adherence Score"
          value={`${stats?.adherenceScore}%`}
          icon={<FiActivity />}
          subtitle="Medication compliance"
        />

      </div>
      <div className="mt-8">

      <h2 className="text-2xl font-bold mb-4">
        Today's Schedule
      </h2>

      {
       todaySchedules.length === 0 ? (

       <div className="bg-white rounded-2xl shadow-md p-6">

        <p className="text-slate-500">
          No medicines scheduled for today.
        </p>

       </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

         {
          todaySchedules.map((schedule, index) => (

            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
            >

              <h3 className="text-lg font-semibold text-slate-800">
                {schedule.medicine}
              </h3>

              <p className="text-slate-500 mt-1">
                {schedule.dosage}
              </p>

              <p className="text-sm text-blue-500 mt-2 capitalize">
                {schedule.frequency}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">

                {
                  schedule.times.map((time, i) => (

                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm"
                    >
                      {time}
                    </span>

                  ))
                }

              </div>

            </div>

           ))
          }

        </div>

      )
      }

    </div>

    </DashboardLayout>
    </>
  );
}

export default Dashboard