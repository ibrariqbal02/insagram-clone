import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Send,
  MoreHorizontal,
} from "lucide-react";

import PostDetailsModal from "./PostDetailsModal";
import { useLikeUnlikePost } from "../../hooks/usePost";
import { useMe } from "../../hooks/useAuth";

type Image = {
  url: string;
  publicId: string;
};

type Owner = {
  _id: string;
  name: string;
  username: string;
  profilePicture: string;
};

type Post = {
  _id: string;
  caption: string;
  images: Image[];
  likes: string[];
  owner: Owner;
  createdAt?: string;
};

type Props = {
  post: Post;
};

const PostCard = ({ post }: Props) => {
  const [showDetails, setShowDetails] = useState(false);

  const { data: me } = useMe();
  const myId = me?.user?._id;

  const likeMutation = useLikeUnlikePost();

  const isLiked = useMemo(() => {
    if (!myId) return false;
    return post.likes.some((id) => id === myId);
  }, [myId, post.likes]);

  const handleLike = () => {
    likeMutation.mutate(post._id);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow border mb-8 overflow-hidden">

        {/* Header */}

        <div className="flex items-center justify-between p-4">

          <Link to={`/profile/${post.owner._id}`} className="flex items-center gap-3">

            <img
              src={post.owner.profilePicture}
              alt={post.owner.name}
              className="w-11 h-11 rounded-full object-cover"
            />

            <div>
              <h2 className="font-semibold hover:underline">
                {post.owner.name}
              </h2>

              <p className="text-sm text-gray-500">
                @{post.owner.username}
              </p>
            </div>

          </Link>

          <button onClick={() => setShowDetails(true)}>
            <MoreHorizontal size={22} />
          </button>

        </div>

        {/* Image */}

        {post.images.length > 0 && (
          <img
            src={post.images[0].url}
            alt="Post"
            onClick={() => setShowDetails(true)}
            className="w-full h-[500px] object-cover cursor-pointer"
          />
        )}

        {/* Footer */}

        <div className="p-4">

          {/* Actions */}

          <div className="flex items-center justify-between mb-4">

            <div className="flex gap-5">

              <button
                onClick={handleLike}
                disabled={likeMutation.isPending}
                className="hover:scale-110 transition"
              >
                <Heart
                  size={24}
                  className={isLiked ? "text-red-500" : ""}
                  fill={isLiked ? "currentColor" : "none"}
                />
              </button>

              <button
                onClick={() => setShowDetails(true)}
                className="hover:scale-110 transition"
              >
                <MessageCircle size={24} />
              </button>

              <button className="hover:scale-110 transition">
                <Send size={22} />
              </button>

            </div>

          </div>

          {/* Likes */}

          <p className="font-semibold">
            {post.likes.length} Likes
          </p>

          {/* Caption */}

          <p className="mt-2">
            <Link to={`/profile/${post.owner._id}`} className="font-semibold mr-2 hover:underline">
              {post.owner.username}
            </Link>

            {post.caption}
          </p>

          {/* Comments */}

          <button
            onClick={() => setShowDetails(true)}
            className="text-gray-500 mt-3 hover:text-black"
          >
            View Comments
          </button>

          {/* Time */}

          <p className="text-xs text-gray-400 mt-3">
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : ""}
          </p>

        </div>

      </div>

      {showDetails && (
        <PostDetailsModal
          postId={post._id}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

export default PostCard;