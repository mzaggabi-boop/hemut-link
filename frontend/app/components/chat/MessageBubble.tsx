// app/components/chat/MessageBubble.tsx

"use client";

export default function MessageBubble({ message, userId }: any) {
  const isMine = message.senderId === userId;

  return (
    <div
      className={`flex mb-2 ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs px-3 py-2 text-sm rounded-lg shadow ${
          isMine
            ? "bg-indigo-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
      >
        <p>{message.content}</p>
        <p className="text-[10px] opacity-70 mt-1">
          {new Date(message.createdAt).toLocaleString("fr-FR")}
        </p>
      </div>
    </div>
  );
}
