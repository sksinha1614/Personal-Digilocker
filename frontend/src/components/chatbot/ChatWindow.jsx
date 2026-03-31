import { MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import useChat from "../../hooks/useChat";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

const suggestions = ["What is my Aadhaar number?", "Show my PAN details", "When does my passport expire?"];

export default function ChatWindow() {
  const [open, setOpen] = useState(false);
  const { messages, send, loading } = useChat();
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setOpen((s) => !s)}
        className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-indigoGlow to-cyanGlow text-white shadow-glow"
      >
        <MessageCircle />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass absolute bottom-16 right-0 h-[500px] w-[min(400px,90vw)] rounded-2xl p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">DigiAssist 🤖</h3>
              <span className="h-2 w-2 rounded-full bg-green-400" />
            </div>
            <div className="mb-2 flex flex-wrap gap-1">
              {suggestions.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full bg-white/10 px-2 py-1 text-xs">
                  {s}
                </button>
              ))}
            </div>
            <div className="flex h-[380px] flex-col gap-2 overflow-y-auto pr-1">
              {messages.map((m, i) => (
                <ChatMessage key={`${m.role}-${i}`} role={m.role} content={m.content} />
              ))}
              {loading && (
                <div className="flex gap-1 rounded-xl bg-white/10 px-3 py-2 w-fit">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/70" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/70 [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/70 [animation-delay:240ms]" />
                </div>
              )}
            </div>
            <ChatInput onSend={send} loading={loading} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
