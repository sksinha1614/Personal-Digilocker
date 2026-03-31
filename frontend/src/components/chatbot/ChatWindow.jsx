import { MessageCircle, X, Bot, User, Sparkles, Zap, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import useChat from "../../hooks/useChat";

const suggestions = [
  { icon: Zap, text: "What is my Aadhaar number?" },
  { icon: Bot, text: "Show my PAN details" },
  { icon: Sparkles, text: "When does my passport expire?" },
];

function ChatBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
          isUser ? "bg-vault-800" : "bg-vault-400"
        }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-white" />
        ) : (
          <Bot className="w-3.5 h-3.5 text-white" />
        )}
      </div>
      <div
        className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-vault-800 text-white rounded-tr-md"
            : "bg-cream-100 text-vault-800 border border-cream-300 rounded-tl-md"
        }`}
      >
        {content}
      </div>
    </motion.div>
  );
}

function ChatInputBar({ onSend, loading }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    onSend(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="vault-input pr-11 text-sm"
      />
      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-vault-800 flex items-center justify-center disabled:opacity-30 hover:bg-vault-700 transition-colors"
      >
        <Send className="w-3.5 h-3.5 text-white" />
      </button>
    </form>
  );
}

/* ─── Desktop right panel ────────────────────────────── */
function DesktopPanel({ messages, send, loading, messagesEndRef }) {
  return (
    <aside className="hidden lg:flex w-[340px] h-screen flex-col bg-white border-l border-cream-300 shadow-chat sticky top-0">
      {/* Header */}
      <div className="p-4 border-b border-cream-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-vault-800 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-vault-800 text-sm">DigiAssist</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
              <span className="text-[10px] text-cream-500 uppercase tracking-wider font-medium">
                Assistant Active
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-cream-500 mt-3 leading-relaxed">
          Ask me to find documents, analyze details, or extract information from
          your uploads.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-2xl bg-cream-200 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-7 h-7 text-vault-400" />
            </div>
            <p className="text-cream-500 text-sm">
              Ask me anything about your documents
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <ChatBubble key={`${m.role}-${i}`} role={m.role} content={m.content} />
        ))}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-1.5 items-center bg-cream-100 border border-cream-300 w-fit px-4 py-2.5 rounded-xl"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-vault-400 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-vault-500 animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-vault-600 animate-bounce [animation-delay:300ms]" />
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s.text}
              onClick={() => send(s.text)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cream-300 text-[11px] text-vault-600 hover:bg-cream-100 transition-colors"
            >
              <s.icon className="w-3 h-3 text-vault-400" />
              {s.text}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-cream-300">
        <ChatInputBar onSend={send} loading={loading} />
      </div>
    </aside>
  );
}

/* ─── Mobile floating chat ───────────────────────────── */
function MobileChat({ open, setOpen, messages, send, loading, messagesEndRef }) {
  return (
    <div className="fixed bottom-20 right-4 z-50 lg:hidden">
      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((s) => !s)}
        className="w-14 h-14 rounded-2xl bg-vault-800 flex items-center justify-center shadow-cardHover"
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
        {!open && messages.length > 1 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
            {messages.length - 1}
          </span>
        )}
      </motion.button>

      {/* Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            className="absolute bottom-18 right-0 w-[min(380px,88vw)] h-[480px] bg-white rounded-2xl border border-cream-300 shadow-cardHover overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-cream-300 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-vault-800 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-vault-800 text-sm">
                  DigiAssist
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
                  <span className="text-[10px] text-cream-500 uppercase tracking-wider">
                    Online
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <ChatBubble
                  key={`${m.role}-${i}`}
                  role={m.role}
                  content={m.content}
                />
              ))}
              {loading && (
                <div className="flex gap-1.5 items-center bg-cream-100 border border-cream-300 w-fit px-4 py-2.5 rounded-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-vault-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-vault-500 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-vault-600 animate-bounce [animation-delay:300ms]" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-cream-300">
              <ChatInputBar onSend={send} loading={loading} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main export ────────────────────────────────────── */
export default function ChatWindow() {
  const [open, setOpen] = useState(false);
  const { messages, send, loading } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <>
      <DesktopPanel
        messages={messages}
        send={send}
        loading={loading}
        messagesEndRef={messagesEndRef}
      />
      <MobileChat
        open={open}
        setOpen={setOpen}
        messages={messages}
        send={send}
        loading={loading}
        messagesEndRef={messagesEndRef}
      />
    </>
  );
}
