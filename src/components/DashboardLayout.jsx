import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="flex">

      <Sidebar />
      <div className="flex-1 min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
          {children}
      </div>

    </div>
  );
}

export default DashboardLayout;