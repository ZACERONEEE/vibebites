import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";

const API = "https://vibebites-backend.onrender.com";

function Section({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-300">
          {items.length} item(s)
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((m) => (
          <div
            key={m._id || `${m.name}-${title}`}
            className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              {m.name}
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {m.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MealSuggestions() {
  const { state } = useLocation();
  const mood = state?.mood;
  const hungerLevel = state?.hungerLevel;
  const preference = state?.preference;

  const [grouped, setGrouped] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMeals = async () => {
    try {
      setLoading(true);
      setError("");

      const url =
        `${API}/api/meals/grouped?` +
        `mood=${encodeURIComponent(mood)}` +
        `&hungerLevel=${encodeURIComponent(hungerLevel)}` +
        `&preference=${encodeURIComponent(preference)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load meals");

      setGrouped(data.grouped);
    } catch (e) {
      setError(e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mood || !hungerLevel || !preference) return;
    fetchMeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood, hungerLevel, preference]);

  if (!mood || !hungerLevel || !preference) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-extrabold dark:text-slate-100">
          Missing selections
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Please answer questions and select a mood.
        </p>
        <Link
          to="/questions"
          className="mt-4 inline-flex rounded-2xl bg-slate-900 px-4 py-2 text-sm font-bold text-white dark:bg-white dark:text-slate-900"
        >
          Go to Questions
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LoadingOverlay show={loading} label="Generating recommendations..." />

      <div className="fade-in">
        <div className="text-sm font-semibold text-slate-500 dark:text-slate-300">
          Your selection
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Suggestions for: {mood}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Hunger: <b>{hungerLevel}</b> • Preference: <b>{preference}</b>
        </p>
        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          to="/moods"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm transition hover:shadow dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        >
          Change mood
        </Link>

        <button
          onClick={fetchMeals}
          className="rounded-2xl bg-orange-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:opacity-95 active:scale-95"
        >
          Regenerate 🔄
        </button>

        <Link
          to="/feedback"
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:opacity-95 dark:bg-white dark:text-slate-900"
        >
          Leave feedback
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && grouped && (
        <div className="space-y-8">
          <Section title="Full Meal" items={grouped["Full Meal"]} />
          <Section title="Appetizer" items={grouped["Appetizer"]} />
          <Section title="Dessert" items={grouped["Dessert"]} />
          <Section title="Drink" items={grouped["Drink"]} />
          <Section title="Snack" items={grouped["Snack"]} />
        </div>
      )}
    </div>
  );
}
