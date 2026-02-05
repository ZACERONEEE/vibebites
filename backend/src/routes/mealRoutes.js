const express = require("express");
const router = express.Router();
const Meal = require("../models/Meal");

const VALID_HUNGER = new Set(["Light", "Moderate", "Very Hungry"]);
const VALID_PREF = new Set(["Healthy", "Comfort", "Balanced", "Surprise"]);
const VALID_MEALTIME = new Set(["Breakfast", "Lunch", "Dinner", "Any", ""]);

const ALLERGEN_KEYS = new Set(["seafood", "dairy", "nuts", "egg", "soy", "gluten", "chicken"]);

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

function groupAndLimitByCategory(meals, maxPerCategory) {
  const out = {};
  for (const m of meals) {
    const cat = m.category || "Other";
    if (!out[cat]) out[cat] = [];
    if (out[cat].length < maxPerCategory) out[cat].push(m);
  }
  return out;
}

// Deterministic fallback chain to prevent gaps
async function findWithFallback(baseQuery, fallbackSteps) {
  // 1) strict
  let meals = await Meal.find(baseQuery).sort({ name: 1, _id: 1 }).lean();
  if (meals.length > 0) return meals;

  // 2) fallback steps in order
  for (const removeKeys of fallbackSteps) {
    const q = { ...baseQuery };
    for (const k of removeKeys) delete q[k];

    meals = await Meal.find(q).sort({ name: 1, _id: 1 }).lean();
    if (meals.length > 0) return meals;
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

    // Build strict query
    const query = { mood };

    if (hungerLevel) query.hungerLevel = hungerLevel;

    // Surprise means "no preference filter"
    if (preference && preference !== "Surprise") query.preference = preference;

    // mealTime "Any" means no filter
    if (mealTime && mealTime !== "Any") query.mealTime = mealTime;

    if (vegetarianOnly) query.isVegetarian = true;

    if (avoid.length > 0) {
      query.allergenTags = { $nin: avoid };
    }

    // ✅ Deterministic fallback chain (no gaps)
    const meals = await findWithFallback(query, [
      // loosen preference first
      ["preference"],
      // loosen hunger
      ["preference", "hungerLevel"],
      // loosen mealTime
      ["preference", "hungerLevel", "mealTime"],
      // loosen vegetarian
      ["preference", "hungerLevel", "mealTime", "isVegetarian"],
      // loosen avoid
      ["preference", "hungerLevel", "mealTime", "isVegetarian", "allergenTags"],
      // last resort: mood only
      ["hungerLevel", "preference", "mealTime", "isVegetarian", "allergenTags"],
    ]);

    if (meals.length === 0) {
      return res.json({
        mood,
        filters: { mood, hungerLevel, preference, mealTime, vegetarianOnly, avoid },
        results: {},
        count: 0,
      });
    }

    // ✅ Stable and limited results
    const MAX_PER_CATEGORY = 2; // advisor wants fewer results; set 1 or 2
    const results = groupAndLimitByCategory(meals, MAX_PER_CATEGORY);

    return res.json({
      mood,
      filters: { mood, hungerLevel, preference, mealTime, vegetarianOnly, avoid },
      results,
      count: meals.length,
    });
  } catch (err) {
    console.error("GET /api/meals error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
