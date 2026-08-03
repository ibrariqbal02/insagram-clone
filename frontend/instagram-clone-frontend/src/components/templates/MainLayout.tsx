import { Outlet } from "react-router-dom";
import Navbar from "../organisms/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <Navbar />
      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation (Temporary) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="flex justify-around items-center py-3">
          <button>🏠</button>
          <button>🔍</button>
          <button>➕</button>
          <button>❤️</button>
          <button>👤</button>
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;
