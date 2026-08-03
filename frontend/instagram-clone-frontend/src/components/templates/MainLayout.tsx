import { Outlet } from "react-router-dom";
import Navbar from "../organisms/Navbar";
import Sidebar from "../organisms/Sidebar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar (desktop) + mobile bottom nav both live inside Sidebar component */}
      <Sidebar />

      {/* Page Content — offset by sidebar width on large screens */}
      <main className="lg:ml-64 max-w-7xl mx-auto px-4 py-6 pb-24 lg:pb-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
