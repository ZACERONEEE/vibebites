const router = require("express").Router();
const Mood = require("../models/Mood");

// GET /api/moods
router.get("/", async (req, res) => {
  try {
    const moods = await Mood.find().sort({ name: 1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
