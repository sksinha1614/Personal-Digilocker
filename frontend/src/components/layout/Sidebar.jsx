import {
  FileUp,
  Files,
  LayoutDashboard,
  Shield,
  Upload,
  HelpCircle,
  LogOut,
  Lock,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../../store/useStore";

const links = [
  { to: "/dashboard", label: "Vault", icon: LayoutDashboard },
  { to: "/documents", label: "Documents", icon: Files },
  { to: "/upload", label: "Upload", icon: FileUp },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const logout = useStore((s) => s.logout);
  const user = useStore((s) => s.user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="vault-sidebar hidden h-screen w-64 flex-col justify-between p-5 md:flex shadow-sidebar sticky top-0">
        {/* Top */}
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-display text-xl text-white">DigiLocker</h1>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 mb-8 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-white/70 font-medium">
              Secure Mode
            </span>
            <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-white/15 text-white font-medium"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div>
          <NavLink
            to="/upload"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-cream-200 text-vault-800 px-4 py-3 font-semibold text-sm hover:bg-cream-100 transition-colors mb-4"
          >
            <Upload size={16} />
            New Upload
          </NavLink>

          {/* User info */}
          {user && (
            <div className="px-3 py-2 mb-2">
              <p className="text-xs text-white/50 truncate">
                {user.name || user.phone}
              </p>
            </div>
          )}

          <div className="space-y-0.5 border-t border-white/10 pt-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full rounded-xl px-3 py-2 text-sm text-white/40 hover:text-red-300 hover:bg-white/5 transition-all"
            >
              <LogOut size={16} />
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-around bg-white border-t border-cream-300 py-2 px-3 md:hidden shadow-soft">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                isActive
                  ? "text-vault-800 font-semibold"
                  : "text-cream-500"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-cream-500"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );
}
