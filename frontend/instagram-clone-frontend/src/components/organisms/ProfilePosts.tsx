import { useState } from "react";

import { useUserPosts } from "../../hooks/useProfile";
import PostDetailsModal from "./PostDetailsModal";


type Props = {
  userId: string;
};

const ProfilePosts = ({ userId }: Props) => {
  const { data, isLoading } = useUserPosts(userId);
  const [openPostId, setOpenPostId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        Loading posts...
      </div>
    );
  }

  const posts = data?.posts || [];

  if (posts.length === 0) {
    return (
      <div className="rounded-xl bg-white py-16 text-center shadow">
        <h2 className="text-2xl font-semibold">
          No Posts Yet
        </h2>

        <p className="mt-2 text-gray-500">
          This user hasn't shared any posts.
        </p>
      </div>
    );
  }

  return (
    <>
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-6
      "
    >
      {posts.map((post: any) => (
        <div
          key={post._id}
          onClick={() => setOpenPostId(post._id)}
          className="
            group
            relative
            cursor-pointer
            overflow-hidden
            rounded-xl
            bg-gray-100
            shadow
          "
        >
          <img
            src={post.images[0]?.url}
            alt={post.caption}
            className="
              h-80
              w-full
              object-cover
              transition
              duration-300
              group-hover:scale-110
            "
          />

          {/* Overlay */}

          <div
            className="
              absolute
              inset-0
              flex
              flex-col
              items-center
              justify-center
              bg-black/50
              opacity-0
              transition
              group-hover:opacity-100
            "
          >
            <div className="flex gap-8 text-white">

              <div className="text-center">
                <h3 className="text-xl font-bold">
                  {post.likes.length}
                </h3>

                <p>Likes</p>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold">
                  {post.comments?.length || 0}
                </h3>

                <p>Comments</p>
              </div>

            </div>

          </div>

        </div>
      ))}
    </div>

    {openPostId && (
      <PostDetailsModal
        postId={openPostId}
        onClose={() => setOpenPostId(null)}
      />
    )}
    </>
  );
};

export default ProfilePosts;