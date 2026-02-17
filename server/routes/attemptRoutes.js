const express = require("express");
const router = express.Router();
const { getAttempts } = require("../controllers/attemptController");

router.get("/", getAttempts);

module.exports = router;
