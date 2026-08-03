import { Search, Heart, MessageCircle, PlusSquare } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
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

          <Link to="/notification">
            <Heart size={24} />
          </Link>

          <Link to="/profile">
            <img
              src="https://i.pravatar.cc/150?img=10"
              alt="profile"
              className="w-9 h-9 rounded-full"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
