import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  MoreHorizontal,
} from "lucide-react";

import CommentModal from "./CommentModal";
import { useLikeUnlikePost } from "../../hooks/usePost";

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
  const [showComments, setShowComments] = useState(false);

  const likeMutation = useLikeUnlikePost();

  const handleLike = () => {
    likeMutation.mutate(post._id);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow border mb-8 overflow-hidden">

        {/* Header */}

        <div className="flex items-center justify-between p-4">

          <div className="flex items-center gap-3">

            <img
              src={post.owner.profilePicture}
              alt={post.owner.name}
              className="w-11 h-11 rounded-full object-cover"
            />

            <div>
              <h2 className="font-semibold">
                {post.owner.name}
              </h2>

              <p className="text-sm text-gray-500">
                @{post.owner.username}
              </p>
            </div>

          </div>

          <button>
            <MoreHorizontal size={22} />
          </button>

        </div>

        {/* Image */}

        {post.images.length > 0 && (
          <img
            src={post.images[0].url}
            alt="Post"
            className="w-full h-[500px] object-cover"
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
                <Heart size={24} />
              </button>

              <button
                onClick={() => setShowComments(true)}
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
            <span className="font-semibold mr-2">
              {post.owner.username}
            </span>

            {post.caption}
          </p>

          {/* Comments */}

          <button
            onClick={() => setShowComments(true)}
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

      {showComments && (
        <CommentModal
          postId={post._id}
          onClose={() => setShowComments(false)}
        />
      )}
    </>
  );
};

export default PostCard;