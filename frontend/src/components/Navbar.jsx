import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../theme";

const LinkItem = ({ to, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block rounded-xl px-4 py-3 text-sm font-semibold transition active:scale-95 ${
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
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-gradient-to-r from-orange-500 to-emerald-500">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Brand */}
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

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <LinkItem to="/" label="Home" />
          <LinkItem to="/moods" label="Moods" />
          <LinkItem to="/saved" label="Saved" />
          <LinkItem to="/feedback" label="Feedback" />
          <LinkItem to="/about" label="About Us" />

          <button
            onClick={toggleTheme}
            className="ml-2 rounded-xl bg-white/15 px-3 py-2 text-sm font-bold text-white transition hover:bg-white/25 active:scale-95"
            title="Toggle dark mode"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="rounded-xl bg-white/15 px-3 py-2 text-sm font-bold text-white transition hover:bg-white/25 active:scale-95"
            title="Toggle dark mode"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-xl bg-white/15 p-2 text-white transition hover:bg-white/25 active:scale-95"
            aria-label="Open menu"
            aria-expanded={open}
          >
            {/* Hamburger icon */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M4 7H20M4 12H20M4 17H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden">
          <div className="mx-auto max-w-5xl px-4 pb-4">
            <div className="rounded-2xl bg-black/20 backdrop-blur-sm">
              <LinkItem to="/" label="Home" onClick={closeMenu} />
              <LinkItem to="/moods" label="Moods" onClick={closeMenu} />
              <LinkItem to="/saved" label="Saved" onClick={closeMenu} />
              <LinkItem to="/feedback" label="Feedback" onClick={closeMenu} />
              <LinkItem to="/about" label="About" onClick={closeMenu} />

              <button
                onClick={() => {
                  closeMenu();
                }}
                className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-white/80 hover:bg-white/15"
              >
                Close menu ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
