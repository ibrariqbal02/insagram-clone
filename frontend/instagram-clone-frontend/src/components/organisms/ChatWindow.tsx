import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

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

  // Derive the other participant's info from the already-cached conversations list
  // so we get name + avatar without an extra request
  const queryClient = useQueryClient();
  const conversationsCache = queryClient.getQueryData<any>(["conversations"]);
  const conversation = conversationsCache?.conversations?.find(
    (c: any) => c._id === conversationId
  );
  const otherUser = conversation?.participants?.find(
    (p: any) => p._id !== currentUserId
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  const handleSend = (text: string) => {
    sendMessage.mutate({ conversationId, content: text });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-gray-50">

      {/* Header */}
      <div className="border-b bg-white px-6 py-3 flex items-center gap-3">
        {otherUser?.profilePicture ? (
          <img
            src={otherUser.profilePicture}
            alt={otherUser.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-semibold">
            {otherUser?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <div>
          <p className="font-semibold leading-tight">
            {otherUser?.name ?? "Chat"}
          </p>
          {otherUser?.username && (
            <p className="text-xs text-gray-500">@{otherUser.username}</p>
          )}
        </div>
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
      <MessageInput onSend={handleSend} loading={sendMessage.isPending} />
    </div>
  );
};

export default ChatWindow;
