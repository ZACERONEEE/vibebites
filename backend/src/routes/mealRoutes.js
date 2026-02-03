import express from "express";
import Meal from "../models/Meal.js";

const router = express.Router();

/**
 * GET /api/meals
 * Query params:
 * - mood
 * - hungerLevel
 * - preference
 * - mealTime (optional)
 * - vegetarian=true/false (optional)
 * - avoid=seafood,dairy,nuts,egg,soy,gluten,chicken (optional)
 *
 * Returns grouped results:
 * fullMeals, appetizers, desserts, drinks, snacks
 */

router.get("/", async (req, res) => {
  try {
    const {
      mood,
      hungerLevel,
      preference,
      mealTime,
      vegetarian,
      avoid,
    } = req.query;

    const query = {};

    if (mood) query.mood = mood;
    if (hungerLevel) query.hungerLevel = hungerLevel;
    if (preference) query.preference = preference;
    if (mealTime) query.mealTime = mealTime;

    // vegetarian filter
    if (String(vegetarian).toLowerCase() === "true") {
      query.isVegetarian = true;
    }

    // avoid filter (comma-separated)
    if (avoid) {
      const avoidList = String(avoid)
        .split(",")
        .map((x) => x.trim().toLowerCase())
        .filter(Boolean);

      if (avoidList.length > 0) {
        // allergenTags are stored as lowercase strings in your dataset
        query.allergenTags = { $nin: avoidList };
      }
    }

    const meals = await Meal.find(query).lean();

    // ✅ Group by category
    const grouped = {
      fullMeals: [],
      appetizers: [],
      desserts: [],
      drinks: [],
      snacks: [],
    };

    for (const m of meals) {
      const cat = (m.category || "").toLowerCase();

      if (cat === "full meal") grouped.fullMeals.push(m);
      else if (cat === "appetizer") grouped.appetizers.push(m);
      else if (cat === "dessert") grouped.desserts.push(m);
      else if (cat === "drink") grouped.drinks.push(m);
      else if (cat === "snack") grouped.snacks.push(m);
    }

    // ✅ Randomize each group (so Regenerate works)
    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

    grouped.fullMeals = shuffle(grouped.fullMeals);
    grouped.appetizers = shuffle(grouped.appetizers);
    grouped.desserts = shuffle(grouped.desserts);
    grouped.drinks = shuffle(grouped.drinks);
    grouped.snacks = shuffle(grouped.snacks);

    return res.json(grouped);
  } catch (err) {
    console.error("Meals API error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
