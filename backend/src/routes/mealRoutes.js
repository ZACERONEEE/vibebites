const router = require("express").Router();
const Meal = require("../models/Meal");

/**
 * GET /api/meals
 * Query params:
 * mood=Happy
 * hungerLevel=Light|Moderate|Very Hungry
 * preference=Healthy|Comfort|Balanced|Surprise
 * vegetarian=true|false (optional)
 * mealTime=Breakfast|Lunch|Dinner (optional)
 * avoid=seafood,dairy,nuts,egg (optional; comma-separated)
 *
 * Returns grouped results:
 * { fullMeals: [], appetizers: [], desserts: [], drinks: [], snacks: [] }
 */
router.get("/", async (req, res) => {
  try {
    const { mood, hungerLevel, preference, vegetarian, mealTime } = req.query;

    // avoid list (comma-separated)
    const avoid = req.query.avoid ? req.query.avoid.split(",") : [];

    // required fields
    if (!mood) return res.status(400).json({ error: "mood is required" });
    if (!hungerLevel) return res.status(400).json({ error: "hungerLevel is required" });
    if (!preference) return res.status(400).json({ error: "preference is required" });

    // base query
    const query = { mood, hungerLevel };

    // preference filter (Surprise = no preference filter)
    if (preference !== "Surprise") {
      query.preference = preference; // Healthy / Comfort / Balanced
    }

    // vegetarian filter
    if (vegetarian === "true") {
      query.isVegetarian = true;
    }

    // mealTime filter (if provided)
    if (mealTime) {
      query.mealTime = mealTime; // Breakfast / Lunch / Dinner
    }

    // allergy avoidance filter (exclude meals containing any avoid tags)
    if (avoid.length > 0) {
      query.allergenTags = { $nin: avoid };
    }

    // fetch matching meals
    const meals = await Meal.find(query).lean();

    // shuffle and pick helper (randomness)
    const pickRandom = (arr, n = 3) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy.slice(0, n);
    };

    // grouped by category
    const fullMeals = pickRandom(meals.filter((m) => m.category === "Full Meal"), 3);
    const appetizers = pickRandom(meals.filter((m) => m.category === "Appetizer"), 3);
    const desserts = pickRandom(meals.filter((m) => m.category === "Dessert"), 3);
    const drinks = pickRandom(meals.filter((m) => m.category === "Drink"), 3);
    const snacks = pickRandom(meals.filter((m) => m.category === "Snack"), 3);

    return res.json({ fullMeals, appetizers, desserts, drinks, snacks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
