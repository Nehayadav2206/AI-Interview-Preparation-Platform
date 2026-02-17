const express = require("express");
const router = express.Router();
const { getQuestion } = require("../controllers/questionController");

router.get("/question", getQuestion);

module.exports = router;
