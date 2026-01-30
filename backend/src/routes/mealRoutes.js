const router = require("express").Router();
const Meal = require("../models/Meal");

/**
 * GET /api/meals
 * Query params:
 * mood=Happy
 * hungerLevel=Light|Moderate|Very Hungry
 * preference=Healthy|Comfort|Balanced|Surprise
 * vegetarian=true|false (optional)
 * mealTime=Breakfast|Lunch|Dinner (optional; Step 4)
 *
 * Returns grouped results:
 * { fullMeals: [], appetizers: [], desserts: [], drinks: [], snacks: [] }
 */
router.get("/", async (req, res) => {
  try {
    const { mood, hungerLevel, preference, vegetarian, mealTime } = req.query;

    if (!mood) return res.status(400).json({ error: "mood is required" });
    if (!hungerLevel) return res.status(400).json({ error: "hungerLevel is required" });
    if (!preference) return res.status(400).json({ error: "preference is required" });

    const query = {
      mood,
      hungerLevel,
    };

    // Surprise means "do not filter preference"
    if (preference !== "Surprise") query.preference = preference;

    // vegetarian filter
    if (vegetarian === "true") query.isVegetarian = true;

    // mealTime filter (we will add UI in Step 4)
    if (mealTime) query.mealTime = mealTime;

    // find matches
    const meals = await Meal.find(query).lean();

    // helper to shuffle and pick up to N items
    const pickRandom = (arr, n = 3) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy.slice(0, n);
    };

    // group by category
    const fullMeals = pickRandom(meals.filter((m) => m.category === "Full Meal"), 3);
    const appetizers = pickRandom(meals.filter((m) => m.category === "Appetizer"), 3);
    const desserts = pickRandom(meals.filter((m) => m.category === "Dessert"), 3);
    const drinks = pickRandom(meals.filter((m) => m.category === "Drink"), 3);
    const snacks = pickRandom(meals.filter((m) => m.category === "Snack"), 3);

    return res.json({ fullMeals, appetizers, desserts, drinks, snacks });
  } catch (err) {
    return res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
