import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import ChatWindow from "../chatbot/ChatWindow";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-cream-200 md:flex">
      <Sidebar />
      <main className="flex-1 p-5 pb-24 md:p-8 md:pb-8 overflow-y-auto md:max-h-screen">
        <Outlet />
      </main>
      <ChatWindow />
    </div>
  );
}
