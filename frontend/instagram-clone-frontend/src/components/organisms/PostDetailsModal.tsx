import { useMemo, useState } from "react";
import { Heart, Trash2, Pencil, X } from "lucide-react";

import { useMe } from "../../hooks/useAuth";
import {
  useDeletePost,
  useLikeUnlikePost,
  usePostById,
} from "../../hooks/usePost";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useLikeUnlikeComment,
  useUpdateComment,
} from "../../hooks/useComment";
import EditPostModal from "./EditPostModal";

type Props = {
  postId: string;
  onClose: () => void;
};

const PostDetailsModal = ({ postId, onClose }: Props) => {
  const { data: me } = useMe();
  const myId = me?.user?._id;

  const [text, setText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [openEditPost, setOpenEditPost] = useState(false);

  const { data: postData, isLoading } = usePostById(postId);
  const post = postData?.post;

  const { data: commentsData, isLoading: commentsLoading } = useComments(postId);
  const comments = commentsData?.comments || [];

  const likePost = useLikeUnlikePost();
  const createComment = useCreateComment();
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();
  const likeUnlikeComment = useLikeUnlikeComment();
  const deletePost = useDeletePost();

  const isOwner = post?.owner?._id === myId;

  const isPostLiked = useMemo(() => {
    if (!myId) return false;
    return (post?.likes || []).some((id: string) => id === myId);
  }, [myId, post?.likes]);

  const handleCreateComment = () => {
    if (!text.trim()) return;

    createComment.mutate(
      { postId, text },
      {
        onSuccess: () => {
          setText("");
        },
      }
    );
  };

  const handleStartEditComment = (comment: any) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.text || "");
  };

  const handleSaveEditComment = () => {
    if (!editingCommentId) return;
    if (!editingText.trim()) return;

    updateComment.mutate(
      {
        commentId: editingCommentId,
        text: editingText,
      },
      {
        onSuccess: () => {
          setEditingCommentId(null);
          setEditingText("");
        },
      }
    );
  };

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
            <div className="flex items-center gap-3">
              {post?.owner?.profilePicture && (
                <img
                  src={post.owner.profilePicture}
                  alt={post.owner.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
              )}
              <div className="leading-tight">
                <div className="font-semibold">{post?.owner?.name}</div>
                <div className="text-xs text-gray-500">
                  @{post?.owner?.username}
                </div>
              </div>
            </div>

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
                      <span className="font-semibold mr-2">
                        {post.owner.username}
                      </span>
                      {post.caption}
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {commentsLoading && <div>Loading comments...</div>}

                  {!commentsLoading && comments.length === 0 && (
                    <div className="text-center text-gray-500">
                      No comments yet.
                    </div>
                  )}

                  {comments.map((comment: any) => {
                    const isMyComment = comment.owner?._id === myId;
                    const isEditing = editingCommentId === comment._id;

                    return (
                      <div key={comment._id} className="flex items-start gap-3">
                        <img
                          src={comment.owner?.profilePicture}
                          alt={comment.owner?.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />

                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-sm font-semibold">
                              {comment.owner?.username}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => likeUnlikeComment.mutate(comment._id)}
                                className="text-gray-500 hover:text-black"
                              >
                                <Heart size={16} />
                              </button>
                              {isMyComment && (
                                <>
                                  <button
                                    onClick={() => handleStartEditComment(comment)}
                                    className="text-xs text-gray-500 hover:text-black"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteComment.mutate(comment._id)}
                                    className="text-xs text-red-600"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {isEditing ? (
                            <div className="mt-2 flex gap-2">
                              <input
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
                              />
                              <button
                                onClick={handleSaveEditComment}
                                className="px-4 rounded-lg bg-blue-600 text-white text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditingText("");
                                }}
                                className="px-4 rounded-lg border text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="text-sm mt-1">{comment.text}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t p-4 flex gap-2">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 border rounded-lg px-3 py-2 outline-none"
                  />
                  <button
                    onClick={handleCreateComment}
                    disabled={createComment.isPending}
                    className="bg-blue-600 text-white px-5 rounded-lg"
                  >
                    Send
                  </button>
                </div>
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
