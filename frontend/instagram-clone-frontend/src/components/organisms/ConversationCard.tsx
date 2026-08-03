import { Link } from "react-router-dom";

type User = {
  _id: string;
  name: string;
  username: string;
  profilePicture: string;
};

type LastMessage = {
  _id: string;
  content: string;
  createdAt: string;
};

type Conversation = {
  _id: string;
  participants: User[];
  lastMessage?: LastMessage;
};

type Props = {
  conversation: Conversation;
  currentUserId: string;
  selectedConversationId?: string;
};

const ConversationCard = ({
  conversation,
  currentUserId,
  selectedConversationId,
}: Props) => {
  const otherUser = conversation.participants.find(
    (user) => user._id !== currentUserId
  );

  if (!otherUser) return null;

  return (
    <Link
      to={`/messages/${conversation._id}`}
      className={`flex items-center gap-3 p-4 transition border-b hover:bg-gray-100 ${
        selectedConversationId === conversation._id
          ? "bg-blue-50"
          : ""
      }`}
    >
      <img
        src={otherUser.profilePicture}
        alt={otherUser.name}
        className="w-12 h-12 rounded-full object-cover"
      />

      <div className="flex-1 overflow-hidden">
        <h3 className="font-semibold truncate">
          {otherUser.name}
        </h3>

        <p className="text-sm text-gray-500 truncate">
          {conversation.lastMessage?.content ||
            "No messages yet"}
        </p>
      </div>

      {conversation.lastMessage && (
        <span className="text-xs text-gray-400">
          {new Date(
            conversation.lastMessage.createdAt
          ).toLocaleDateString()}
        </span>
      )}
    </Link>
  );
};

export default ConversationCard;