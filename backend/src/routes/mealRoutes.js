const express = require("express");
const router = express.Router();
const Meal = require("../models/Meal");

// Helpers
const norm = (v) => String(v || "").trim();
const upperFirst = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

const VALID_HUNGER = new Set(["Light", "Moderate", "Very Hungry"]);
const VALID_PREF = new Set(["Healthy", "Comfort", "Balanced", "Surprise"]);
const VALID_MEALTIME = new Set(["Breakfast", "Lunch", "Dinner", "Any", ""]);

const ALLERGEN_KEYS = new Set(["seafood", "dairy", "nuts", "egg", "soy", "gluten", "chicken"]);

function parseBool(v) {
  if (v === true || v === "true" || v === "1" || v === 1) return true;
  return false;
}

function parseAvoid(v) {
  if (!v) return [];
  // accept "seafood,dairy" or ["seafood","dairy"]
  const list = Array.isArray(v) ? v : String(v).split(",");
  return list
    .map((x) => String(x || "").trim().toLowerCase())
    .filter((x) => x && ALLERGEN_KEYS.has(x));
}

function shuffleWithSeed(arr, seedStr) {
  // deterministic shuffle if seed exists; otherwise random shuffle
  const a = [...arr];
  let seed = 0;
  if (seedStr) {
    const s = String(seedStr);
    for (let i = 0; i < s.length; i++) seed = (seed * 31 + s.charCodeAt(i)) >>> 0;
  } else {
    seed = Math.floor(Math.random() * 2 ** 31) >>> 0;
  }
  function rng() {
    // LCG
    seed = (1103515245 * seed + 12345) >>> 0;
    return seed / 2 ** 32;
  }
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function groupByCategory(meals) {
  const groups = {};
  for (const m of meals) {
    const cat = m.category || "Other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(m);
  }
  return groups;
}

/**
 * GET /api/meals
 * Query params:
 * mood, hungerLevel, preference, mealTime, vegetarianOnly, avoid, seed
 */
router.get("/", async (req, res) => {
  try {
    const mood = norm(req.query.mood);
    const hungerLevel = norm(req.query.hungerLevel);
    const preference = norm(req.query.preference);
    const mealTime = norm(req.query.mealTime);
    const vegetarianOnly = parseBool(req.query.vegetarianOnly);
    const avoid = parseAvoid(req.query.avoid);
    const seed = req.query.seed ? String(req.query.seed) : "";

    if (!mood) {
      return res.status(400).json({ error: "mood is required" });
    }

    // Validate optional filters (don’t hard fail on empty)
    if (hungerLevel && !VALID_HUNGER.has(hungerLevel)) {
      return res.status(400).json({ error: "Invalid hungerLevel" });
    }
    if (preference && !VALID_PREF.has(preference)) {
      return res.status(400).json({ error: "Invalid preference" });
    }
    if (!VALID_MEALTIME.has(mealTime)) {
      return res.status(400).json({ error: "Invalid mealTime" });
    }

    // Build strict query (first attempt)
    const query = { mood };

    if (hungerLevel) query.hungerLevel = hungerLevel;

    // Surprise means: allow any preference
    if (preference && preference !== "Surprise") query.preference = preference;

    // mealTime "Any" means do not filter
    if (mealTime && mealTime !== "Any") query.mealTime = mealTime;

    if (vegetarianOnly) query.isVegetarian = true;

    if (avoid.length > 0) {
      // exclude any meal that contains these allergen tags
      query.allergenTags = { $nin: avoid };
    }

    // 1) strict find
    let meals = await Meal.find(query).lean();

    // If NO results: try fallback steps (to prevent gaps)
    // fallback priority: loosen preference -> loosen hunger -> loosen mealTime -> loosen vegetarian -> loosen avoid
    async function tryFallback(removeKeys = []) {
      const q2 = { ...query };

      for (const k of removeKeys) {
        if (k === "preference") delete q2.preference;
        if (k === "hungerLevel") delete q2.hungerLevel;
        if (k === "mealTime") delete q2.mealTime;
        if (k === "isVegetarian") delete q2.isVegetarian;
        if (k === "allergenTags") delete q2.allergenTags;
      }
      return Meal.find(q2).lean();
    }

    if (!meals || meals.length === 0) meals = await tryFallback(["preference"]);
    if (!meals || meals.length === 0) meals = await tryFallback(["preference", "hungerLevel"]);
    if (!meals || meals.length === 0) meals = await tryFallback(["preference", "hungerLevel", "mealTime"]);
    if (!meals || meals.length === 0) meals = await tryFallback(["preference", "hungerLevel", "mealTime", "isVegetarian"]);
    if (!meals || meals.length === 0) meals = await tryFallback(["preference", "hungerLevel", "mealTime", "isVegetarian", "allergenTags"]);

    // Still none? Return empty grouped structure (frontend can show friendly message)
    if (!meals || meals.length === 0) {
      return res.json({
        mood,
        filters: { mood, hungerLevel, preference, mealTime, vegetarianOnly, avoid },
        results: {},
        count: 0,
      });
    }

    // Shuffle so regenerate can show different ones
    const shuffled = shuffleWithSeed(meals, seed);

    // Limit per category: keep UI clean
    const groups = groupByCategory(shuffled);
    const limitedGroups = {};
    const MAX_PER_CATEGORY = 6;

    for (const [cat, items] of Object.entries(groups)) {
      limitedGroups[cat] = items.slice(0, MAX_PER_CATEGORY);
    }

    return res.json({
      mood,
      filters: { mood, hungerLevel, preference, mealTime, vegetarianOnly, avoid },
      results: limitedGroups,
      count: meals.length,
    });
  } catch (err) {
    console.error("GET /api/meals error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
