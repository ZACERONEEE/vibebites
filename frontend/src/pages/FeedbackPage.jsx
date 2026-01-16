import { useState } from "react";
import LoadingOverlay from "../components/LoadingOverlay";

const API = process.env.REACT_APP_API_URL;

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return alert("Please choose a rating.");

    try {
      setLoading(true);
      const res = await fetch(`${API}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      if (!res.ok) throw new Error("Failed to submit feedback");
      alert("Thanks! Feedback submitted.");
      setRating(0);
      setHover(0);
      setComment("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in mx-auto max-w-xl space-y-6">
      <LoadingOverlay show={loading} label="Submitting feedback..." />

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Feedback
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Help us improve VibeBites.
        </p>

        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />

        <form onSubmit={submit} className="mt-6 space-y-5">
          <div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Rate your experience
            </div>
            <div className="mt-2 flex gap-1 text-3xl">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(s)}
                  className="transition hover:scale-125 active:scale-95"
                  aria-label={`Rate ${s} stars`}
                >
                  <span className={(hover || rating) >= s ? "text-yellow-400" : "text-slate-300"}>
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-orange-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              placeholder="What did you like or want to improve?"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-extrabold text-white shadow-lg transition hover:scale-[1.01] active:scale-95 disabled:opacity-70 dark:bg-white dark:text-slate-900"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}
