import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="fade-in grid gap-8 md:grid-cols-2 md:items-center">
      <div className="space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700 dark:bg-orange-500/15 dark:text-orange-200">
          ✨ Mood-based meal suggestions
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl dark:text-slate-100">
          VibeBites
          <span className="block bg-gradient-to-r from-orange-500 to-emerald-500 bg-clip-text text-transparent">
            Eat what you feel.
          </span>
        </h1>

        <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Answer a quick check-in, choose your mood, and receive meal suggestions grouped by category.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/questions")}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-95 hover:bg-slate-800 dark:bg-white dark:text-slate-900"
          >
            Start Now →
          </button>

          <button
            onClick={() => navigate("/about")}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:scale-[1.02] active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            Learn More
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-900 dark:shadow-none">
          <div className="grid grid-cols-2 gap-4">
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
                className="rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950"
              >
                <div className="text-3xl">{e}</div>
                <div className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-100">
                  {label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-300">
                  Organized suggestions
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-200 blur-2xl dark:bg-orange-500/30" />
        <div className="pointer-events-none absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-emerald-200 blur-2xl dark:bg-emerald-500/30" />
      </div>
    </div>
  );
}
