// frontend/src/data/mealImageFallbacks.js
// Uses a SMALL set of images so you don't need 1000+ unique photos.

export const DEFAULT_FALLBACK = "/logo.png";

// Replace these with YOUR Cloudinary URLs (one per combo is enough).
// Tip: you only need ~9–15 images total.
export const FALLBACK_BY_CATEGORY_MEALTIME = {
  "Full Meal|Breakfast": DEFAULT_FALLBACK,
  "Full Meal|Lunch": DEFAULT_FALLBACK,
  "Full Meal|Dinner": DEFAULT_FALLBACK,

  "Appetizer|Breakfast": DEFAULT_FALLBACK,
  "Appetizer|Lunch": DEFAULT_FALLBACK,
  "Appetizer|Dinner": DEFAULT_FALLBACK,

  "Dessert|Breakfast": DEFAULT_FALLBACK,
  "Dessert|Lunch": DEFAULT_FALLBACK,
  "Dessert|Dinner": DEFAULT_FALLBACK,

  "Drink|Breakfast": DEFAULT_FALLBACK,
  "Drink|Lunch": DEFAULT_FALLBACK,
  "Drink|Dinner": DEFAULT_FALLBACK,

  "Snack|Breakfast": DEFAULT_FALLBACK,
  "Snack|Lunch": DEFAULT_FALLBACK,
  "Snack|Dinner": DEFAULT_FALLBACK,
};

export function getFallbackImage(category, mealTime) {
  const cat = (category || "").trim();
  const mt = (mealTime || "Any").trim();

  const key = `${cat}|${mt}`;
  return FALLBACK_BY_CATEGORY_MEALTIME[key] || DEFAULT_FALLBACK;
}
