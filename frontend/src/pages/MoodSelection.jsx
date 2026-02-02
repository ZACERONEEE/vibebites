import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";

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

  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/moods`);
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

  const chooseMood = (mood) => {
    // ✅ Now we go to questions AFTER selecting mood
    navigate("/questions", { state: { mood } });
  };

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <LoadingOverlay show={loading} label="Loading moods..." />

      <div className="fade-in">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Choose your mood
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Select how you feel first, then we’ll ask a few quick questions.
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
