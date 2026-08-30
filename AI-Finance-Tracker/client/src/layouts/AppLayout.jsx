import {
  BarChart3,
  Bell,
  ChartNoAxesCombined,
  ChevronLeft,
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  PiggyBank,
  ReceiptText,
  Settings,
  SunMoon,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import Brand from "../components/Brand";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import FinanceChatbot from "../components/FinanceChatbot";
const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ReceiptText },
  { to: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
  { to: "/budgets", label: "Budgets", icon: CircleDollarSign },
  { to: "/goals", label: "Savings Goals", icon: PiggyBank },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];
export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="side-head">
          <Brand />
          <button
            className="icon-button mobile-only"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <ChevronLeft />
          </button>
        </div>
        <nav>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}>
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <p>{user?.name}</p>
          <small>{user?.email}</small>
          <button className="logout" onClick={logout}>
            <LogOut size={15} /> Log out
          </button>
        </div>
      </aside>
      {open && (
        <button
          className="backdrop"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <main>
        <header className="topbar">
          <button
            className="icon-button mobile-only"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
          <div className="topbar-copy">
            <span>AI Finance Tracker</span>
            <small>Your private money workspace</small>
          </div>
          <button
            className="icon-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            <SunMoon size={19} />
          </button>
        </header>
        <div className="content">
          <Outlet />
        </div>
        <FinanceChatbot />
      </main>
    </div>
  );
}
