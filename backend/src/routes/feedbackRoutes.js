const router = require("express").Router();
const Feedback = require("../models/Feedback");

// POST /api/feedback
router.post("/", async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating) return res.status(400).json({ error: "Rating is required" });

    const saved = await Feedback.create({ rating, comment });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
