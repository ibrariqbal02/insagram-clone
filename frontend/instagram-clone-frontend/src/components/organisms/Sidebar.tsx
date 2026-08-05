import {
  House,
  Search,
  SquarePlus,
  Heart,
  MessageCircle,
  User,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotification";
import api from "../../api/axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const { data: notifData } = useNotifications();
  const unreadCount =
    notifData?.notifications?.filter((n: any) => !n.isRead).length ?? 0;

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore error, redirect regardless
    }
    navigate("/login");
  };

  const menus = [
    {
      name: "Home",
      icon: <House size={24} />,
      path: "/",
    },
    {
      name: "Search",
      icon: <Search size={24} />,
      path: "/search",
    },
    {
      name: "Create",
      icon: <SquarePlus size={24} />,
      path: "/create-post",
    },
    {
      name: "Notifications",
      icon: (
        <span className="relative inline-flex">
          <Heart size={24} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-0.5">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </span>
      ),
      path: "/notification",
    },
    {
      name: "Messages",
      icon: <MessageCircle size={24} />,
      path: "/messages",
    },
    {
      name: "Profile",
      icon: <User size={24} />,
      path: "/profile",
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-64 border-r bg-white flex-col justify-between p-5">
        <div className="space-y-2">
          {menus.map((menu) => (
            <NavLink
              key={menu.name}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-gray-100 font-semibold"
                    : "hover:bg-gray-100"
                }`
              }
            >
              {menu.icon}
              <span>{menu.name}</span>
            </NavLink>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 w-full text-left"
        >
          <LogOut size={24} />
          Logout
        </button>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t flex justify-around py-3 z-50">
        {menus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "text-gray-700"
            }
          >
            {menu.icon}
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
