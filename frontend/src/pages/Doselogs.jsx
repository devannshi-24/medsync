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
import { FiCheckCircle, FiXCircle, FiActivity, FiList } from "react-icons/fi";

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

          <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
             <FiList className="text-slate-500 text-lg" />
           </div>
            <div>
               <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total Logs</p>
               <p className="text-2xl font-bold text-slate-800 mt-0.5">{doseLogs.length}</p>
           </div>
          </div>

          <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <FiCheckCircle className="text-green-500 text-lg" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Taken</p>
              <p className="text-2xl font-bold text-green-600 mt-0.5">{takenCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <FiXCircle className="text-red-400 text-lg" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Missed</p>
              <p className="text-2xl font-bold text-red-500 mt-0.5">{missedCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
               <FiActivity className="text-blue-500 text-lg" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Adherence</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{adherenceScore}%</p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                  adherenceScore >= 80? "bg-green-400": adherenceScore >= 50? "bg-yellow-400": "bg-red-400"}`}
                  style={{ width: `${adherenceScore}%` }}
                />
              </div>
            </div>
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
      

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

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

        <thead>
          <tr className="bg-sky-50 border-b border-slate-200">
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Medicine</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Dosage</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Logged At</th>
          </tr>
        </thead>

        <tbody>

          {filteredDoseLogs.map((log) => (

            <tr
              key={log._id}
              className="border-t border-slate-100 hover:bg-slate-50 transition"
            >

              <td className="px-5 py-3.5 text-sm font-medium text-slate-800">
                <Highlight text={log.medicineName} query={search}/>
              </td>

              <td className="px-5 py-3.5 text-sm text-slate-600">
                <Highlight text={log.dosage} query={search}/>
              </td>

              <td className="px-5 py-3.5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  log.status === "taken"? "bg-green-100 text-green-700": "bg-red-100 text-red-600"}`}>
               <span className={`w-2 h-2 rounded-full shrink-0 ${log.status === "taken" ? "bg-green-500" : "bg-red-400"}`} />
                  {log.status === "taken" ? "Taken" : "Missed"}
               </span>
             </td>

              <td className="px-5 py-3.5">
                <p className="text-sm text-slate-700">{new Date(log.loggedAt).toLocaleDateString()} </p>
               <p className="text-xs text-slate-400 mt-0.5">{new Date(log.loggedAt).toLocaleTimeString()}</p>
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