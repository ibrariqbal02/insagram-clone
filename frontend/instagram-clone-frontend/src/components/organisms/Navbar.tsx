import { Search, Heart, MessageCircle, PlusSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotification";
import { useMyProfile } from "../../hooks/useProfile";

const Navbar = () => {
  const { data: notifData } = useNotifications();
  const { data: profileData } = useMyProfile();

  const unreadCount =
    notifData?.notifications?.filter((n: any) => !n.isRead).length ?? 0;

  const profilePicture = profileData?.user?.profilePicture;

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          Instagram
        </Link>

        {/* Search */}
        <div className="hidden md:flex w-80">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-3 outline-none"
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-5">
          <Link to="/create-post">
            <PlusSquare size={24} />
          </Link>

          <Link to="/messages">
            <MessageCircle size={24} />
          </Link>

          {/* Notification icon with unread badge */}
          <Link to="/notification" className="relative">
            <Heart size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-0.5">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>

          <Link to="/profile">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="profile"
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-semibold">
                {profileData?.user?.username?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
