import React from 'react';
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import PageHeader from "../components/PageHeader";
import DoseLogForm from "../components/DoseLogForm";
import {getDoseLogs,addDoseLog} from "../services/doselogService";
import { getSchedules } from "../services/scheduleService";
import { IoCloseCircleOutline } from "react-icons/io5";
import Highlight from "../components/Highlight";

function Doselogs() {
  const [doseLogs, setDoseLogs] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const fetchDoseLogs = async () => {
   try {
    const data = await getDoseLogs();
    setDoseLogs(data.doseLogs || []);
   } catch (error) {

     if (
      error.response?.status !== 404
     ) {
      toast.error("Failed to fetch dose logs");
     }setDoseLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async () => {
   try {
    const data = await getSchedules();
    setSchedules(data.schedules);
   } catch (error) {
    toast.error("Failed to fetch schedules");
   }
  };

  useEffect(() => {
    fetchDoseLogs();
    fetchSchedules();
  }, []);

  const handleAddDoseLog = async (formData) => {
   try {
    const data = await addDoseLog(formData);
    toast.success(data.message);
    setShowModal(false);
    fetchDoseLogs();
   } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to log dose"
    );
   }
  };

  const takenCount = doseLogs.filter(log => log.status === "taken").length;
  const missedCount = doseLogs.filter(log => log.status === "missed").length;
  const adherenceScore = doseLogs.length === 0 ? 0: Math.round((takenCount / doseLogs.length) * 100);

  const filteredDoseLogs = doseLogs.filter((log) => {
  const query = search.toLowerCase();

  return (
    log.medicineName?.toLowerCase().includes(query) ||
    log.dosage?.toLowerCase().includes(query) ||
    log.status?.toLowerCase().includes(query) ||
    new Date(log.loggedAt)
      .toLocaleString()
      .toLowerCase()
      .includes(query)
  );});

  return (
    <DashboardLayout>
      <PageHeader
        title="Dose Logs"
        subtitle="Track medication history."
        showSearch={true}
        searchValue={search}
        searchPlaceholder="Search logs..."
        onSearchChange={setSearch}
        resultCount={
        search
          ? {
            filtered: filteredDoseLogs.length,
            total: doseLogs.length,
          }
          : null}
        actionButton={
         <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl">Log Dose </button>
        }
      />
      
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-slate-500 text-sm">
              Total Logs
            </h3>
            <p className="text-4xl font-bold mt-2">{doseLogs.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-slate-500 text-sm">Taken</h3>
            <p className="text-4xl font-bold text-green-600 mt-2">{takenCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-slate-500 text-sm">Missed</h3>
            <p className="text-4xl font-bold text-red-600 mt-2">{missedCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-slate-500 text-sm">Adherence</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">{adherenceScore}%</p>
          </div>
        </div>
        {
         showModal && (
           <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
             <div className="bg-white w-full max-w-lg rounded-3xl p-6 relative shadow-xl">

           <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 text-slate-500 hover:text-red-500"><IoCloseCircleOutline size={24} /></button>
           <h2 className="text-2xl font-bold mb-6">Log Dose</h2>
           <DoseLogForm
            schedules={schedules}
            onSubmit={handleAddDoseLog}
            buttonText="Save Log"
           />
             </div>
          </div>
          )
       }
      

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

  {
    loading ? (

      <div className="p-8 text-center">
        Loading dose logs...
      </div>

    ) : filteredDoseLogs.length === 0 ? (

      <div className="p-8 text-center text-slate-500">
        {search ? "No matching dose logs found.": "No dose logs yet."}
      </div>

    ) : (

      <table className="w-full">

        <thead className="bg-slate-100">
          <tr>
            <th className="text-left p-4">Medicine</th>
            <th className="text-left p-4">Dosage</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Logged At</th>
          </tr>
        </thead>

        <tbody>

          {filteredDoseLogs.map((log) => (

            <tr
              key={log._id}
              className="border-t"
            >

              <td className="p-4">
                <Highlight text={log.medicineName} query={search}/>
              </td>

              <td className="p-4">
                <Highlight text={log.dosage} query={search}/>
              </td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    log.status === "taken"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  <Highlight text={log.status} query={search}/>
                </span>
              </td>

              <td className="p-4">
                <Highlight text={new Date(log.loggedAt).toLocaleString()} query={search}/>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    )
  }

</div>
      </div>

 


    </DashboardLayout>
  );
}

export default Doselogs;