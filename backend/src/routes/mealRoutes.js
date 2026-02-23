const express = require("express");
const router = express.Router();
const Meal = require("../models/Meal");

const VALID_HUNGER = new Set(["Light", "Moderate", "Very Hungry"]);
const VALID_PREF = new Set(["Healthy", "Comfort", "Balanced", "Surprise"]);
const VALID_MEALTIME = new Set(["Breakfast", "Lunch", "Dinner", "Any", ""]);

const ALLERGEN_KEYS = new Set([
  "seafood",
  "dairy",
  "nuts",
  "egg",
  "soy",
  "gluten",
  "chicken",
]);

const CATEGORIES = ["Full Meal", "Appetizer", "Dessert", "Drink", "Snack"];

const norm = (v) => String(v || "").trim();

function parseBool(v) {
  return v === true || v === "true" || v === "1" || v === 1;
}

function parseAvoid(v) {
  if (!v) return [];
  const list = Array.isArray(v) ? v : String(v).split(",");
  return list
    .map((x) => String(x || "").trim().toLowerCase())
    .filter((x) => x && ALLERGEN_KEYS.has(x));
}

// deterministic fallback chain (no randomness)
async function findWithFallbackLimited(baseQuery, fallbackSteps, limit) {
  // strict first
  let meals = await Meal.find(baseQuery)
    .sort({ name: 1, _id: 1 })
    .limit(limit)
    .lean();
  if (meals.length >= limit) return meals;

  // fallback steps
  for (const removeKeys of fallbackSteps) {
    const q = { ...baseQuery };
    for (const k of removeKeys) delete q[k];

    meals = await Meal.find(q)
      .sort({ name: 1, _id: 1 })
      .limit(limit)
      .lean();

    if (meals.length >= 1) {
      // if we got something, return it (or keep going only if you want to fill more)
      // but we want "up to limit", so return it now.
      return meals;
    }
  }

  return [];
}

/**
 * GET /api/meals
 * Query: mood (required), hungerLevel, preference, mealTime, vegetarianOnly, avoid
 * Returns: { results: { "Full Meal": [...], ... }, count, filters }
 */
router.get("/", async (req, res) => {
  try {
    const mood = norm(req.query.mood);
    const hungerLevel = norm(req.query.hungerLevel);
    const preference = norm(req.query.preference);
    const mealTime = norm(req.query.mealTime);
    const vegetarianOnly = parseBool(req.query.vegetarianOnly);
    const avoid = parseAvoid(req.query.avoid);

    if (!mood) {
      return res.status(400).json({ error: "mood is required" });
    }

    if (hungerLevel && !VALID_HUNGER.has(hungerLevel)) {
      return res.status(400).json({ error: "Invalid hungerLevel" });
    }

    if (preference && !VALID_PREF.has(preference)) {
      return res.status(400).json({ error: "Invalid preference" });
    }

    if (!VALID_MEALTIME.has(mealTime)) {
      return res.status(400).json({ error: "Invalid mealTime" });
    }

    // shared query base
    const base = { mood };

    if (hungerLevel) base.hungerLevel = hungerLevel;

    // Surprise means "no preference filter"
    if (preference && preference !== "Surprise") base.preference = preference;

    // mealTime "Any" means no filter
    if (mealTime && mealTime !== "Any") base.mealTime = mealTime;

    if (vegetarianOnly) base.isVegetarian = true;

    if (avoid.length > 0) {
      base.allergenTags = { $nin: avoid };
    }

    // fallback order (keep it deterministic)
    // NOTE: This tries to keep your constraints first, then relaxes gradually.
    const fallbackSteps = [
      ["preference"], // loosen preference
      ["preference", "hungerLevel"], // loosen hunger too
      ["preference", "hungerLevel", "mealTime"], // loosen mealTime too
      ["preference", "hungerLevel", "mealTime", "isVegetarian"], // loosen vegetarian
      ["preference", "hungerLevel", "mealTime", "isVegetarian", "allergenTags"], // loosen avoid
      // last resort: mood+category only (keep mood)
      ["hungerLevel", "preference", "mealTime", "isVegetarian", "allergenTags"],
    ];

    const MAX_PER_CATEGORY = 5;

    // fetch per category so each can reach 5 (if DB has enough)
    const results = {};
    let totalReturned = 0;

    for (const category of CATEGORIES) {
      const q = { ...base, category };

      const items = await findWithFallbackLimited(q, fallbackSteps, MAX_PER_CATEGORY);

      if (items.length > 0) {
        results[category] = items;
        totalReturned += items.length;
      } else {
        results[category] = []; // keep key present so frontend is predictable
      }
    }

    return res.json({
      mood,
      filters: { mood, hungerLevel, preference, mealTime, vegetarianOnly, avoid },
      results,
      count: totalReturned,
    });
  } catch (err) {
    console.error("GET /api/meals error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;