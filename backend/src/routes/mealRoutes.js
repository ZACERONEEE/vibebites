const router = require("express").Router();
const Meal = require("../models/Meal");

/**
 * GET /api/meals/grouped
 * Query params:
 * mood=Happy
 * hungerLevel=Light|Moderate|Very Hungry
 * preference=Healthy|Comfort|Balanced|Surprise
 *
 * Returns randomized results grouped per category.
 */
router.get("/grouped", async (req, res) => {
  try {
    const { mood, hungerLevel, preference } = req.query;

    if (!mood) return res.status(400).json({ error: "mood is required" });
    if (!hungerLevel) return res.status(400).json({ error: "hungerLevel is required" });
    if (!preference) return res.status(400).json({ error: "preference is required" });

    // Match filters:
    // Surprise => do not filter preference (mix all)
    const match = {
      mood,
      hungerLevel,
      ...(preference === "Surprise" ? {} : { preference }),
    };

    // How many random items per category
    const perCategory = 3;

    // Randomize inside MongoDB using aggregation
    const [result] = await Meal.aggregate([
      { $match: match },
      {
        $facet: {
          "Full Meal": [
            { $match: { category: "Full Meal" } },
            { $sample: { size: perCategory } }
          ],
          "Appetizer": [
            { $match: { category: "Appetizer" } },
            { $sample: { size: perCategory } }
          ],
          "Dessert": [
            { $match: { category: "Dessert" } },
            { $sample: { size: perCategory } }
          ],
          "Drink": [
            { $match: { category: "Drink" } },
            { $sample: { size: perCategory } }
          ],
          "Snack": [
            { $match: { category: "Snack" } },
            { $sample: { size: perCategory } }
          ]
        }
      }
    ]);

    const grouped = result || {
      "Full Meal": [],
      "Appetizer": [],
      "Dessert": [],
      "Drink": [],
      "Snack": []
    };

    return res.json({
      mood,
      hungerLevel,
      preference,
      grouped
    });
  } catch (err) {
    return res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
