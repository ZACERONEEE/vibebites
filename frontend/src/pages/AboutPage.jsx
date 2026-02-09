export default function AboutPage() {
  return (
    <div className="fade-in mx-auto max-w-4xl space-y-6 px-4 py-10 md:py-14">
      <img
        src="/logo.png"
        alt="VibeBites Logo"
        className="mx-auto h-24 w-24"
      />

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          About VibeBites
        </h2>

        <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
          VibeBites is a mood-based meal recommendation web application designed
          to help users make mindful food choices based on how they feel. By
          selecting a mood and answering a quick check-in, users receive meal
          suggestions grouped by category (Full Meal, Appetizer, Dessert, Drink,
          Snack) with helpful nutrition information and allergy reminders.
        </p>

        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />

        {/* ✅ Mission + Vision */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Mission
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              To provide students with simple, mood-aware Filipino meal suggestions
              that encourage mindful eating—helping users feel supported, reduce
              decision fatigue, and choose food options more intentionally while
              considering basic nutrition and allergen awareness.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Vision
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              To be a trusted student-friendly platform that promotes healthier
              food decision-making through ethical, responsible, and accessible
              recommendations—while showcasing Filipino food culture in a modern
              and engaging way.
            </p>
          </div>
        </div>

        {/* ✅ Extra sections (adds “capstone” depth) */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              How VibeBites Works
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              <li>Users answer a quick check-in (hunger level, preference, meal time, etc.).</li>
              <li>Users select a mood that best describes how they feel.</li>
              <li>The system returns grouped meal suggestions from the database.</li>
              <li>Users can view nutrition info and save meals for later.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Safety & Ethics
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              <li>VibeBites provides general food suggestions only.</li>
              <li>It does not diagnose, treat, or provide mental health advice.</li>
              <li>Users are reminded to consider allergies and dietary needs.</li>
              <li>Pregnant/lactating users and special medical conditions are advised to consult professionals.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Key Features
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              <li>Mood-based meal recommendations</li>
              <li>Database-driven suggestions (MongoDB)</li>
              <li>Nutrition info dropdown per meal</li>
              <li>Allergen and vegetarian filters</li>
              <li>Saved meals and user feedback</li>
              <li>Responsive web design</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Development Team
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <li>Joriel G. Sicat</li>
              <li>Nathaniel I. Calo</li>
              <li>Benjamin C. Pineda</li>
              <li>Kurt C. Sanchez</li>
            </ul>
          </div>
        </div>

        {/* ✅ Bottom note */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
          <span className="font-bold text-slate-900 dark:text-slate-100">Disclaimer:</span>{" "}
          VibeBites offers general recommendations for educational and guidance purposes only.
          Always check ingredients for allergens and consult a registered nutritionist/dietitian
          or health professional for specific dietary concerns.
        </div>
      </div>
    </div>
  );
}
