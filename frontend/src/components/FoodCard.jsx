import { useMemo, useState } from "react";

function StatChip({ label, value, unit }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-bold text-slate-900">
        {value ?? "N/A"}
        {value != null && unit ? (
          <span className="ml-1 text-xs font-semibold text-slate-600">{unit}</span>
        ) : null}
      </div>
    </div>
  );
}

export default function FoodCard({ meal, onSave, isSaved = false }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const allergens =
    Array.isArray(meal?.allergenTags) && meal.allergenTags.length > 0
      ? meal.allergenTags.join(", ")
      : null;

  const heartLabel = isSaved ? (hovered ? "💔 Remove" : "❤️ Saved") : "♡ Save";

  const heartClasses = isSaved
    ? hovered
      ? "bg-red-100 text-red-700 border-red-300"
      : "bg-red-600 text-white border-red-600"
    : "bg-white text-slate-900 border-slate-200 hover:border-slate-300";

  const imageSrc = useMemo(() => {
    const url = (meal?.imageUrl || "").trim();
    return url.length > 0 ? url : "";
  }, [meal]);

  // ✅ Remove "(Breakfast)" "(Lunch)" "(Dinner)" suffix from displayed name
  const displayName = useMemo(() => {
    const raw = (meal?.name || "Meal").trim();
    return raw.replace(/\s*\((Breakfast|Lunch|Dinner)\)\s*$/i, "");
  }, [meal?.name]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {/* IMAGE */}
      <div className="relative h-44 w-full bg-slate-100">
        {imageSrc && !imgError ? (
          <img
            src={imageSrc}
            alt={displayName}
            className="h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-slate-500">
            {imageSrc ? "Image link is invalid / blocked" : "No image yet"}
          </div>
        )}

        {/* Top pills */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {/* ✅ Removed category pill to avoid repeating section header */}

          {meal?.mealTime ? (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
              {meal.mealTime}
            </span>
          ) : null}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="break-words text-lg font-bold text-slate-900">
              {displayName}
            </h3>
            {meal?.description ? (
              <p className="mt-1 text-sm text-slate-600">{meal.description}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => onSave?.(meal)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`shrink-0 rounded-full border px-3 py-1 text-sm font-semibold transition ${heartClasses}`}
          >
            {heartLabel}
          </button>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {meal?.isVegetarian ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Vegetarian
            </span>
          ) : null}

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

        {/* Modern accordion */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <div>
              <div className="text-sm font-bold text-slate-900">Nutrition info</div>
              <div className="text-xs text-slate-600">
                Tap to {open ? "hide" : "view"} calories & macros
              </div>
            </div>

            {/* Chevron */}
            <div
              className={`ml-3 grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white transition ${
                open ? "rotate-180" : "rotate-0"
              }`}
              aria-hidden="true"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>

          {/* Panel */}
          <div
            className={`grid transition-[grid-template-rows] duration-300 ${
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-3">
                  <StatChip label="Calories" value={meal?.calories ?? null} unit="kcal" />
                  <StatChip label="Protein" value={meal?.protein_g ?? null} unit="g" />
                  <StatChip label="Carbs" value={meal?.carbs_g ?? null} unit="g" />
                  <StatChip label="Fat" value={meal?.fat_g ?? null} unit="g" />
                </div>

                <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
                  Values are estimates for guidance only. Consider allergies and dietary needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
