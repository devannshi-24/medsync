import { NavLink } from "react-router-dom";

import {
  FiGrid,
  FiUser,
  FiCalendar,
  FiFileText,
  FiLogOut
} from "react-icons/fi";
import { FiMessageSquare } from "react-icons/fi";
import { FaHeartbeat } from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";
import { FaNotesMedical } from "react-icons/fa";

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
              Med-Core
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
          className="flex items-center gap-3 text-red-500 hover:text-red-600 transition text-lg">
          <FiLogOut />
          Logout
        </button>
      </div>
      
    </aside>
  );
}

export default Sidebar;