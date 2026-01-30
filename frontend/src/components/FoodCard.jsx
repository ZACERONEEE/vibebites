import { useState } from "react";

export default function FoodCard({ item }) {
  const [open, setOpen] = useState(false);

  const hasNutrition =
    item.calories !== null ||
    item.protein_g !== null ||
    item.carbs_g !== null ||
    item.fat_g !== null;

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            {item.name}
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {item.description}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {item.isVegetarian && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                Vegetarian
              </span>
            )}
            {item.mealTime && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {item.mealTime}
              </span>
            )}
          </div>
        </div>

        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700 dark:bg-orange-900/30 dark:text-orange-200">
          {item.category}
        </span>
      </div>

      {/* Dropdown */}
      <div className="mt-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:shadow active:scale-95 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          {open ? "Hide nutrition info ▲" : "Show nutrition info ▼"}
        </button>

        {open && (
          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
            {!hasNutrition ? (
              <div>
                Nutrition info is not available for this item yet.
              </div>
            ) : (
              <ul className="space-y-1">
                <li>
                  Calories: <b>{item.calories ?? "N/A"}</b>
                </li>
                <li>
                  Protein (g): <b>{item.protein_g ?? "N/A"}</b>
                </li>
                <li>
                  Carbs (g): <b>{item.carbs_g ?? "N/A"}</b>
                </li>
                <li>
                  Fat (g): <b>{item.fat_g ?? "N/A"}</b>
                </li>
              </ul>
            )}

            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              *Values are estimates for general guidance only.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
