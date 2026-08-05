import { useEffect, useRef, useState } from "react";
import { Search, Heart, MessageCircle, PlusSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotification";
import { useMyProfile } from "../../hooks/useProfile";
import { useSearchPosts, useSearchUsers } from "../../hooks/useSearch";
import PostDetailsModal from "./PostDetailsModal";

const Navbar = () => {
  const navigate = useNavigate();

  const { data: notifData } = useNotifications();
  const { data: profileData } = useMyProfile();

  const unreadCount =
    notifData?.notifications?.filter((n: any) => !n.isRead).length ?? 0;

  const profilePicture = profileData?.user?.profilePicture;

  // Search
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [openPostId, setOpenPostId] = useState<string | null>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: usersData } = useSearchUsers(debouncedQuery);
  const { data: postsData } = useSearchPosts(debouncedQuery);

  const users = (usersData?.users || []).slice(0, 5);
  const posts = (postsData?.posts || []).slice(0, 4);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowDropdown(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const goToFullResults = () => {
    if (!query.trim()) return;
    navigate(`/search?keyword=${encodeURIComponent(query.trim())}`);
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToFullResults();
  };

  const goToProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
    setShowDropdown(false);
    setQuery("");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="font-logo text-3xl leading-none pt-1">
          Instagram
        </Link>

        {/* Search */}
        <div ref={searchBoxRef} className="hidden md:flex w-80 relative">
          <form onSubmit={handleSubmit} className="relative w-full">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search"
              className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-3 outline-none"
            />
          </form>

          {showDropdown && debouncedQuery.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
              {users.length === 0 && posts.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No results for "{debouncedQuery}"
                </div>
              ) : (
                <>
                  {users.length > 0 && (
                    <div className="py-2">
                      {users.map((u: any) => (
                        <button
                          key={u._id}
                          onClick={() => goToProfile(u._id)}
                          className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 text-left"
                        >
                          <img
                            src={u.profilePicture}
                            alt={u.name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <div className="leading-tight min-w-0">
                            <div className="font-semibold text-sm truncate">{u.name}</div>
                            <div className="text-xs text-gray-500 truncate">@{u.username}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {posts.length > 0 && (
                    <div className="grid grid-cols-4 gap-1 px-2 pb-2">
                      {posts.map((p: any) => (
                        <button
                          key={p._id}
                          onClick={() => {
                            setOpenPostId(p._id);
                            setShowDropdown(false);
                          }}
                          className="aspect-square overflow-hidden rounded"
                        >
                          {p.images?.[0]?.url && (
                            <img
                              src={p.images[0].url}
                              alt={p.caption}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={goToFullResults}
                    className="w-full border-t px-4 py-3 text-sm text-blue-600 font-semibold hover:bg-gray-50"
                  >
                    See all results for "{debouncedQuery}"
                  </button>
                </>
              )}
            </div>
          )}
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

      {openPostId && (
        <PostDetailsModal postId={openPostId} onClose={() => setOpenPostId(null)} />
      )}
    </header>
  );
};

export default Navbar;
