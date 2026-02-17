const fs = require("fs");
const pdfParse = require("pdf-parse");

exports.analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text.toLowerCase();

    const jobDescription = req.body.jobDescription?.toLowerCase() || "";

    let score = 5;
    let strengths = [];
    let improvements = [];

    // Basic Resume Checks
    if (resumeText.includes("project")) {
      strengths.push("Projects section included");
      score++;
    } else {
      improvements.push("Add a Projects section");
    }

    if (resumeText.includes("skill")) {
      strengths.push("Skills section mentioned");
      score++;
    } else {
      improvements.push("Mention technical skills clearly");
    }

    if (resumeText.includes("%") || resumeText.includes("improved")) {
      strengths.push("Quantifiable achievements found");
      score++;
    } else {
      improvements.push("Add measurable achievements");
    }

    if (score > 10) score = 10;

    // -------- JD Matching Logic --------
    const resumeWords = resumeText.split(/\W+/);
    const jdWords = jobDescription.split(/\W+/);

    const resumeSet = new Set(resumeWords);
    const jdSet = new Set(jdWords);

    const commonSkills = [...jdSet].filter(word => resumeSet.has(word));
    const matchPercentage = jobDescription
      ? Math.min(Math.round((commonSkills.length / jdSet.size) * 100), 100)
      : 0;

    const missingSkills = [...jdSet].filter(word => !resumeSet.has(word)).slice(0, 10);

    fs.unlinkSync(req.file.path);

    res.json({
      score,
      strengths,
      improvements,
      matchPercentage,
      missingSkills,
      resumeText
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Resume analysis failed." });
  }
};
