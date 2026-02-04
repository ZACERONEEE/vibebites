import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FoodCard from "../components/FoodCard";

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

export default function SavedMeals() {
  const navigate = useNavigate();
  const [savedMeals, setSavedMeals] = useState([]);

  // Track which meal is being removed (for animation)
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    setSavedMeals(loadSavedMeals());
  }, []);

  const savedIds = useMemo(() => {
    return new Set(savedMeals.map((m) => m._id || m.name));
  }, [savedMeals]);

  function removeWithAnimation(meal) {
    if (!meal) return;
    const id = meal._id || meal.name;

    // trigger heartbreak animation
    setRemovingId(id);

    // wait for animation then remove
    setTimeout(() => {
      setSavedMeals((prev) => {
        const next = prev.filter((m) => (m._id || m.name) !== id);
        saveSavedMeals(next);
        return next;
      });
      setRemovingId(null);
    }, 450); // duration must match CSS animation
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Saved Meals</h1>
          <p className="mt-1 text-slate-600">
            Your saved recommendations are stored in this device/browser.
          </p>
        </div>

        <button
          className="rounded-full border border-slate-300 bg-white px-5 py-2 font-semibold text-slate-800 hover:bg-slate-50"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      {savedMeals.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
          No saved meals yet. Go back and tap <b>♡ Save</b> on a meal.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {savedMeals.map((meal) => {
            const id = meal._id || meal.name;
            const isRemoving = removingId === id;

            return (
              <div
                key={id}
                className={`${isRemoving ? "heartbreakWrap" : ""}`}
              >
                <FoodCard
                  meal={meal}
                  // For saved page: clicking "Saved" removes (with animation)
                  onSave={removeWithAnimation}
                  isSaved={savedIds.has(id)}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Animation CSS */}
      <style>{`
        .heartbreakWrap {
          animation: heartbreak 0.45s ease-in-out forwards;
          transform-origin: center;
        }

        @keyframes heartbreak {
          0%   { transform: scale(1); opacity: 1; filter: grayscale(0); }
          35%  { transform: scale(1.03) rotate(-1deg); opacity: 1; }
          65%  { transform: scale(0.98) rotate(1deg); opacity: 0.85; filter: grayscale(0.6); }
          100% { transform: scale(0.92); opacity: 0; filter: grayscale(1); }
        }
      `}</style>
    </div>
  );
}
