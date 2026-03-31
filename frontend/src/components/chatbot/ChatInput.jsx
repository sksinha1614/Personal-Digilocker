import { useState } from "react";

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState("");
  const submit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };
  return (
    <div className="mt-2 flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Ask about your documents..."
        className="flex-1 rounded-lg border-white/20 bg-white/10 text-sm"
      />
      <button onClick={submit} disabled={loading} className="rounded-lg bg-cyanGlow px-3 py-2 text-black">
        Send
      </button>
    </div>
  );
}
