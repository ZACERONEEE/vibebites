const router = require("express").Router();
const Meal = require("../models/Meal");

// GET /api/meals/grouped?mood=Happy&hungerLevel=Light&preference=Healthy
router.get("/grouped", async (req, res) => {
  try {
    const { mood, hungerLevel, preference } = req.query;

    if (!mood) return res.status(400).json({ error: "Mood is required" });
    if (!hungerLevel) return res.status(400).json({ error: "hungerLevel is required" });
    if (!preference) return res.status(400).json({ error: "preference is required" });

    // Base filter (always apply mood + hunger)
    const query = { mood, hungerLevel };

    // If preference is Surprise, do NOT filter by preference
    // Otherwise filter normally
    if (preference !== "Surprise") {
      query.preference = preference; // Healthy / Comfort / Balanced
    }

    // Get all matching meals
    const meals = await Meal.find(query);

    // Group by category
    const grouped = {
      "Full Meal": [],
      Appetizer: [],
      Dessert: [],
      Drink: [],
      Snack: [],
    };

    for (const m of meals) {
      if (!grouped[m.category]) grouped[m.category] = [];
      grouped[m.category].push(m);
    }

    // Random pick helper (returns up to N random items)
    const pickRandom = (arr, count) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy.slice(0, count);
    };

    // Choose how many per category:
    const result = {
      "Full Meal": pickRandom(grouped["Full Meal"], 2),
      Appetizer: pickRandom(grouped["Appetizer"], 2),
      Dessert: pickRandom(grouped["Dessert"], 2),
      Drink: pickRandom(grouped["Drink"], 2),
      Snack: pickRandom(grouped["Snack"], 2),
    };

    return res.json({
      mood,
      hungerLevel,
      preference,
      grouped: result,
      note:
        preference === "Surprise"
          ? "Surprise mode: mixed preferences"
          : "Filtered mode: preference applied",
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
