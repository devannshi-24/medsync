import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import PageHeader from "../components/PageHeader";
import ScheduleForm from "../components/ScheduleForm";
import {getSchedules,addSchedule,deleteSchedule,updateSchedule} from "../services/scheduleService";
import { getMedicines } from "../services/medicineService";
import { IoCloseCircleOutline } from "react-icons/io5";
import Highlight from "../components/Highlight";


function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] =useState(null);
  const [search, setSearch] = useState("");

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
  const handleDeleteSchedule = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this schedule?"
    );
    if (!confirmDelete) return;
    try {
      const data = await deleteSchedule(id);
      toast.success(data.message);
      fetchSchedules();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to delete schedule"
      );
    }
  };
  const handleUpdateSchedule =
  async (formData) => {
    try {
      const data = await updateSchedule(
          editingSchedule._id,
          formData
        );
      toast.success(data.message);
      setEditingSchedule(null);
      setShowModal(false);
      fetchSchedules();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to update schedule"
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
    (schedule.isActive ? "active" : "inactive")
      .includes(query)
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
            filtered: filteredSchedules.length,
            total: schedules.length,
           }
          : null
        }
        actionButton={
          <button onClick={() => {
            setEditingSchedule(null);
            setShowModal(true);
          }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl">Add Schedule</button>}/>

      <div className="p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-slate-500 text-sm">
              Active Schedules
            </h3>
            <p className="text-4xl font-bold mt-2">
              {activeSchedules}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-slate-500 text-sm">
              Total Schedules
            </h3>
            <p className="text-4xl font-bold mt-2">
              {schedules.length}
            </p>
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
          className="absolute top-5 right-5 text-slate-500 hover:text-red-500"
        >
          <IoCloseCircleOutline size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {editingSchedule ? "Edit Schedule" : "Add Schedule"}
        </h2>

        <ScheduleForm
          medicines={medicines}
          initialData={editingSchedule}
          onSubmit={
            editingSchedule
              ? handleUpdateSchedule
              : handleAddSchedule
          }
          buttonText={
            editingSchedule
              ? "Update Schedule"
              : "Save Schedule"
          }
        />

      </div>

    </div>
  )
}

        {/* Schedule Cards */}

        <h2 className="text-2xl font-bold mb-5">
          Your Schedules
        </h2>

        {
          loading ? (

            <p>Loading schedules...</p>

          ) : filteredSchedules.length === 0 ? (

            <div className=" bg-white rounded-2xl p-8 shadow-sm">
              {search ? "No matching schedules found." : "No schedules created yet."}
            </div>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {
                filteredSchedules.map(schedule => (
                  <div
                    key={schedule._id}
                    className="
                      bg-white
                      rounded-3xl
                      p-6 shadow-sm">
                    <h3 className="text-xl font-bold">
                      <Highlight text={schedule.medicineId?.name} query={search}/>
                    </h3>
                    <p className="mt-3">
                      Dosage:
                      <span className="ml-2 font-medium">
                        <Highlight text={schedule.dosage} query={search}/>
                      </span>
                    </p>
                    <p>
                      Frequency:
                      <span className="ml-2 capitalize font-medium">
                        <Highlight text={schedule.frequency} query={search}/>
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {
                        schedule.times.map((time, index) => (

                          <span
                            key={index} className=" bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                            <Highlight text={time} query={search} />
                          </span>

                        ))
                      }
                    </div>
                    <div className="mt-5 text-sm text-slate-500">
                      <p>
                        Start:
                        {" "}
                        {new Date(
                          schedule.startDate
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        End:
                        {" "}
                        {new Date(
                          schedule.endDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-5">
                      <span
                        className={`
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          ${
                            schedule.isActive
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }
                        `}>
                        <Highlight text={schedule.isActive? "Active": "Inactive"}query={search}/>
                      </span>

                    </div>

                    <div className="mt-5 flex gap-2">

  <button
    onClick={() => {

      setEditingSchedule(schedule);

      setShowModal(true);

    }}
    className="
      bg-blue-500
      hover:bg-blue-600
      text-white
      px-4
      py-2
      rounded-lg
    "
  >
    Edit
  </button>

  <button
    onClick={() =>
      handleDeleteSchedule(schedule._id)
    }
    className="
      bg-red-500
      hover:bg-red-600
      text-white
      px-4
      py-2
      rounded-lg
    "
  >
    Delete
  </button>

</div>

                  </div>

                ))
              }

            </div>

          )
        }

      </div>

    </DashboardLayout>
  );
}

export default Schedules;