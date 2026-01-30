export default function DisclaimerBox() {
  return (
    <div
      className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900
                 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-100"
      role="note"
      aria-label="Disclaimer"
    >
      <div className="font-extrabold">Important notice</div>
      <div className="mt-1 leading-relaxed">
        VibeBites provides general food suggestions based on your selections. It does not
        provide medical advice, nutritional prescriptions, or mental health diagnosis/treatment.
        Please consider allergies, existing conditions, and personal dietary needs. If you have
        concerns, consult a qualified professional.
      </div>
    </div>
  );
}
