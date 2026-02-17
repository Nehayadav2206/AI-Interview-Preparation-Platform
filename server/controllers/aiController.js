const Attempt = require("../models/Attempt");

exports.evaluateAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body;

    // ---------- EMPTY ANSWER CHECK ----------
    if (!answer || answer.trim().length === 0) {
      return res.json({
        feedback: "No answer provided. Please write something.",
      });
    }

    // ---------- BASIC ANALYSIS ----------
    const wordCount = answer.trim().split(/\s+/).length;

    let score = 0;
    let strengths = [];
    let improvements = [];

    // Length-based scoring
    if (wordCount < 20) {
      score = 4;
      improvements.push("Answer is too short. Try to explain more.");
    } else if (wordCount < 40) {
      score = 6;
      strengths.push("Answer is concise and to the point.");
      improvements.push("You can add more details or examples.");
    } else {
      score = 8;
      strengths.push("Well explained answer.");
      strengths.push("Good clarity and structure.");
    }

    // Keyword analysis
    const keywords = ["project", "skill", "experience", "learn", "development"];
    const foundKeywords = keywords.filter(word =>
      answer.toLowerCase().includes(word)
    );

    if (foundKeywords.length > 0) {
      strengths.push("Relevant keywords used: " + foundKeywords.join(", "));
      score += 1;
    } else {
      improvements.push("Mention your skills, projects, or learning experience.");
    }

    // Score cap
    if (score > 10) score = 10;

    // ---------- FEEDBACK ----------
    const feedback = `
Score: ${score}/10

Strengths:
- ${strengths.length ? strengths.join("\n- ") : "Basic answer provided."}

Areas of Improvement:
- ${improvements.length ? improvements.join("\n- ") : "No major improvements needed."}
`;

    // ---------- SAVE TO DATABASE ----------
    console.log("SAVING ATTEMPT 👉", { question, score });

    await Attempt.create({
      question,
      answer,
      score,
      feedback,
    });

    // ---------- RESPONSE ----------
    res.json({ feedback });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      feedback: "Error evaluating answer.",
    });
  }
};
