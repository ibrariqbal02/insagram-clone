import { Link, useNavigate } from "react-router-dom";

import {
  useMyProfile,
  useUserPosts,
  useUserProfile,
} from "../../hooks/useProfile";

import { useFollowUser } from "../../hooks/useFollow";
import { useCreateConversation } from "../../hooks/useConversation";

type Props = {
  userId: string;
};

const ProfileHeader = ({ userId }: Props) => {
  const navigate = useNavigate();

  const { data: profile, isLoading } = useUserProfile(userId);
  const { data: myProfile } = useMyProfile();
  const { data: posts } = useUserPosts(userId);

  const followUser = useFollowUser();
  const createConversation = useCreateConversation();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        Loading profile...
      </div>
    );
  }

  const user = profile.user;

  const isMe = myProfile?.user?._id === user._id;

  const isFollowing =
    user.followers?.some(
      (id: string) => id === myProfile?.user?._id
    ) || false;

  const handleFollow = () => {
    followUser.mutate(user._id);
  };

  const handleMessage = () => {
    createConversation.mutate(user._id, {
      onSuccess: (data) => {
        navigate(`/messages/${data.conversation._id}`);
      },
    });
  };

  return (
    <div className="rounded-xl bg-white p-8 shadow">

      <div className="flex flex-col gap-8 md:flex-row">

        {/* Avatar */}

        <div className="flex justify-center">

          <img
            src={user.profilePicture}
            alt={user.name}
            className="h-40 w-40 rounded-full border object-cover"
          />

        </div>

        {/* User Info */}

        <div className="flex-1">

          <div className="flex flex-wrap items-center gap-4">

            <h1 className="text-3xl font-bold">
              {user.name}
            </h1>

            {isMe ? (
              <Link
                to="/edit-profile"
                className="rounded-lg border px-5 py-2 hover:bg-gray-100"
              >
                Edit Profile
              </Link>
            ) : (
              <>
                <button
                  onClick={handleFollow}
                  disabled={followUser.isPending}
                  className={`rounded-lg px-5 py-2 text-white transition ${
                    isFollowing
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {followUser.isPending
                    ? "Loading..."
                    : isFollowing
                    ? "Following"
                    : "Follow"}
                </button>

                <button
                  onClick={handleMessage}
                  disabled={createConversation.isPending}
                  className="rounded-lg border px-5 py-2 hover:bg-gray-100"
                >
                  {createConversation.isPending
                    ? "Opening..."
                    : "Message"}
                </button>
              </>
            )}

          </div>

          <p className="mt-2 text-gray-500">
            @{user.username}
          </p>

          <p className="mt-4">
            {user.bio || "No bio yet."}
          </p>

          {/* Stats */}

          <div className="mt-8 flex gap-10">

            <div>
              <h2 className="text-xl font-bold">
                {posts?.posts?.length || 0}
              </h2>

              <p className="text-gray-500">
                Posts
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {user.followers?.length || 0}
              </h2>

              <p className="text-gray-500">
                Followers
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {user.following?.length || 0}
              </h2>

              <p className="text-gray-500">
                Following
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfileHeader;