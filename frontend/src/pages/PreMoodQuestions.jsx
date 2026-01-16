import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PreMoodQuestions() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({
    hungerLevel: "",
    preference: "",
  });

  const goNext = () => {
    if (!answers.hungerLevel || !answers.preference) {
      alert("Please answer all questions.");
      return;
    }

    navigate("/moods", { state: { preAnswers: answers } });
  };

  return (
    <div className="fade-in mx-auto max-w-xl space-y-6">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Quick Check-in
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Choose your hunger level and preference to personalize recommendations.
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
              <option value="Surprise">Surprise me</option>
            </select>
          </div>
        </div>

        <button
          onClick={goNext}
          className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-extrabold text-white shadow-lg transition hover:scale-[1.01] active:scale-95 dark:bg-white dark:text-slate-900"
        >
          Continue to Mood Selection →
        </button>
      </div>
    </div>
  );
}
