// app/components/chat/ChatInput.tsx

"use client";

import { useState } from "react";

export default function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
  const [value, setValue] = useState("");

  function submit() {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  }

  return (
    <div className="flex items-center gap-2 p-3 border-t bg-white">
      <input
        className="flex-1 border rounded-lg px-3 py-2 text-sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Écrire un message…"
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />

      <button
        onClick={submit}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
      >
        Envoyer
      </button>
    </div>
  );
}
