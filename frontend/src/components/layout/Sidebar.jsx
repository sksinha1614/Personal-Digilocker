import { FileUp, Files, LayoutDashboard, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/documents", label: "Documents", icon: Files },
  { to: "/upload", label: "Upload", icon: FileUp },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  return (
    <>
      <aside className="glass hidden h-screen w-64 flex-col p-4 md:flex">
        <h1 className="mb-6 font-syne text-2xl">DigiLocker</h1>
        <nav className="space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 ${isActive ? "border-l-2 border-indigoGlow bg-indigoGlow/10" : "hover:bg-white/5"}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto">
          <p className="mb-2 text-xs text-white/70">Storage usage</p>
          <div className="h-2 rounded-full bg-white/10">
            <div className="h-2 w-2/5 rounded-full bg-cyanGlow" />
          </div>
        </div>
      </aside>
      <div className="glass fixed bottom-2 left-2 right-2 z-40 flex justify-around rounded-xl p-2 md:hidden">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="flex flex-col items-center text-xs">
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </div>
    </>
  );
}
