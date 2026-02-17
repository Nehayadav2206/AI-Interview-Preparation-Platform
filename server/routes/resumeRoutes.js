const express = require("express");
const router = express.Router();
const { analyzeResume } = require("../controllers/resumeController");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post("/analyze", upload.single("resume"), analyzeResume);

module.exports = router;
