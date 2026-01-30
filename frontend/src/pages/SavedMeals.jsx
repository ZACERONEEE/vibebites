import { useEffect, useState } from "react";
import FoodCard from "../components/FoodCard";

function getSaved() {
  try {
    const raw = localStorage.getItem("vb_saved_meals");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function SavedMeals() {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    setSaved(getSaved());
  }, []);

  const refresh = () => setSaved(getSaved());

  const clearAll = () => {
    localStorage.removeItem("vb_saved_meals");
    setSaved([]);
  };

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <div className="fade-in">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Saved Meals
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">
          Your bookmarked food suggestions (stored on this device).
        </p>
        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={refresh}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-2 text-sm font-bold text-slate-800 shadow-sm transition hover:shadow active:scale-95 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          Refresh
        </button>
        <button
          onClick={clearAll}
          className="rounded-2xl bg-pink-600 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:opacity-95 active:scale-95"
        >
          Clear All
        </button>
      </div>

      {saved.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          No saved meals yet. Go to Recommendations and tap <b>Save</b>.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {saved.map((item) => (
            <FoodCard key={item.key} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
