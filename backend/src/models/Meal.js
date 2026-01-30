const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
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
      enum: ["Healthy", "Comfort", "Balanced"],
    },

    // ✅ Nutrition info (approximate values)
    calories: { type: Number, default: null },
    protein_g: { type: Number, default: null },
    carbs_g: { type: Number, default: null },
    fat_g: { type: Number, default: null },

    // ✅ Vegetarian option
    isVegetarian: { type: Boolean, default: false },
    allergenTags: { type: [String], default: [] },


    // ✅ Meal time option
    mealTime: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner"],
      default: "Lunch",
    },
  },
  { timestamps: true }
);

// Prevent duplicates (updated index)
mealSchema.index(
  { name: 1, mood: 1, category: 1, hungerLevel: 1, preference: 1, mealTime: 1 },
  { unique: true }
);

module.exports = mongoose.model("Meal", mealSchema);
