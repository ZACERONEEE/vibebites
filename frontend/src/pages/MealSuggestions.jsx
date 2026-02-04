import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import DisclaimerBox from "../components/DisclaimerBox";
import FoodCard from "../components/FoodCard";
import LoadingOverlay from "../components/LoadingOverlay";

const API = process.env.REACT_APP_API_URL || "https://vibebites-backend.onrender.com";
const SAVED_KEY = "vibebites_saved_meals_v1";

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function loadSavedMeals() {
  const raw = localStorage.getItem(SAVED_KEY);
  const arr = safeParse(raw, []);
  return Array.isArray(arr) ? arr : [];
}

function saveSavedMeals(arr) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(arr));
}

function Section({ title, items, savedIds, onSave }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <span className="text-xs text-slate-500">{items.length} item(s)</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((meal) => (
          <FoodCard
            key={meal._id || `${meal.name}-${title}`}
            meal={meal}
            onSave={onSave}
            isSaved={savedIds.has(meal._id || meal.name)}
          />
        ))}
      </div>
    </div>
  );
}

export default function MealSuggestions() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    mood,
    hungerLevel,
    preference,
    mealTime = "Any",
    vegetarianOnly = false,
    avoid = [],
  } = location.state || {};

  const [grouped, setGrouped] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Regenerate trigger
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ Saved meals (localStorage)
  const [savedMeals, setSavedMeals] = useState(() => {
    if (typeof window === "undefined") return [];
    return loadSavedMeals();
  });

  const savedIds = useMemo(() => {
    return new Set(savedMeals.map((m) => m._id || m.name));
  }, [savedMeals]);

  function handleSaveMeal(meal) {
    if (!meal) return;

    const id = meal._id || meal.name;

    setSavedMeals((prev) => {
      const exists = prev.some((m) => (m._id || m.name) === id);

      let next;
      if (exists) {
        // unsave
        next = prev.filter((m) => (m._id || m.name) !== id);
      } else {
        // save
        next = [meal, ...prev];
      }

      saveSavedMeals(next);
      return next;
    });
  }

  const query = useMemo(() => {
    const params = new URLSearchParams();

    if (mood) params.set("mood", mood);
    if (hungerLevel) params.set("hungerLevel", hungerLevel);
    if (preference) params.set("preference", preference);

    if (mealTime && mealTime !== "Any") params.set("mealTime", mealTime);

    if (vegetarianOnly) params.set("vegetarianOnly", "true");

    if (Array.isArray(avoid) && avoid.length > 0) {
      params.set("avoid", avoid.join(","));
    }

    // cache-buster to ensure new request
    params.set("_t", String(Date.now()));

    return params.toString();
  }, [mood, hungerLevel, preference, mealTime, vegetarianOnly, avoid]);

  useEffect(() => {
    if (!mood || !hungerLevel || !preference) {
      setError("Missing answers. Please answer the quick check-in first.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API}/api/meals?${query}`);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);

        const json = await res.json();
        const results = json.results || null;

        if (!cancelled) {
          setGrouped(results);
          setMeta({
            mood: json.mood,
            filters: json.filters,
            count: json.count,
          });
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load meals");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [query, mood, hungerLevel, preference, refreshKey]);

  const selectedLine = meta?.filters
    ? `${meta.filters.mood} · ${meta.filters.hungerLevel} · ${meta.filters.preference} · ${
        meta.filters.mealTime || "Any"
      }`
    : "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <LoadingOverlay show={loading} />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Your Food Suggestions</h1>
          <p className="mt-1 text-slate-600">Based on your mood, hunger level, and preference</p>
        </div>

        <DisclaimerBox />

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="font-semibold text-slate-900">Why these were suggested</h3>
          <p className="mt-1 text-sm text-slate-600">
            Based on your selections:{" "}
            <span className="font-semibold text-slate-900">{selectedLine}</span>
          </p>
          {meta?.count != null ? (
            <p className="mt-1 text-xs text-slate-500">
              {meta.count} matching meals in database (showing a few per category).
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-full border border-slate-300 bg-white px-5 py-2 font-semibold text-slate-800 hover:bg-slate-50"
            onClick={() => navigate("/moods")}
          >
            Change mood
          </button>

          <button
            className="rounded-full border border-slate-300 bg-white px-5 py-2 font-semibold text-slate-800 hover:bg-slate-50"
            onClick={() =>
              navigate("/questions", {
                state: { mood, hungerLevel, preference, mealTime, vegetarianOnly, avoid },
              })
            }
          >
            Change selections
          </button>

          <button
            className="rounded-full bg-orange-600 px-5 py-2 font-semibold text-white hover:bg-orange-700"
            onClick={() => setRefreshKey((k) => k + 1)}
          >
            Regenerate ↻
          </button>

          <button
            className="rounded-full border border-slate-300 bg-white px-5 py-2 font-semibold text-slate-800 hover:bg-slate-50"
            onClick={() => navigate("/saved")}
          >
            View Saved ({savedMeals.length})
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {grouped && (
          <div className="space-y-10">
            <Section title="Full Meals" items={grouped["Full Meal"]} savedIds={savedIds} onSave={handleSaveMeal} />
            <Section title="Appetizers" items={grouped["Appetizer"]} savedIds={savedIds} onSave={handleSaveMeal} />
            <Section title="Desserts" items={grouped["Dessert"]} savedIds={savedIds} onSave={handleSaveMeal} />
            <Section title="Drinks" items={grouped["Drink"]} savedIds={savedIds} onSave={handleSaveMeal} />
            <Section title="Snacks" items={grouped["Snack"]} savedIds={savedIds} onSave={handleSaveMeal} />
          </div>
        )}

        {!loading && !error && !grouped && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
            No meals returned.
          </div>
        )}
      </div>
    </div>
  );
}
