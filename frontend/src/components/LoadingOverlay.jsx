export default function LoadingOverlay({ show, label = "Loading..." }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/30 backdrop-blur-sm">
      <div className="w-[300px] rounded-3xl border border-white/10 bg-white/90 p-6 shadow-2xl dark:bg-slate-900/90">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500 to-emerald-500 opacity-30 blur" />
            <img
              src="/logo.png"
              alt="VibeBites"
              className="relative h-14 w-14 rounded-2xl bg-white p-2 shadow"
            />
            <div className="absolute -inset-1 rounded-3xl border-2 border-orange-400/40 spin-slow" />
          </div>

          <div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              VibeBites
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              {label}
            </div>
          </div>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full w-1/2 animate-pulse bg-gradient-to-r from-orange-500 to-emerald-500" />
        </div>
      </div>
    </div>
  );
}
