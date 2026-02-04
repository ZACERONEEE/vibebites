import { useState } from "react";

export default function FoodCard({ meal, onSave, isSaved = false }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const allergens =
    Array.isArray(meal?.allergenTags) && meal.allergenTags.length > 0
      ? meal.allergenTags.join(", ")
      : null;

  const heartLabel = isSaved
    ? hovered
      ? "💔 Remove"
      : "❤️ Saved"
    : "♡ Save";

  const heartClasses = isSaved
    ? hovered
      ? "bg-red-100 text-red-700 border-red-300"
      : "bg-red-600 text-white border-red-600"
    : "bg-white text-slate-900 border-slate-200 hover:border-slate-300";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-slate-900 break-words">
            {meal?.name || "Meal"}
          </h3>

          {meal?.description && (
            <p className="mt-1 text-sm text-slate-600">
              {meal.description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSave?.(meal)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold border transition ${heartClasses}`}
        >
          {heartLabel}
        </button>
      </div>

      {/* META TAGS */}
      <div className="mt-3 flex flex-wrap gap-2">
        {meal?.category && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {meal.category}
          </span>
        )}

        {meal?.mealTime && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {meal.mealTime}
          </span>
        )}

        {meal?.isVegetarian && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Vegetarian
          </span>
        )}

        {allergens ? (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            Contains: {allergens}
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Allergens: None listed
          </span>
        )}
      </div>

      {/* NUTRITION */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-4 text-sm font-semibold text-slate-800 underline"
      >
        {open ? "Hide Nutrition Info" : "View Nutrition Info"}
      </button>

      {open && (
        <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-800">
          <div>Calories: {meal?.calories ?? "N/A"}</div>
          <div>Protein: {meal?.protein_g ?? "N/A"} g</div>
          <div>Carbs: {meal?.carbs_g ?? "N/A"} g</div>
          <div>Fat: {meal?.fat_g ?? "N/A"} g</div>
        </div>
      )}
    </div>
  );
}
