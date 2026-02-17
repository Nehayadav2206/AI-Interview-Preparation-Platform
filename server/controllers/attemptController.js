const Attempt = require("../models/Attempt");

exports.getAttempts = async (req, res) => {
  const attempts = await Attempt.find().sort({ createdAt: -1 });
  res.json(attempts);
};
