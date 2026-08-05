type Props = {
  message: any;
  isMine: boolean;
};

const MessageBubble = ({ message, isMine }: Props) => {
  const sentAt = new Date(message.createdAt);

  const timestamp = sentAt.toLocaleString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 shadow ${
          isMine
            ? "bg-blue-600 text-white"
            : "bg-white border"
        }`}
      >
        <p className="break-words">
          {message.content}
        </p>

        <p
          className={`mt-1 text-xs ${
            isMine
              ? "text-blue-100"
              : "text-gray-500"
          }`}
        >
          {timestamp}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;