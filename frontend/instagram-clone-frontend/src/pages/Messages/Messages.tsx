import { useState } from "react";
import { useParams } from "react-router-dom";
import { SquarePen } from "lucide-react";

import ConversationList from "../../components/organisms/ConversationList";
import ChatWindow from "../../components/organisms/ChatWindow";
import NewConversationModal from "../../components/organisms/NewConversationModal";

const Messages = () => {
  const { conversationId } = useParams();

  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="h-[calc(100vh-64px)] bg-white rounded-xl shadow overflow-hidden">

        <div className="grid grid-cols-1 md:grid-cols-3 h-full">

          {/* Left Side */}

          <div className="border-r">

            <div className="p-4 border-b flex justify-between items-center">

              <h2 className="text-xl font-semibold">
                Messages
              </h2>

              <button
                onClick={() => setOpenModal(true)}
              >
                <SquarePen size={22} />
              </button>

            </div>

            <ConversationList
              selectedConversationId={conversationId}
            />

          </div>

          {/* Right Side */}

          <div className="md:col-span-2">

            {conversationId ? (
              <ChatWindow
                conversationId={conversationId}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a conversation
              </div>
            )}

          </div>

        </div>

      </div>

      {openModal && (
        <NewConversationModal
          onClose={() => setOpenModal(false)}
        />
      )}
    </>
  );
};

export default Messages;