import { create } from "zustand";

export const useStore = create((set) => ({
  documents: [],
  selectedDoc: null,
  chatMessages: [
    { role: "assistant", content: "Hi, I am DigiAssist. Ask me about your uploaded documents." },
  ],
  setDocuments: (documents) => set({ documents }),
  setSelectedDoc: (selectedDoc) => set({ selectedDoc }),
  addChatMessage: (message) => set((s) => ({ chatMessages: [...s.chatMessages, message] })),
  clearChat: () => set({ chatMessages: [] }),
}));
