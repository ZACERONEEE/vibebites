import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import DisclaimerBox from "../components/DisclaimerBox";
import FoodCard from "../components/FoodCard";
import LoadingOverlay from "../components/LoadingOverlay";

export default function MealSuggestions() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    mood,
    hungerLevel,
    preference,
    vegetarianOnly = false,
    mealTime = "",
    avoid = [],
  } = location.state || {};

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMeals = async () => {
    try {
      setLoading(true);
      setError("");

      if (!mood || !hungerLevel || !preference) {
        navigate("/");
        return;
      }

      const params = new URLSearchParams({
        mood,
        hungerLevel,
        preference,
      });

      if (vegetarianOnly) params.append("vegetarian", "true");
      if (mealTime) params.append("mealTime", mealTime);

      // ✅ add avoid list
      if (avoid && avoid.length > 0) {
        params.append("avoid", avoid.join(","));
      }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/meals?${params.toString()}`
      );

      if (!res.ok) throw new Error("Failed to fetch meal suggestions");
      const json = await res.json();

      setData(json);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood, hungerLevel, preference, vegetarianOnly, mealTime, JSON.stringify(avoid)]);

  if (loading) {
    return <LoadingOverlay show={true} label="Finding food suggestions..." />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl p-6 text-center">
        <p className="text-red-600 font-bold">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 rounded-xl bg-slate-900 px-5 py-2 text-white font-bold"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { fullMeals, appetizers, desserts, drinks, snacks } = data;

  const Section = ({ title, items }) => {
    if (!items || items.length === 0) return null;

    return (
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-extrabold text-slate-900 dark:text-slate-100">
          {title}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <FoodCard key={item._id || `${item.name}-${title}`} item={item} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Your Food Suggestions
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">
          Based on your mood, hunger level, and preference
        </p>
      </div>

      <DisclaimerBox />

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
        <div className="font-extrabold text-slate-900 dark:text-slate-100">
          Why these were suggested
        </div>
        <div className="mt-1 leading-relaxed">
          Based on your selections: <b>{mood}</b> • <b>{hungerLevel}</b> •{" "}
          <b>{preference}</b>
          {vegetarianOnly ? " • Vegetarian only" : ""}
          {mealTime ? ` • ${mealTime}` : ""}
          {avoid.length > 0 ? ` • Avoid: ${avoid.join(", ")}` : ""}
          {preference === "Surprise" ? (
            <>
              <br />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Surprise mode shows mixed options for variety.
              </span>
            </>
          ) : null}
        </div>
      </div>

      <Section title="Full Meals" items={fullMeals} />
      <Section title="Appetizers" items={appetizers} />
      <Section title="Desserts" items={desserts} />
      <Section title="Drinks" items={drinks} />
      <Section title="Snacks" items={snacks} />

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => navigate("/moods")}
          className="rounded-2xl border border-slate-300 px-6 py-3 font-bold text-slate-800 transition hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Change mood
        </button>
        <button
          onClick={() => navigate("/questions", { state: { mood } })}
          className="rounded-2xl border border-slate-300 px-6 py-3 font-bold text-slate-800 transition hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Change selections
        </button>

        <button
          onClick={fetchMeals}
          className="rounded-2xl bg-orange-600 px-6 py-3 font-bold text-white transition hover:opacity-95 active:scale-95"
        >
          Regenerate 🔄
        </button>
      </div>
    </div>
  );
}
