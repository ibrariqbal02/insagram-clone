import { useState } from "react";
import { useComments, useCreateComment } from "../../hooks/useComment";


type Props = {
  postId: string;
  onClose: () => void;
};

const CommentModal = ({ postId, onClose }: Props) => {
  const [text, setText] = useState("");

  const { data, isLoading } = useComments(postId);

  const createComment = useCreateComment();

  const handleSubmit = () => {
    if (!text.trim()) return;

    createComment.mutate(
      {
        postId,
        text,
      },
      {
        onSuccess: () => {
          setText("");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col">

        {/* Header */}

        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">
            Comments
          </h2>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ✕
          </button>
        </div>

        {/* Comment List */}

        <div className="flex-1 overflow-y-auto p-4">

          {isLoading && (
            <p>Loading...</p>
          )}

          {!isLoading &&
            data?.comments?.length === 0 && (
              <p className="text-center text-gray-500">
                No comments yet.
              </p>
            )}

          {data?.comments?.map((comment: any) => (
            <div
              key={comment._id}
              className="border-b py-3"
            >
              <div className="flex items-center gap-3">

                <img
                  src={comment.owner.profilePicture}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />

                <div>

                  <p className="font-semibold">
                    {comment.owner.name}
                  </p>

                  <p className="text-sm">
                    {comment.text}
                  </p>

                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Input */}

        <div className="border-t p-4 flex gap-2">

          <input
            type="text"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 outline-none"
          />

          <button
            onClick={handleSubmit}
            disabled={createComment.isPending}
            className="bg-blue-600 text-white px-5 rounded-lg"
          >
            Send
          </button>

        </div>

      </div>
    </div>
  );
};

export default CommentModal;