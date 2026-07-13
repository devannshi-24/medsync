import DashboardLayout from "../components/DashboardLayout";
import PersonalInfoCard from "../components/profile/PersonalInfoCard";
import HealthInfoCard from "../components/profile/HealthInfoCard";
import PasswordCard from "../components/profile/PasswordCard";
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/profileService";
import toast from "react-hot-toast";

function Profile() {
  const [profile, setProfile] = useState({
   name: "",
   email: "",
   age: "",
   gender: "",
   weight: "",
   height: "",
   chronicConditions: [],
   allergies: [],
   timezone: "Asia/Kolkata",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
   try {
    const data = await getProfile();
    setProfile({
      name: data.user.name || "",
      email: data.user.email || "",
      age: data.profile?.age || "",
      gender: data.profile?.gender || "",
      weight: data.profile?.weight || "",
      height: data.profile?.height || "",
      chronicConditions: data.profile?.chronicConditions || [],
      allergies: data.profile?.allergies || [],
      timezone: data.profile?.timezone || "Asia/Kolkata",
    });
   }
   catch (error) {
    console.log(error);
   }
   finally {
    setLoading(false);
   } 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "age" || name === "weight" || name === "height") && Number(value) < 0) 
    {
      return;
    }

    setProfile((prev) => ({
     ...prev,
     [name]: value,
    }));
  };

  const handleSave = async () => {
   try {
    setSaving(true);
    await updateProfile({
      age: profile.age,
      gender: profile.gender,
      weight: profile.weight,
      height: profile.height,
      chronicConditions: profile.chronicConditions,
      allergies: profile.allergies,
      timezone: profile.timezone,
    });
     toast.success("Profile updated successfully!");
    }
   catch (error) {
    toast.error("Couldn't update profile.");
   }
   finally {
    setSaving(false);
   }
  };


  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 px-10 py-8">
        <div className="max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
              Profile
            </h1>
            <p className="text-slate-500 mt-2">
              Manage your personal information and health details.
            </p>
         </div>
        <PersonalInfoCard 
           profile={profile}
           handleChange={handleChange}
        />
        <HealthInfoCard 
          profile={profile}
          handleChange={handleChange}
        />
        <div className="flex justify-end mt-8 mb-10">
          <button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-xl shadow-sm transition">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
        <PasswordCard />
      </div>
    </div>
    </DashboardLayout>
  );
}

export default Profile;