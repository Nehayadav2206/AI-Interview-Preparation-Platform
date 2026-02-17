const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const aiRoutes = require("./routes/aiRoutes");
const questionRoutes = require("./routes/questionRoutes");
const attemptRoutes = require("./routes/attemptRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const questionFromResume = require("./routes/questionFromResume");
const app = express();

// -------- DATABASE --------
connectDB();

// -------- MIDDLEWARE --------
app.use(cors());
app.use(express.json());

// -------- ROUTES --------
app.use("/api/ai", aiRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/resume-questions", questionFromResume);

// -------- SERVER --------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
