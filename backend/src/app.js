const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const moodRoutes = require("./routes/moodRoutes");
const mealRoutes = require("./routes/mealRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/moods", moodRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/feedback", feedbackRoutes);

app.get("/", (req, res) => res.send("VibeBites Backend is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
