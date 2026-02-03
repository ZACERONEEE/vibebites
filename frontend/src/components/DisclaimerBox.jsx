import { useState } from "react";

export default function DisclaimerBox() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-100">
      <p className="font-bold mb-1">Important Disclaimer</p>

      <p className="mb-2">
        VibeBites provides general food suggestions only and does not offer
        medical, nutritional, or therapeutic advice.
      </p>

      {open && (
        <div className="space-y-2">
          <p>
            This system is intended for <strong>general users only</strong>.
            Individuals with medical conditions, diagnosed illnesses, food-related
            disorders, or special populations such as
            <strong> pregnant or lactating/breastfeeding individuals </strong>
            should consult a qualified healthcare professional before making
            dietary decisions.
          </p>

          <p>
            Suggested foods may contain or come into contact with allergens such
            as <strong>seafood, dairy, nuts, eggs, soy, gluten</strong>, and other
            food allergens. Users with allergies or sensitivities should carefully
            review ingredients and consider their personal health conditions.
          </p>

          <p>
            All recommendations are for informational purposes only and should
            not replace professional consultation.
          </p>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="mt-2 text-xs font-bold underline underline-offset-2 hover:opacity-80"
      >
        {open ? "Read less ▲" : "Read more ▼"}
      </button>
    </div>
  );
}
