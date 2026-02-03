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
 *
 * Important: uses $sample so Regenerate always changes when possible
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
      limit,
    } = req.query;

    const vegetarianOnly = String(vegetarian).toLowerCase() === "true";
    const preferNonVeg = !vegetarianOnly;

    const avoidList = avoid
      ? String(avoid)
          .split(",")
          .map((x) => x.trim().toLowerCase())
          .filter(Boolean)
      : [];

    const baseMatch = {};
    if (mood) baseMatch.mood = mood;
    if (hungerLevel) baseMatch.hungerLevel = hungerLevel;
    if (preference) baseMatch.preference = preference;
    if (mealTime) baseMatch.mealTime = mealTime;

    if (vegetarianOnly) baseMatch.isVegetarian = true;

    if (avoidList.length > 0) {
      baseMatch.allergenTags = { $nin: avoidList };
    }

    const perGroup = Math.max(3, Math.min(Number(limit) || 6, 12)); // default 6 per category

    // Pull random samples per category from MongoDB
    const [result] = await Meal.aggregate([
      { $match: baseMatch },
      {
        $facet: {
          fullMeals: [
            { $match: { category: "Full Meal" } },
            { $sample: { size: perGroup * 3 } }, // oversample
          ],
          appetizers: [
            { $match: { category: "Appetizer" } },
            { $sample: { size: perGroup * 3 } },
          ],
          desserts: [
            { $match: { category: "Dessert" } },
            { $sample: { size: perGroup * 3 } },
          ],
          drinks: [
            { $match: { category: "Drink" } },
            { $sample: { size: perGroup * 3 } },
          ],
          snacks: [
            { $match: { category: "Snack" } },
            { $sample: { size: perGroup * 3 } },
          ],
        },
      },
    ]);

    const orderGroup = (arr) => {
      if (!arr) return [];
      // If vegetarianOnly is OFF, show non-veg first (more realistic)
      if (preferNonVeg) {
        const nonVeg = arr.filter((m) => m.isVegetarian === false);
        const veg = arr.filter((m) => m.isVegetarian === true);
        return [...nonVeg, ...veg].slice(0, perGroup);
      }
      return arr.slice(0, perGroup);
    };

    const grouped = {
      fullMeals: orderGroup(result?.fullMeals),
      appetizers: orderGroup(result?.appetizers),
      desserts: orderGroup(result?.desserts),
      drinks: orderGroup(result?.drinks),
      snacks: orderGroup(result?.snacks),
    };

    return res.json(grouped);
  } catch (err) {
    console.error("Meals API error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
