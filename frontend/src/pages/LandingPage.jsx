import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="fade-in mx-auto max-w-6xl px-4 py-10 md:py-16">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        {/* LEFT */}
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm dark:bg-orange-500/15 dark:text-orange-200">
            ✨ Mood-based meal suggestions
          </div>

          {/* ✅ Split title + tagline so we can style them the same font */}
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 md:text-7xl dark:text-slate-100">
              VibeBites
            </h1>

            <p className="mt-3 text-2xl font-extrabold tracking-tight md:text-3xl">
              <span className="bg-gradient-to-r from-orange-500 to-emerald-500 bg-clip-text text-transparent">
                Eat what you feel.
              </span>
            </p>
          </div>

          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Answer a quick check-in, choose your mood, and receive meal suggestions grouped by category
            with nutrition information and allergy reminders for safer choices.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/moods")}
              className="rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 active:scale-95 hover:bg-slate-800 dark:bg-white dark:text-slate-900"
            >
              Start Now →
            </button>

            <button
              onClick={() => navigate("/about")}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-800 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              Learn More
            </button>
          </div>

          {/* Small trust note */}
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/50">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              *VibeBites provides food suggestions for guidance only. It does not diagnose or treat any condition.
              Always consider allergies and personal dietary needs.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          {/* Big card container */}
          <div className="rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-200/60 dark:bg-slate-900 dark:ring-slate-700/60">
            <div className="grid grid-cols-2 gap-5">
              {[
                ["📝", "Quick Check-in"],
                ["😊", "Pick Mood"],
                ["🍛", "Full Meal"],
                ["🥟", "Appetizer"],
                ["🍨", "Dessert"],
                ["🥤", "Drink"],
              ].map(([e, label]) => (
                <div
                  key={label}
                  className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-xl dark:bg-slate-950 dark:ring-slate-800"
                >
                  <div className="text-4xl">{e}</div>
                  <div className="mt-3 text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {label}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                    Organized suggestions
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Glow blobs */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange-200 blur-3xl dark:bg-orange-500/25" />
          <div className="pointer-events-none absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-emerald-200 blur-3xl dark:bg-emerald-500/25" />
        </div>
      </div>
    </div>
  );
}
