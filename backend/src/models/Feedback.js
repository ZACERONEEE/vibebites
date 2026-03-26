const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    
    // ✅ Added mealId to connect feedback to specific meals
    // It defaults to null for "General" app feedback
    mealId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Meal", 
      default: null 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);