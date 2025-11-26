export default function MessageBubble({ msg, isMine }: any) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-xl px-3 py-2 text-sm shadow-sm 
        ${isMine ? "bg-black text-white" : "bg-gray-100 text-gray-800"}`}
      >
        {msg.content && <p className="whitespace-pre-line">{msg.content}</p>}

        {msg.imageUrl && (
          <img
            src={msg.imageUrl}
            alt="image"
            className="rounded-md mt-2 max-h-40 border"
          />
        )}

        <p className="text-[10px] opacity-60 mt-1">
          {new Date(msg.createdAt).toLocaleString("fr-FR")}
        </p>
      </div>
    </div>
  );
}
