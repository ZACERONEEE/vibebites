import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";

const API = process.env.REACT_APP_API_URL || "https://vibebites-backend.onrender.com";

export default function FeedbackPage() {
  const navigate = useNavigate();
  const { mealId } = useParams(); // Captures the ID if rating a specific meal
  
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return alert("Please choose a rating before submitting.");

    try {
      setLoading(true);
      const res = await fetch(`${API}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          rating, 
          comment,
          mealId: mealId || null // Sends null if it's general feedback
        }),
      });

      if (!res.ok) throw new Error("Failed to submit feedback");
      
      setSubmitted(true);
      setRating(0);
      setComment("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 space-y-6 fade-in">
        <div className="text-6xl text-orange-500">✨</div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Salamat!</h2>
        <p className="text-slate-600 dark:text-slate-400">Your feedback helps us make VibeBites better for everyone.</p>
        <button 
          onClick={() => navigate("/suggestions")}
          className="rounded-full bg-slate-900 px-8 py-3 font-bold text-white transition-transform hover:scale-105 active:scale-95 dark:bg-white dark:text-slate-900"
        >
          Back to Suggestions
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in mx-auto max-w-xl space-y-6">
      <LoadingOverlay show={loading} label="Sending your thoughts..." />

      <button 
        onClick={() => navigate(-1)} 
        className="text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
      >
        ← Back
      </button>

      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Feedback</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Help us improve VibeBites.</p>

        <form onSubmit={submit} className="mt-8 space-y-6">
          <div>
            <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Rate your experience</label>
            <div className="mt-2 flex gap-2 text-4xl">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(s)}
                  className="transition-transform hover:scale-125 active:scale-95"
                >
                  <span className={(hover || rating) >= s ? "text-yellow-400" : "text-slate-200 dark:text-slate-700"}>
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Comment (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:ring-2 focus:ring-orange-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              placeholder="What did you like or want to improve?"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 py-4 text-sm font-extrabold text-white shadow-lg transition-all hover:bg-black disabled:opacity-50 dark:bg-white dark:text-slate-900"
          >
            {loading ? "Sending..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}