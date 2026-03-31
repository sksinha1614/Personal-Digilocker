import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ChatWindow from "../chatbot/ChatWindow";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-night md:flex">
      <Sidebar />
      <main className="flex-1 p-4 pb-24 md:pb-4">
        <Navbar />
        <Outlet />
      </main>
      <ChatWindow />
    </div>
  );
}
