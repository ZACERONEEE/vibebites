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
const MAX_PER_CATEGORY = 5;

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

/**
 * Deterministically fill up to `limit` by:
 * 1) strict query
 * 2) then progressively relaxed queries (fallback steps)
 * Avoid duplicates by _id.
 */
async function findWithFallbackFill(baseQuery, fallbackSteps, limit) {
  const picked = [];
  const pickedIds = new Set();

  async function addFromQuery(q) {
    if (picked.length >= limit) return;

    const remaining = limit - picked.length;

    const rows = await Meal.find(q)
      .sort({ name: 1, _id: 1 }) // stable order
      .limit(remaining)
      .lean();

    for (const r of rows) {
      const id = String(r._id);
      if (!pickedIds.has(id)) {
        pickedIds.add(id);
        picked.push(r);
        if (picked.length >= limit) break;
      }
    }
  }

  // 1) strict
  await addFromQuery(baseQuery);

  // 2) fallbacks, top-up until limit
  for (const removeKeys of fallbackSteps) {
    if (picked.length >= limit) break;

    const q = { ...baseQuery };
    for (const k of removeKeys) delete q[k];

    await addFromQuery(q);
  }

  return picked;
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

    if (!mood) return res.status(400).json({ error: "mood is required" });

    if (hungerLevel && !VALID_HUNGER.has(hungerLevel)) {
      return res.status(400).json({ error: "Invalid hungerLevel" });
    }
    if (preference && !VALID_PREF.has(preference)) {
      return res.status(400).json({ error: "Invalid preference" });
    }
    if (!VALID_MEALTIME.has(mealTime)) {
      return res.status(400).json({ error: "Invalid mealTime" });
    }

    // base filters
    const base = { mood };

    if (hungerLevel) base.hungerLevel = hungerLevel;

    // Surprise = no preference filter
    if (preference && preference !== "Surprise") base.preference = preference;

    // Any = no mealTime filter
    if (mealTime && mealTime !== "Any") base.mealTime = mealTime;

    if (vegetarianOnly) base.isVegetarian = true;

    if (avoid.length > 0) base.allergenTags = { $nin: avoid };

    // fallback order (relax gradually)
    const fallbackSteps = [
      ["preference"], // relax preference
      ["preference", "hungerLevel"], // relax hunger too
      ["preference", "hungerLevel", "mealTime"], // relax mealtime too
      ["preference", "hungerLevel", "mealTime", "isVegetarian"], // relax vegetarian
      ["preference", "hungerLevel", "mealTime", "isVegetarian", "allergenTags"], // relax avoid
      // last resort: mood + category only
      ["hungerLevel", "preference", "mealTime", "isVegetarian", "allergenTags"],
    ];

    const results = {};
    let totalReturned = 0;

    for (const category of CATEGORIES) {
      const q = { ...base, category };
      const items = await findWithFallbackFill(q, fallbackSteps, MAX_PER_CATEGORY);
      results[category] = items;
      totalReturned += items.length;
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