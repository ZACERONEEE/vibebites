import { NavLink } from "react-router-dom";
import { useTheme } from "../theme";

const LinkItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `rounded-xl px-3 py-2 text-sm font-semibold transition active:scale-95 ${
        isActive
          ? "bg-white/90 text-orange-600 shadow"
          : "text-white/90 hover:bg-white/15 hover:text-white"
      }`
    }
  >
    {label}
  </NavLink>
);

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-gradient-to-r from-orange-500 to-emerald-500">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="VibeBites Logo"
            className="h-16 w-16"
          />
          <div className="leading-tight">
            <div className="text-base font-extrabold text-white">VibeBites</div>
            <div className="text-xs text-white/80">Eat what you feel</div>
          </div>
        </div>

        <nav className="flex items-center gap-1">
          <LinkItem to="/" label="Home" />
          <LinkItem to="/moods" label="Moods" />
          <LinkItem to="/feedback" label="Feedback" />
          <LinkItem to="/about" label="About" />

          <button
            onClick={toggleTheme}
            className="ml-2 rounded-xl bg-white/15 px-3 py-2 text-sm font-bold text-white transition hover:bg-white/25 active:scale-95"
            title="Toggle dark mode"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </nav>
      </div>
    </header>
  );
}
