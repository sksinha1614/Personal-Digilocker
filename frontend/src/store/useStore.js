import { create } from "zustand";

const loadAuth = () => {
  try {
    const token = localStorage.getItem("dl_token");
    const user = JSON.parse(localStorage.getItem("dl_user") || "null");
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

const saved = loadAuth();

export const useStore = create((set) => ({
  // Auth
  token: saved.token,
  user: saved.user,
  login: (token, user) => {
    localStorage.setItem("dl_token", token);
    localStorage.setItem("dl_user", JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem("dl_token");
    localStorage.removeItem("dl_user");
    set({ token: null, user: null });
    window.location.href = "/login";
  },

  // Documents
  documents: [],
  selectedDoc: null,
  setDocuments: (documents) => set({ documents }),
  setSelectedDoc: (selectedDoc) => set({ selectedDoc }),

  // Chat
  chatMessages: [
    { role: "assistant", content: "Hi, I am DigiAssist. Ask me about your uploaded documents." },
  ],
  addChatMessage: (message) => set((s) => ({ chatMessages: [...s.chatMessages, message] })),
  clearChat: () =>
    set({
      chatMessages: [
        { role: "assistant", content: "Hi, I am DigiAssist. Ask me about your uploaded documents." },
      ],
    }),
}));
