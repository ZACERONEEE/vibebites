import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ALLERGENS = [
  { key: "seafood", label: "Seafood" },
  { key: "dairy", label: "Dairy" },
  { key: "nuts", label: "Nuts" },
  { key: "egg", label: "Egg" },
];

export default function PreMoodQuestions() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ mood comes from MoodSelection now
  const mood = location.state?.mood;

  const [answers, setAnswers] = useState({
    hungerLevel: "",
    preference: "",
    vegetarianOnly: false,
    mealTime: "",
    avoid: [],
  });

  const toggleAvoid = (key) => {
    setAnswers((p) => {
      const exists = p.avoid.includes(key);
      return {
        ...p,
        avoid: exists ? p.avoid.filter((x) => x !== key) : [...p.avoid, key],
      };
    });
  };

  const goNext = () => {
    if (!mood) {
      alert("Please select a mood first.");
      navigate("/moods");
      return;
    }

    if (!answers.hungerLevel || !answers.preference) {
      alert("Please answer hunger level and preference.");
      return;
    }

    // ✅ go straight to Suggestions now
    navigate("/suggestions", {
      state: {
        mood,
        hungerLevel: answers.hungerLevel,
        preference: answers.preference,
        vegetarianOnly: answers.vegetarianOnly,
        mealTime: answers.mealTime,
        avoid: answers.avoid,
      },
    });
  };

  return (
    <div className="fade-in mx-auto max-w-xl space-y-6 p-6">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Quick Check-in
        </h2>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {mood ? (
            <>
              Mood selected: <b>{mood}</b>. Now choose your hunger level and
              preference.
            </>
          ) : (
            <>Please select your mood first.</>
          )}
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-bold dark:text-slate-200">
              Hunger level
            </label>
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={answers.hungerLevel}
              onChange={(e) =>
                setAnswers((p) => ({ ...p, hungerLevel: e.target.value }))
              }
            >
              <option value="">Select...</option>
              <option value="Light">Light</option>
              <option value="Moderate">Moderate</option>
              <option value="Very Hungry">Very Hungry</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-bold dark:text-slate-200">
              Preference
            </label>
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={answers.preference}
              onChange={(e) =>
                setAnswers((p) => ({ ...p, preference: e.target.value }))
              }
            >
              <option value="">Select...</option>
              <option value="Healthy">Healthy options</option>
              <option value="Comfort">Comfort food</option>
              <option value="Balanced">Balanced</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-bold dark:text-slate-200">
              Meal time
            </label>
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={answers.mealTime}
              onChange={(e) =>
                setAnswers((p) => ({ ...p, mealTime: e.target.value }))
              }
            >
              <option value="">Any</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
            <input
              type="checkbox"
              checked={answers.vegetarianOnly}
              onChange={(e) =>
                setAnswers((p) => ({ ...p, vegetarianOnly: e.target.checked }))
              }
              className="h-5 w-5"
            />
            Vegetarian only
          </label>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
            <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Avoid (optional)
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              {ALLERGENS.map((a) => (
                <label
                  key={a.key}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 text-sm font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={answers.avoid.includes(a.key)}
                    onChange={() => toggleAvoid(a.key)}
                    className="h-4 w-4"
                  />
                  {a.label}
                </label>
              ))}
            </div>

            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              This helps filter out meals tagged with these ingredients.
            </div>
          </div>
        </div>

        <button
          onClick={goNext}
          className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-extrabold text-white shadow-lg transition hover:scale-[1.01] active:scale-95 dark:bg-white dark:text-slate-900"
        >
          Continue to Recommendations →
        </button>
      </div>
    </div>
  );
}
