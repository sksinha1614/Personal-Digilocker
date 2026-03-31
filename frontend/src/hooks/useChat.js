import { useState } from "react";
import axios from "axios";
import { sendChatMessage } from "../services/chatService";
import { useStore } from "../store/useStore";

export default function useChat() {
  const { chatMessages, addChatMessage } = useStore();
  const [loading, setLoading] = useState(false);

  const send = async (message) => {
    if (!message.trim()) return;
    addChatMessage({ role: "user", content: message });
    setLoading(true);
    try {
      const data = await sendChatMessage(message);
      addChatMessage({ role: "assistant", content: data.response });
    } catch (e) {
      const fallbackMessage = axios.isAxiosError(e)
        ? e.response?.data?.detail || "Unable to answer right now. Please try again."
        : "Unable to answer right now. Please try again.";
      addChatMessage({ role: "assistant", content: fallbackMessage });
    } finally {
      setLoading(false);
    }
  };

  return { messages: chatMessages, send, loading };
}
