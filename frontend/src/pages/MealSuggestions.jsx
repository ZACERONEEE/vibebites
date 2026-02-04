import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import DisclaimerBox from "../components/DisclaimerBox";
import FoodCard from "../components/FoodCard";
import LoadingOverlay from "../components/LoadingOverlay";

const API = process.env.REACT_APP_API_URL || "https://vibebites-backend.onrender.com";

function Section({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <span className="text-xs text-slate-500">{items.length} item(s)</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((meal) => (
          <FoodCard key={meal._id || `${meal.name}-${title}`} meal={meal} />
        ))}
      </div>
    </div>
  );
}

export default function MealSuggestions() {
  const navigate = useNavigate();
  const location = useLocation();

  // values passed from MoodSelection (or previous page)
  const {
    mood,
    hungerLevel,
    preference,
    mealTime = "Any",
    vegetarianOnly = false,
    avoid = [],
  } = location.state || {};

  const [grouped, setGrouped] = useState(null); // grouped results
  const [meta, setMeta] = useState(null); // filters, count etc
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // used to force "Regenerate"
  const [refreshKey, setRefreshKey] = useState(0);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (mood) params.set("mood", mood);
    if (hungerLevel) params.set("hungerLevel", hungerLevel);
    if (preference) params.set("preference", preference);

    // backend supports mealTime; allow "Any" to mean "no filter"
    if (mealTime && mealTime !== "Any") params.set("mealTime", mealTime);

    if (vegetarianOnly) params.set("vegetarianOnly", "true");

    if (Array.isArray(avoid) && avoid.length > 0) {
      // backend expects comma-separated
      params.set("avoid", avoid.join(","));
    }

    // cache-buster (so regenerate truly refetches)
    params.set("_t", String(Date.now()));

    return params.toString();
  }, [mood, hungerLevel, preference, mealTime, vegetarianOnly, avoid]);


  useEffect(() => {
    // If user landed here without required data, send them back properly
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

        // ✅ IMPORTANT: your backend returns { results: { "Full Meal": [...], ... }, count, filters, mood }
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
    ? `${meta.filters.mood} · ${meta.filters.hungerLevel} · ${meta.filters.preference} · ${meta.filters.mealTime || "Any"}`
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
            Based on your selections: <span className="font-semibold text-slate-900">{selectedLine}</span>
          </p>
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
                state: {
                mood, // ✅ keep mood
                hungerLevel,
                preference,
                mealTime,
                vegetarianOnly,
                avoid,
                },
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
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* ✅ RENDER GROUPED RESULTS */}
        {grouped && (
          <div className="space-y-10">
            <Section title="Full Meals" items={grouped["Full Meal"]} />
            <Section title="Appetizers" items={grouped["Appetizer"]} />
            <Section title="Desserts" items={grouped["Dessert"]} />
            <Section title="Drinks" items={grouped["Drink"]} />
            <Section title="Snacks" items={grouped["Snack"]} />
          </div>
        )}

        {/* If grouped is null but no error, show empty state */}
        {!loading && !error && !grouped && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
            No meals returned.
          </div>
        )}
      </div>
    </div>
  );
}
