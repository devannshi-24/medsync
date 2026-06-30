import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import MedicineForm from "../components/MedicineForm";
import PageHeader from "../components/PageHeader";
import { IoCloseCircleOutline } from "react-icons/io5";
import {getMedicines,addMedicine,deleteMedicine,updateMedicine} from "../services/medicineService";
import toast from "react-hot-toast";
import { GiMedicines } from "react-icons/gi";

function Medicines() {

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  const fetchMedicines = async () => {
    try {
      const data = await getMedicines();
      setMedicines(data.medicines);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch medicines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleAddMedicine = async (formData) => {
    try {
      const data = await addMedicine(formData);
      toast.success(data.message);
      setShowModal(false);
      fetchMedicines();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to add medicine"
      );
    }
  };
  const handleUpdateMedicine = async (formData) => {
  try {

    const data = await updateMedicine(
      editingMedicine._id,
      formData
    );
    console.log(editingMedicine);
    toast.success(data.message);

    setEditingMedicine(null);

    setShowModal(false);

    fetchMedicines();

  } catch (error) {

    console.log(error);

    toast.error(
      error.response?.data?.message ||
      "Failed to update medicine"
    );

  }
};

  const handleDeleteMedicine = async (id) => {
    const confirmDelete = window.confirm("This will archive the medicine and deactivate related schedules. Continue?");
    if (!confirmDelete) return;
    try {
      const data = await deleteMedicine(id);
      toast.success(data.message);
      fetchMedicines();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete medicine");
    }
  };

  return (
    <DashboardLayout>

      <PageHeader
        title="Medicines"
        subtitle="Manage all your medicines."
        showSearch={true}
        searchPlaceholder="Search medicines..."
        actionButton={
         <button onClick={() =>{
          setEditingMedicine(null);
          setShowModal(true);
         }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium">Add Medicine</button>
        }
      />

      <div className="mt-8">
        {
          showModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-xl rounded-3xl p-6 relative shadow-xl">
                <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 text-slate-500 hover:text-red-500"><IoCloseCircleOutline size={22} /></button>
                <h2 className="text-2xl font-bold mb-6">{
    editingMedicine
      ? "Edit Medicine"
      : "Add Medicine"
  }</h2>
                <MedicineForm initialData={editingMedicine}
                onSubmit={editingMedicine? handleUpdateMedicine: handleAddMedicine}
                buttonText={editingMedicine? "Update Medicine": "Save Medicine"}/>
                </div>
            </div>
          )
        }

        <h2 className="text-2xl font-semibold mb-4">Your Medicines</h2>
        {
          loading ? (
            <p>Loading medicines...</p>
          ) : medicines.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <p className="text-slate-500">
                No medicines added yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {
                medicines.map((medicine) => (
                  <div key={medicine._id} className="bg-white rounded-2xl shadow-md p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <GiMedicines className="text-blue-500 text-xl" />
                      <h3 className="font-bold text-lg">{medicine.name}</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">
                      <span className="font-medium">
                        Purpose:
                      </span>{" "}
                      {medicine.purpose}
                    </p>
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">
                        Notes:
                      </span>{" "}
                      {medicine.notes}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => {
                        setEditingMedicine(medicine);
                        setShowModal(true);}}className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Edit</button>
                        <button onClick={() =>handleDeleteMedicine(medicine._id)}className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">Delete</button>
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

export default Medicines;