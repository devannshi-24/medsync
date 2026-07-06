import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCalendar, FiTrash2 } from "react-icons/fi";

import DashboardLayout from "../components/DashboardLayout";
import Highlight from "../components/Highlight";
import PageHeader from "../components/PageHeader";
import SymptomForm from "../components/SymptomForm";

import {
  getSymptoms,
  addSymptom,
  deleteSymptom
} from "../services/symptomService";

function Symptoms() {

  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSymptoms = async () => {
    try {
      const data = await getSymptoms();
      setSymptoms(data.symptoms || []);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error("Failed to fetch symptoms");
      }
      setSymptoms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const handleAddSymptom = async (formData) => {
    try {
      const data = await addSymptom(formData);
      toast.success(data.message);
      fetchSymptoms();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save symptom"
      );
    }
  };

  const handleDeleteSymptom = async (id) => {
    const confirmDelete = window.confirm("Delete this symptom entry?");
    if (!confirmDelete) return;
    try {
      const data = await deleteSymptom(id);
      toast.success(data.message);
      fetchSymptoms();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete symptom"
      );
    }
  };

  const getUrgency = (severity) => {
    if (severity === "mild") {
      return { text: "Low", badge: "bg-green-100 text-green-700" };
    }
    if (severity === "moderate") {
      return { text: "Monitor", badge: "bg-yellow-100 text-yellow-700" };
    }
    return { text: "See Doctor", badge: "bg-red-100 text-red-700" };
  };

  const filteredSymptoms = symptoms.filter((entry) => {
  const query = search.toLowerCase();

  return (
    entry.symptom?.toLowerCase().includes(query) ||
    entry.notes?.toLowerCase().includes(query) ||
    entry.severity?.toLowerCase().includes(query)
  );
});

  // Format date like: 22 Jun 2025 • 08:14 PM
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) + 
    " • " + 
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <DashboardLayout>

      <PageHeader
        title="Symptom Checker"
        subtitle="Log symptoms and monitor your health."
        showSearch={true}
        searchPlaceholder="Search symptoms..."
        searchValue={search}
        onSearchChange={setSearch}
        resultCount={
         search
          ? {
          filtered: filteredSymptoms.length,
          total: symptoms.length,
           }: null}
      />

      <div className="px-5 pb-5">

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm mb-4">
          <h2 className="text-2xl font-semibold mb-3 text-slate-900">
            What are you feeling?
          </h2>
          <SymptomForm onSubmit={handleAddSymptom} />
        </div>

        {/* Recent Entries */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">

          <h2 className="text-xl font-semibold mb-4 text-slate-900">
            Recent Entries
          </h2>

          {loading ? (

            <p className="text-slate-500">Loading symptoms...</p>

          ) : filteredSymptoms.length === 0 ? (

            <p className="text-slate-500">{search ? "No matching symptom entries found.": "No symptom entries yet."}</p>

          ) : (

            <div className="space-y-3">
              {filteredSymptoms.map((entry) => {

                const urgency = getUrgency(entry.severity);

                return (
                  <div
                    key={entry._id}
                    className="border border-slate-200 rounded-2xl p-4 bg-white hover:shadow-sm transition"
                  >
                    {/* Top row: date + urgency badge + delete */}
                    <div className="flex items-center justify-between mb-3">

                      {/* Date with calendar icon */}
                      <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                        <FiCalendar className="text-slate-400 shrink-0" />
                        <span>{formatDate(entry.loggedAt)}</span>
                      </div>

                      {/* Urgency badge + trash icon */}
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${urgency.badge}`}>
                          {urgency.text}
                        </span>
                        <button
                          onClick={() => handleDeleteSymptom(entry._id)}
                          className="text-red-400 hover:text-red-600 transition p-1"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>

                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full border border-slate-200 text-sm text-slate-700">
                       <Highlight
                      text={entry.symptom} query={search}/>
                      </span>
                    </div>

                    {/* Notes */}
                    {entry.notes && (
                      <p className="text-slate-500 text-sm mt-2">
                        <Highlight text={entry.notes} query={search}/>
                      </p>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Symptoms;