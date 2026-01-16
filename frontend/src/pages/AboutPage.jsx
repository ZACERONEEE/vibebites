export default function AboutPage() {
  return (
    <div className="fade-in mx-auto max-w-4xl space-y-6">
      <img
        src="/logo.png"
        alt="VibeBites Logo"
        className="mx-auto h-24 w-24 dark:bg-slate-900"
      />

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          About VibeBites
        </h2>

        <p className="mt-3 text-sm text-slate-600 leading-relaxed dark:text-slate-300">
          VibeBites is a mood-based meal recommendation web application designed
          to help users make mindful food choices based on their emotional state.
          By selecting a mood, users receive meal suggestions that match how they feel.
        </p>

        <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Key Features
            </h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1 dark:text-slate-300">
              <li>Mood-based meal recommendations</li>
              <li>Dynamic data from MongoDB</li>
              <li>Responsive web design</li>
              <li>User feedback collection</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Development Team
            </h3>
            <ul className="mt-2 text-sm text-slate-700 space-y-1 dark:text-slate-300">
              <li>Joriel G. Sicat</li>
              <li>Nathaniel I. Calo</li>
              <li>Benjamin C. Pineda</li>
              <li>Kurt C. Sanchez</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
