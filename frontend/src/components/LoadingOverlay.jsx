export default function LoadingOverlay({ show = false, label = "Loading..." }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center rounded-2xl bg-white px-8 py-6 shadow-2xl dark:bg-slate-900">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900 dark:border-slate-600 dark:border-t-white" />

        {/* Label */}
        <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </p>
      </div>
    </div>
  );
}
