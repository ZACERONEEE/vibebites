import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight">
                VibeBites
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
                Filipino meals
              </span>
            </div>

            <div className="text-[11px] text-white/70">
              © {year} VibeBites • All rights reserved
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] font-semibold text-white/75">
            <Link className="hover:text-white transition" to="/">
              Home
            </Link>
            <Link className="hover:text-white transition" to="/about">
              About
            </Link>
            <Link className="hover:text-white transition" to="/saved">
              Saved
            </Link>
            <Link className="hover:text-white transition" to="/feedback">
              Feedback
            </Link>
          </nav>
        </div>

        {/* Bottom mini line */}
        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-4 text-[11px] text-white/60 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/10 px-2 py-1 font-semibold text-white/75">
              Guidance only
            </span>
            <span className="rounded-full bg-white/10 px-2 py-1 font-semibold text-white/75">
              No diagnosis
            </span>
            <span className="rounded-full bg-white/10 px-2 py-1 font-semibold text-white/75">
              Check allergens
            </span>
          </div>

          <div className="text-white/50">
            Capstone Project • BSIT
          </div>
        </div>
      </div>
    </footer>
  );
}
