import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ALLERGENS = [
  { key: "seafood", label: "Seafood" },
  { key: "dairy", label: "Dairy" },
  { key: "nuts", label: "Nuts" },
  { key: "egg", label: "Egg" },
  { key: "soy", label: "Soy" },
  { key: "gluten", label: "Gluten" },
  { key: "chicken", label: "Chicken" },
];

function StepPill({ num, label, done }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-extrabold ${
        done
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200"
          : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      }`}
    >
      <span
        className={`grid h-5 w-5 place-items-center rounded-full text-[11px] ${
          done
            ? "bg-emerald-600 text-white"
            : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-100"
        }`}
      >
        {done ? "✓" : num}
      </span>
      <span className="whitespace-nowrap">{label}</span>
    </div>
  );
}

export default function PreMoodQuestions() {
  const navigate = useNavigate();
  const location = useLocation();

  // Mood should come from MoodSelection or from MealSuggestions "Change selections"
  const mood = location.state?.mood || "";

  const [answers, setAnswers] = useState({
    hungerLevel: "",
    preference: "",
    vegetarianOnly: false,
    mealTime: "", // "" means Any / not selected (but we will make it required now)
    avoid: [],
    specialPopulation: "none", // none | pregnant | lactating
  });

  // ✅ Prefill answers when returning from suggestions
  useEffect(() => {
    const s = location.state || {};

    // Only set if state has something meaningful (avoids wiping while typing)
    setAnswers((prev) => ({
      hungerLevel: s.hungerLevel ?? prev.hungerLevel,
      preference: s.preference ?? prev.preference,
      vegetarianOnly: s.vegetarianOnly ?? prev.vegetarianOnly,
      mealTime: s.mealTime ?? prev.mealTime,
      avoid: Array.isArray(s.avoid) ? s.avoid : prev.avoid,
      specialPopulation: s.specialPopulation ?? prev.specialPopulation,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  const toggleAvoid = (key) => {
    setAnswers((p) => {
      const exists = p.avoid.includes(key);
      return {
        ...p,
        avoid: exists ? p.avoid.filter((x) => x !== key) : [...p.avoid, key],
      };
    });
  };

  const showSpecialWarning =
    answers.specialPopulation === "pregnant" ||
    answers.specialPopulation === "lactating";

  // ✅ Required fields (as you requested)
  const requirements = useMemo(() => {
    return {
      hungerOk: Boolean(answers.hungerLevel),
      prefOk: Boolean(answers.preference),
      timeOk: Boolean(answers.mealTime), // now required
    };
  }, [answers.hungerLevel, answers.preference, answers.mealTime]);

  const canContinue = mood && requirements.hungerOk && requirements.prefOk && requirements.timeOk;

  const goNext = () => {
    if (!mood) return; // UI handles this
    if (!canContinue) return;

    navigate("/suggestions", {
      state: {
        mood,
        hungerLevel: answers.hungerLevel,
        preference: answers.preference,
        vegetarianOnly: answers.vegetarianOnly,
        mealTime: answers.mealTime,
        avoid: answers.avoid,
        specialPopulation: answers.specialPopulation,
      },
    });
  };

  return (
    <div className="fade-in mx-auto max-w-xl space-y-6 p-6">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              Quick Check-in
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Answer these to personalize your meal suggestions.
            </p>
          </div>

          {mood ? (
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-extrabold text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
              Mood: <span className="text-orange-600 dark:text-orange-300">{mood}</span>
            </div>
          ) : null}
        </div>

        {/* ✅ Step markers */}
        <div className="mt-5 flex flex-wrap gap-2">
          <StepPill num={1} label="Hunger level" done={requirements.hungerOk} />
          <StepPill num={2} label="Preference" done={requirements.prefOk} />
          <StepPill num={3} label="Meal time" done={requirements.timeOk} />
        </div>

        {!mood ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
            Please select a mood first to continue.
            <button
              onClick={() => navigate("/moods")}
              className="mt-3 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-extrabold text-white shadow-lg transition hover:scale-[1.01] active:scale-95 dark:bg-white dark:text-slate-900"
            >
              Go to Mood Selection →
            </button>
          </div>
        ) : (
          <>
            {/* Special population (optional) */}
            <div className="mt-6">
              <label className="text-sm font-bold text-slate-900 dark:text-slate-200">
                Special population <span className="text-slate-400">(optional)</span>
              </label>

              <select
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={answers.specialPopulation}
                onChange={(e) =>
                  setAnswers((p) => ({ ...p, specialPopulation: e.target.value }))
                }
              >
                <option value="none">None</option>
                <option value="pregnant">Pregnant</option>
                <option value="lactating">Lactating / Breastfeeding</option>
              </select>

              {showSpecialWarning && (
                <div className="mt-3 rounded-2xl border border-yellow-300 bg-yellow-50 p-3 text-xs font-semibold text-yellow-900 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-100">
                  ⚠️ General guidance only. For pregnant/lactating individuals, consult a qualified health professional.
                </div>
              )}
            </div>

            <div className="mt-5 space-y-4">
              {/* Hunger level */}
              <div>
                <label className="text-sm font-bold text-slate-900 dark:text-slate-200">
                  Hunger level <span className="text-red-500">*</span>
                </label>
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
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

              {/* Preference */}
              <div>
                <label className="text-sm font-bold text-slate-900 dark:text-slate-200">
                  Preference <span className="text-red-500">*</span>
                </label>
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
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

              {/* Meal time */}
              <div>
                <label className="text-sm font-bold text-slate-900 dark:text-slate-200">
                  Meal time <span className="text-red-500">*</span>
                </label>
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  value={answers.mealTime}
                  onChange={(e) =>
                    setAnswers((p) => ({ ...p, mealTime: e.target.value }))
                  }
                >
                  <option value="">Select...</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>

              {/* Vegetarian */}
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={answers.vegetarianOnly}
                  onChange={(e) =>
                    setAnswers((p) => ({ ...p, vegetarianOnly: e.target.checked }))
                  }
                  className="h-5 w-5"
                />
                Vegetarian only <span className="text-slate-400 font-semibold">(optional)</span>
              </label>

              {/* Avoid allergens */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
                <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Avoid <span className="text-slate-400">(optional)</span>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  {ALLERGENS.map((a) => (
                    <label
                      key={a.key}
                      className={`flex items-center gap-2 rounded-xl border p-2 text-sm font-bold transition ${
                        answers.avoid.includes(a.key)
                          ? "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-orange-200"
                          : "border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      }`}
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
                  Filters out meals tagged with these allergens (if available).
                </div>
              </div>
            </div>

            {/* Continue */}
            {!canContinue ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                Please complete the required fields marked with <span className="text-red-500">*</span>.
              </div>
            ) : null}

            <button
              onClick={goNext}
              disabled={!canContinue}
              className={`mt-6 w-full rounded-2xl px-4 py-3 text-sm font-extrabold shadow-lg transition active:scale-95 ${
                canContinue
                  ? "bg-slate-900 text-white hover:scale-[1.01] dark:bg-white dark:text-slate-900"
                  : "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              Continue to Recommendations →
            </button>
          </>
        )}
      </div>
    </div>
  );
}