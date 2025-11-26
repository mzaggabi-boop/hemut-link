"use client";

import { useEffect, useState, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatBox({ orderId, currentUserId }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  async function load() {
    const res = await fetch(`/api/marketplace/order-chat/${orderId}`);
    const json = await res.json();
    setMessages(json.messages || []);
    scrollBottom();
  }

  useEffect(() => {
    load();
  }, []);

  function scrollBottom() {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  async function send() {
    if (!text.trim()) return;

    await fetch(`/api/marketplace/order-chat/${orderId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    });

    setText("");
    load();
  }

  return (
    <div className="h-[400px] flex flex-col border rounded-xl bg-white shadow-sm">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isMine={msg.senderId === currentUserId}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          className="border rounded-lg px-3 py-2 flex-1 text-sm"
          placeholder="Votre message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={send}
          className="bg-black text-white rounded-lg px-4 py-2 text-sm font-semibold"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
