export default function ChatMessage({ role, content }) {
  const mine = role === "user";
  return (
    <div className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${mine ? "ml-auto bg-indigoGlow" : "bg-white/10"}`}>
      {content}
    </div>
  );
}
