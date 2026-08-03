import { useEffect, useRef } from "react";

import { useMessages, useSendMessage } from "../../hooks/useMessage";
import { useMyProfile } from "../../hooks/useProfile";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";



type Props = {
  conversationId: string;
};

const ChatWindow = ({ conversationId }: Props) => {
  const { data: profile } = useMyProfile();

  const currentUserId = profile?.user?._id;

  const { data, isLoading } = useMessages(conversationId);

  const sendMessage = useSendMessage();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [data]);

  const handleSend = (text: string) => {
    sendMessage.mutate({
      conversationId,
      content: text,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-gray-50">

      {/* Header */}

      <div className="border-b bg-white px-6 py-4">
        <h2 className="text-lg font-semibold">
          Chat
        </h2>
      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {data?.messages?.length === 0 && (
          <div className="flex h-full items-center justify-center text-gray-500">
            Start your conversation 👋
          </div>
        )}

        {data?.messages?.map((message: any) => (
          <MessageBubble
            key={message._id}
            message={message}
            isMine={
              message.sender?._id === currentUserId ||
              message.sender === currentUserId
            }
          />
        ))}

        <div ref={bottomRef} />

      </div>

      {/* Input */}

      <MessageInput
        onSend={handleSend}
        loading={sendMessage.isPending}
      />

    </div>
  );
};

export default ChatWindow;