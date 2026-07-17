import { NavLink } from "react-router-dom";

import {FiGrid,FiUser,FiCalendar,FiFileText,FiLogOut,FiMessageSquare } from "react-icons/fi";
import { FaHeartbeat, FaNotesMedical} from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { logoutUser } from "../services/authService";


function Sidebar() {

  const navLinkClass = ({ isActive }) =>
    `
      flex items-center gap-4
      px-5 py-4
      rounded-2xl
      transition-all duration-200
      text-lg
      ${
        isActive
          ? "bg-blue-100 text-blue-600 font medium"
          : "text-slate-600 hover:bg-white/50"
      }
    `;
  const navigate = useNavigate();
  const { checkAuth } = useContext(AuthContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      const data = await logoutUser();
      localStorage.removeItem("token");
      await checkAuth();
      toast.success(data.message);
      
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Logout failed"
     );
    }
  } ;
  return (
    <aside className="w-72 min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex flex-col">
      {/* Logo */}

      <div className="px-8 py-8">

        <div className="flex items-center gap-4">

          <div
            className=" w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
            <FaHeartbeat className="text-white text-xl" />
          </div>

          <div>

            <h1 className="text-2xl font-semibold text-slate-900">
              MedSync
            </h1>
            <p className="text-slate-400 text-sm">
              Health command center
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}

      <nav
        className="flex-1 px-5 mt-2 space-y-2">

        <NavLink
          to="/dashboard"
          className={navLinkClass}
        >
          <FiGrid size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/medicines"
          className={navLinkClass}
        >
          <GiMedicines size={20} />
          Medications
        </NavLink>

        <NavLink
          to="/schedules"
          className={navLinkClass}
        >
          <FiCalendar size={20} />
          Schedules
        </NavLink>

        <NavLink
          to="/doselogs"
          className={navLinkClass}
        >
          <FiFileText size={20} />
          Dose Logs
        </NavLink>

        <NavLink to="/symptoms" className={navLinkClass}><FaNotesMedical size={20} />Symptoms</NavLink>
        <NavLink
          to="/assistant"
          className={navLinkClass}>
          <FiMessageSquare size={20} />
          AI Assistant
        </NavLink>

        <NavLink
          to="/profile"
          className={navLinkClass}>
          <FiUser size={20} />
          Profile
        </NavLink>

      </nav>

      {/* Logout */}

      <div
        className="px-6 py-6 mt-auto">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600 transition">
          <FiLogOut size={20}/>
          Logout
        </button>
      </div>

      <DeleteConfirmModal
        open={showLogoutModal}
        title="Logout"
        message="Are you sure you want to logout from Med-Core?"
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        confirmText="Logout"
        confirmColor="bg-blue-600 hover:bg-blue-700"
        icon={<FiLogOut className="text-blue-600" size={28} />}/>
    </aside>
  );
}

export default Sidebar;