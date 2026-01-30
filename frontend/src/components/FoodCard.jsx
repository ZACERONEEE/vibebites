import { useEffect, useMemo, useState } from "react";

function getSaved() {
  try {
    const raw = localStorage.getItem("vb_saved_meals");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setSaved(list) {
  localStorage.setItem("vb_saved_meals", JSON.stringify(list));
}

export default function FoodCard({ item }) {
  const [open, setOpen] = useState(false);
  const [saved, setSavedState] = useState(false);

  const key = useMemo(
    () => item._id || `${item.name}-${item.mood}-${item.category}`,
    [item]
  );

  useEffect(() => {
    const list = getSaved();
    setSavedState(list.some((x) => x.key === key));
  }, [key]);

  const toggleSave = () => {
    const list = getSaved();

    if (list.some((x) => x.key === key)) {
      const next = list.filter((x) => x.key !== key);
      setSaved(next);
      setSavedState(false);
      return;
    }

    const payload = {
      key,
      name: item.name,
      description: item.description,
      mood: item.mood,
      category: item.category,
      hungerLevel: item.hungerLevel,
      preference: item.preference,
      mealTime: item.mealTime || "",
      isVegetarian: !!item.isVegetarian,
      calories: item.calories ?? null,
      protein_g: item.protein_g ?? null,
      carbs_g: item.carbs_g ?? null,
      fat_g: item.fat_g ?? null,
      imageUrl: item.imageUrl || "",
    };

    const next = [payload, ...list].slice(0, 200);
    setSaved(next);
    setSavedState(true);
  };

  const hasNutrition =
    item.calories !== null ||
    item.protein_g !== null ||
    item.carbs_g !== null ||
    item.fat_g !== null;

  const imgSrc = item.imageUrl && item.imageUrl.trim() ? item.imageUrl : "/logo.png";

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      {/* Image */}
      <div className="relative h-40 w-full bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt={item.name}
          className="h-40 w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/logo.png";
          }}
        />
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-slate-900 shadow dark:bg-slate-900/80 dark:text-slate-100">
          {item.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {item.name}
              </div>

              <button
                type="button"
                onClick={toggleSave}
                className={`rounded-full px-3 py-1 text-xs font-extrabold transition active:scale-95 ${
                  saved
                    ? "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-200"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                }`}
                title={saved ? "Remove from saved" : "Save this meal"}
              >
                {saved ? "♥ Saved" : "♡ Save"}
              </button>
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
        </div>

        {/* Nutrition dropdown */}
        <div className="mt-4">
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
                <div>Nutrition info is not available for this item yet.</div>
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
    </div>
  );
}
