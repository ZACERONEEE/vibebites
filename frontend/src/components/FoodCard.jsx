import { useMemo, useState, useEffect } from "react";
import { getFallbackImage, DEFAULT_FALLBACK } from "../data/mealImageFallbacks";

function normalizeAllergenTags(tags) {
  if (!Array.isArray(tags)) return [];
  return tags.map((t) => String(t || "").trim().toLowerCase()).filter(Boolean);
}

function formatAllergen(tag) {
  const map = {
    seafood: "Seafood",
    dairy: "Dairy",
    nuts: "Nuts",
    egg: "Egg",
    soy: "Soy",
    gluten: "Gluten",
    chicken: "Chicken",
  };
  return map[tag] || (tag ? tag[0].toUpperCase() + tag.slice(1) : "");
}

function toNumber(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function FoodCard({ meal, onSave, isSaved = false }) {
  const name = meal?.name || "Meal";
  const description = meal?.description || "";
  const category = meal?.category || "";
  const mealTime = meal?.mealTime || "";
  const isVegetarian = !!meal?.isVegetarian;

  const allergens = useMemo(
    () => normalizeAllergenTags(meal?.allergenTags),
    [meal?.allergenTags]
  );

  // ✅ Nutrition (supports null safely)
  const calories = toNumber(meal?.calories);
  const protein = toNumber(meal?.protein_g);
  const carbs = toNumber(meal?.carbs_g);
  const fat = toNumber(meal?.fat_g);

  const hasNutrition =
    calories !== null || protein !== null || carbs !== null || fat !== null;

  const [showNutrition, setShowNutrition] = useState(false);

  // ✅ IMAGE LOGIC:
  // 1) use DB imageUrl if present and not empty
  // 2) fallback by category+mealTime
  // 3) final fallback = /logo.png
  const preferredSrc = useMemo(() => {
    const dbUrl = (meal?.imageUrl || "").trim();
    if (dbUrl) return dbUrl;
    return getFallbackImage(category, mealTime);
  }, [meal?.imageUrl, category, mealTime]);

  const [imgSrc, setImgSrc] = useState(preferredSrc);
  useEffect(() => setImgSrc(preferredSrc), [preferredSrc]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* IMAGE */}
      <div className="relative h-44 w-full bg-slate-100">
        <img
          src={imgSrc}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setImgSrc(DEFAULT_FALLBACK)}
        />

        {category ? (
          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow">
            {category}
          </div>
        ) : null}
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
            {name}
            {mealTime ? (
              <span className="text-slate-500 font-semibold"> ({mealTime})</span>
            ) : null}
          </h3>

          <button
            type="button"
            onClick={() => onSave?.(meal)}
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold border transition ${
              isSaved
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-900 border-slate-200 hover:border-slate-300"
            }`}
          >
            {isSaved ? "Saved" : "♡ Save"}
          </button>
        </div>

        {description ? (
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        ) : null}

        {/* TAGS */}
        <div className="mt-3 flex flex-wrap gap-2">
          {isVegetarian ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              Vegetarian
            </span>
          ) : null}

          {mealTime ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              {mealTime}
            </span>
          ) : null}

          {allergens.length > 0 ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              Contains: {allergens.map(formatAllergen).join(", ")}
            </span>
          ) : (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Allergens: None listed
            </span>
          )}
        </div>

        {/* NUTRITION */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowNutrition((s) => !s)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-300 transition"
          >
            {showNutrition ? "Hide nutrition info ▲" : "Show nutrition info ▼"}
          </button>

          {showNutrition ? (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
              {hasNutrition ? (
                <div className="space-y-1">
                  <div>
                    Calories: <span className="font-bold">{calories ?? "N/A"}</span>
                  </div>
                  <div>
                    Protein (g): <span className="font-bold">{protein ?? "N/A"}</span>
                  </div>
                  <div>
                    Carbs (g): <span className="font-bold">{carbs ?? "N/A"}</span>
                  </div>
                  <div>
                    Fat (g): <span className="font-bold">{fat ?? "N/A"}</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    *Values are estimates for general guidance only.
                  </div>
                </div>
              ) : (
                <div className="text-slate-600">
                  Nutrition data not available for this item yet.
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
