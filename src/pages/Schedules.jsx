import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import PageHeader from "../components/PageHeader";
import ScheduleForm from "../components/ScheduleForm";
import {getSchedules,addSchedule,deleteSchedule,updateSchedule} from "../services/scheduleService";
import { getMedicines } from "../services/medicineService";
import { IoCloseCircleOutline } from "react-icons/io5";
import Highlight from "../components/Highlight";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { FiCalendar, FiClock, FiEdit2, FiTrash2, FiZap, FiList } from "react-icons/fi";

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] =useState(null);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchSchedules = async () => {
    try {
      const data = await getSchedules();
      setSchedules(data.schedules);
    } catch (error) {
      toast.error("Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  };
  const fetchMedicines = async () => {
    try {
      const data = await getMedicines();
      setMedicines(data.medicines);
    } catch (error) {
      toast.error("Failed to fetch medicines");
    }
  };
  useEffect(() => {
    fetchSchedules();
    fetchMedicines();
  }, []);
  const handleAddSchedule = async (formData) => {
    try {
      const data = await addSchedule(formData);
      toast.success(data.message);
      setShowModal(false);
      fetchSchedules();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to add schedule"
      );
    }
  };
  const handleDeleteSchedule = async () => {
    try {
      const data = await deleteSchedule(deleteId);
      toast.success(data.message);
      setDeleteId(null);
      fetchSchedules();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete schedule"
      );
    }
  };
  const handleUpdateSchedule =
  async (formData) => {
    try {
      const data = await updateSchedule(editingSchedule._id,formData);
      toast.success(data.message);
      setEditingSchedule(null);
      setShowModal(false);
      fetchSchedules();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update schedule"
      );
    }
};
  const activeSchedules = schedules.filter(schedule => schedule.isActive).length;
  const filteredSchedules = schedules.filter((schedule) => {
  const query = search.toLowerCase();

  return (
    schedule.medicineId?.name?.toLowerCase().includes(query) ||
    schedule.dosage?.toLowerCase().includes(query) ||
    schedule.frequency?.toLowerCase().includes(query) ||
    schedule.times?.some((time) =>
      time.toLowerCase().includes(query)
    ) ||
    (schedule.isActive ? "active" : "inactive").includes(query)
   );
  });
  
  return (
    <DashboardLayout>
      <PageHeader
        title="Schedules"
        subtitle="Manage medication schedules."
        showSearch={true}
        searchPlaceholder="Search schedules..."
        searchValue={search}
        onSearchChange={setSearch}
        resultCount={
         search
           ? {
            filtered: filteredSchedules.length, total: schedules.length,}
          : null
        }
        actionButton={
          <button onClick={() => {
            setEditingSchedule(null);
            setShowModal(true);
          }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl">Add Schedule</button>}/>

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <FiZap className="text-green-500 text-lg" />
           </div>

           <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
            Active
           </p>

            <p className="text-2xl font-bold text-slate-800">
              {activeSchedules}
            </p>
           </div>
         </div>

      <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <FiList className="text-blue-500 text-lg" />
        </div>

        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
              Total
          </p>

          <p className="text-2xl font-bold text-slate-800">
            {schedules.length}
           </p>
         </div>
       </div>
      </div>
        {/* Modal */}
        {
     showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-xl rounded-3xl p-6 relative shadow-xl">
        <button
          onClick={() => {
            setShowModal(false);
            setEditingSchedule(null);
          }}
          className="absolute top-5 right-5 text-slate-500 hover:text-red-500 transition">
          <IoCloseCircleOutline size={22} />
        </button>

        <h2 className="text-xl font-bold mb-5 text-slate-800-">
          {editingSchedule ? "Edit Schedule" : "Add Schedule"}
        </h2>

        <ScheduleForm
          medicines={medicines}
          initialData={editingSchedule}
          onSubmit={editingSchedule? handleUpdateSchedule : handleAddSchedule}
          buttonText={editingSchedule? "Update Schedule": "Save Schedule"}
        />
        </div>

        </div>
      )}

        {/* Schedule Cards */}
       <div>
        <h2 className="text-base font-semibold text-slate-500 uppercase tracking-wide mb-4">
          Your Schedules
        </h2>

        {
          loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
               {[1,2,3].map((i)=>(
               <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse h-44"/>
             ))}
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
              <p className="text-slate-400 text-sm">
                {search ? `No schedules matching "${search}"` : "No schedules created yet."}
              </p>
            </div>
          ) : (
             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredSchedules.map((schedule) => (
                <div
                  key={schedule._id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all flex flex-col gap-3"
                >
                  {/* Top row: name + status */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-800 leading-tight">
                      <Highlight text={schedule.medicineId?.name} query={search} />
                    </h3>
                    <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      schedule.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      <Highlight text={schedule.isActive ? "Active" : "Inactive"} query={search} />
                    </span>
                  </div>
 
                  {/* Dosage + Frequency pills */}
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-slate-50 border border-slate-200 text-slate-600 text-xs px-2.5 py-1 rounded-lg font-medium">
                      💊 <Highlight text={schedule.dosage} query={search} />
                    </span>
                    <span className="bg-slate-50 border border-slate-200 text-slate-600 text-xs px-2.5 py-1 rounded-lg font-medium capitalize">
                      🔁 <Highlight text={schedule.frequency} query={search} />
                    </span>
                  </div>
 
                  {/* Time chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <FiClock className="text-blue-400 text-xs shrink-0" />
                    {schedule.times.map((time, i) => (
                      <span key={i} className="bg-blue-50 text-blue-600 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        <Highlight text={time} query={search} />
                      </span>
                    ))}
                  </div>
 
                  {/* Date range */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <FiCalendar className="shrink-0" />
                    <span>
                      {new Date(schedule.startDate).toLocaleDateString()} → {new Date(schedule.endDate).toLocaleDateString()}
                    </span>
                  </div>
 
                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-slate-100 mt-auto">
                    <button
                      onClick={() => { setEditingSchedule(schedule); setShowModal(true); }}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold py-2 rounded-xl transition"
                    >
                      <FiEdit2 size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(schedule._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold py-2 rounded-xl transition"
                    >
                      <FiTrash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
              
          )}
      </div>
      </div>

      <DeleteConfirmModal
        open={!!deleteId}
        title="Delete Schedule"
        message="This schedule will be permanently deleted. This action cannot be undone."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDeleteSchedule}
      />
    </DashboardLayout>
  );
}

export default Schedules;