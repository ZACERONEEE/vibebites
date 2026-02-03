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

    // ✅ Vegetarian filter (strict)
    const vegetarianOnly = String(vegetarian).toLowerCase() === "true";
    if (vegetarianOnly) {
      query.isVegetarian = true;
    }

    // ✅ Avoid filter (comma-separated list)
    if (avoid) {
      const avoidList = String(avoid)
        .split(",")
        .map((x) => x.trim().toLowerCase())
        .filter(Boolean);

      if (avoidList.length > 0) {
        // Meals that contain any of the avoid tags will be excluded
        query.allergenTags = { $nin: avoidList };
      }
    }

    // Fetch meals
    const meals = await Meal.find(query).lean();

    // ✅ Group by category (strict)
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

    // ✅ Randomize + prioritize NON-VEG when vegetarianOnly is OFF
    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

    const preferNonVeg = !vegetarianOnly;

    const orderGroup = (arr) => {
      const shuffled = shuffle(arr);

      // If vegetarianOnly is ON, just return shuffled veg meals
      if (!preferNonVeg) return shuffled;

      // If vegetarianOnly is OFF, show non-veg first (more "realistic")
      const nonVeg = shuffled.filter((x) => x.isVegetarian === false);
      const veg = shuffled.filter((x) => x.isVegetarian === true);

      return [...nonVeg, ...veg];
    };

    grouped.fullMeals = orderGroup(grouped.fullMeals);
    grouped.appetizers = orderGroup(grouped.appetizers);
    grouped.desserts = orderGroup(grouped.desserts);
    grouped.drinks = orderGroup(grouped.drinks);
    grouped.snacks = orderGroup(grouped.snacks);

    return res.json(grouped);
  } catch (err) {
    console.error("Meals API error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
