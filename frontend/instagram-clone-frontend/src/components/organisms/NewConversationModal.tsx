import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateConversation } from "../../hooks/useConversation";
import { useSearchUsers } from "../../hooks/useSearch";

type User = {
  _id: string;
  name: string;
  username: string;
  profilePicture: string;
};

type Props = {
  onClose: () => void;
};

const NewConversationModal = ({ onClose }: Props) => {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");

  const { data, isLoading } = useSearchUsers(keyword);

  const users: User[] = data?.users || [];

  const createConversation = useCreateConversation();

  const handleCreate = (userId: string) => {
    createConversation.mutate(userId, {
      onSuccess: (data) => {
        navigate(`/messages/${data.conversation._id}`);
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5">

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            New Message
          </h2>

          <button
            onClick={onClose}
            className="text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search users..."
          className="mb-4 w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
        />

        <div className="max-h-80 overflow-y-auto">

          {isLoading && (
            <div className="py-6 text-center text-gray-500">
              Searching...
            </div>
          )}

          {!isLoading &&
            keyword &&
            users.length === 0 && (
              <div className="py-6 text-center text-gray-500">
                No users found
              </div>
            )}

          {!isLoading &&
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between border-b py-3"
              >
                <div className="flex items-center gap-3">

                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />

                  <div>

                    <h3 className="font-semibold">
                      {user.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      @{user.username}
                    </p>

                  </div>

                </div>

                <button
                  onClick={() => handleCreate(user._id)}
                  disabled={createConversation.isPending}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createConversation.isPending
                    ? "Creating..."
                    : "Chat"}
                </button>
              </div>
            ))}

        </div>

      </div>
    </div>
  );
};

export default NewConversationModal;