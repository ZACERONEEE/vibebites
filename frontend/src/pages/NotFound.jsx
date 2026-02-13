import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="fade-in flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-7xl font-extrabold text-orange-500">404</h1>

      <p className="mt-3 text-xl font-bold text-slate-900 dark:text-slate-100">
        Page Not Found
      </p>

      <p className="mt-1 text-slate-600 dark:text-slate-400">
        The page you are looking for does not exist.
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-6 rounded-2xl bg-orange-600 px-6 py-3 font-bold text-white shadow-md hover:bg-orange-700"
      >
        Go Home
      </button>
    </div>
  );
}
