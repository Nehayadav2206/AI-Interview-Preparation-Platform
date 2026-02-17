const express = require("express");
const router = express.Router();

router.post("/generate", (req, res) => {
  const resumeText = req.body.resumeText.toLowerCase();

  const questions = [];

  if (resumeText.includes("react")) {
    questions.push("Explain React lifecycle methods.");
  }

  if (resumeText.includes("node")) {
    questions.push("What is the event loop in Node.js?");
  }

  if (resumeText.includes("mongodb")) {
    questions.push("What is indexing in MongoDB?");
  }

  if (resumeText.includes("javascript")) {
    questions.push("Explain closures in JavaScript.");
  }

  if (questions.length === 0) {
    questions.push("Tell me about your most challenging project.");
  }

  res.json({ questions });
});

module.exports = router;
