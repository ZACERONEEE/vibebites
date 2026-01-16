import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";

const API = "https://vibebites-backend.onrender.com";

const EMOJI = {
  Happy: "😊",
  Sad: "😢",
  Stressed: "😮‍💨",
  Energetic: "⚡",
  Tired: "😴",
  Bored: "😐",
};

export default function MoodSelection() {
  const navigate = useNavigate();
  const location = useLocation();

  const preAnswers = location.state?.preAnswers;
  const hungerLevel = preAnswers?.hungerLevel;
  const preference = preAnswers?.preference;

  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API}/api/moods`);
        if (!res.ok) throw new Error("Failed to fetch moods");

        const data = await res.json();
        setMoods(data);
      } catch (e) {
        setError(e.message || "Load failed");
      } finally {
        setLoading(false);
      }
    };

    fetchMoods();
  }, []);

  if (!hungerLevel || !preference) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-extrabold dark:text-slate-100">
          Missing answers
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Please answer the quick check-in first.
        </p>
        <Link
          to="/questions"
          className="mt-4 inline-flex rounded-2xl bg-slate-900 px-4 py-2 text-sm font-bold text-white dark:bg-white dark:text-slate-900"
        >
          Go to Questions
        </Link>
      </div>
    );
  }

  const chooseMood = (mood) => {
    navigate("/suggestions", {
      state: { mood, hungerLevel, preference },
    });
  };

  return (
    <div className="space-y-6">
      <LoadingOverlay show={loading} label="Loading moods..." />

      <div className="fade-in">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Choose your mood
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Hunger: <b>{hungerLevel}</b> • Preference: <b>{preference}</b>
        </p>
        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {moods.map((m) => (
            <button
              key={m._id || m.name}
              onClick={() => chooseMood(m.name)}
              className="group fade-in rounded-3xl border border-slate-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl active:scale-95 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div className="text-3xl">{EMOJI[m.name] || "🍽️"}</div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                  Select →
                </span>
              </div>
              <div className="mt-3 text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {m.name}
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {m.description || "Mood-based suggestions"}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
