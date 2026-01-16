const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    mood: { type: String, required: true },

    category: {
      type: String,
      required: true,
      enum: ["Full Meal", "Appetizer", "Dessert", "Drink", "Snack"],
    },

    hungerLevel: {
      type: String,
      required: true,
      enum: ["Light", "Moderate", "Very Hungry"],
    },

    preference: {
      type: String,
      required: true,
      enum: ["Healthy", "Comfort", "Balanced", "Surprise"],
    },
  },
  { timestamps: true }
);

// 🚫 Prevent duplicates permanently
mealSchema.index(
  { name: 1, mood: 1, category: 1, hungerLevel: 1, preference: 1 },
  { unique: true }
);

module.exports = mongoose.model("Meal", mealSchema);
