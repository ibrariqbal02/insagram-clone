import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, Pencil, X } from "lucide-react";

import { useMe } from "../../hooks/useAuth";
import {
  useDeletePost,
  useLikeUnlikePost,
  usePostById,
} from "../../hooks/usePost";
import CommentList from "./CommentList";
import EditPostModal from "./EditPostModal";

type Props = {
  postId: string;
  onClose: () => void;
};

const PostDetailsModal = ({ postId, onClose }: Props) => {
  const { data: me } = useMe();
  const myId = me?.user?._id;

  const [openEditPost, setOpenEditPost] = useState(false);

  const { data: postData, isLoading } = usePostById(postId);
  const post = postData?.post;

  const likePost = useLikeUnlikePost();
  const deletePost = useDeletePost();

  const isOwner = post?.owner?._id === myId;

  const isPostLiked = useMemo(() => {
    if (!myId) return false;
    return (post?.likes || []).some((id: string) => id === myId);
  }, [myId, post?.likes]);

  const handleDeletePost = () => {
    const ok = window.confirm("Delete this post?");
    if (!ok) return;

    deletePost.mutate(postId, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[85vh] overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <Link
              to={post?.owner?._id ? `/profile/${post.owner._id}` : "#"}
              onClick={onClose}
              className="flex items-center gap-3"
            >
              {post?.owner?.profilePicture && (
                <img
                  src={post.owner.profilePicture}
                  alt={post.owner.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
              )}
              <div className="leading-tight">
                <div className="font-semibold hover:underline">{post?.owner?.name}</div>
                <div className="text-xs text-gray-500">
                  @{post?.owner?.username}
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {isOwner && (
                <>
                  <button
                    onClick={() => setOpenEditPost(true)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={handleDeletePost}
                    disabled={deletePost.isPending}
                    className="p-2 rounded-lg hover:bg-gray-100 text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="p-10 text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-black flex items-center justify-center">
                {post?.images?.length ? (
                  <img
                    src={post.images[0].url}
                    alt={post.caption}
                    className="w-full h-[420px] md:h-[520px] object-contain"
                  />
                ) : (
                  <div className="text-white py-20">No image</div>
                )}
              </div>

              <div className="flex flex-col h-[420px] md:h-[520px]">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => likePost.mutate(postId)}
                      disabled={likePost.isPending}
                      className="flex items-center gap-2"
                    >
                      <Heart
                        size={22}
                        className={isPostLiked ? "text-red-500" : ""}
                        fill={isPostLiked ? "currentColor" : "none"}
                      />
                      <span className="text-sm font-semibold">
                        {post?.likes?.length || 0}
                      </span>
                    </button>
                  </div>

                  {post?.caption && (
                    <div className="mt-3 text-sm">
                      <Link
                        to={`/profile/${post.owner._id}`}
                        onClick={onClose}
                        className="font-semibold mr-2 hover:underline"
                      >
                        {post.owner.username}
                      </Link>
                      {post.caption}
                    </div>
                  )}
                </div>

                <CommentList postId={postId} currentUserId={myId} />
              </div>
            </div>
          )}
        </div>
      </div>

      {openEditPost && post && (
        <EditPostModal
          post={post}
          onClose={() => setOpenEditPost(false)}
        />
      )}
    </>
  );
};

export default PostDetailsModal;
