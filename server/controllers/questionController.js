const { hrQuestions, techQuestions } = require("../data/questions");

exports.getQuestion = (req, res) => {
  const { type } = req.query; // hr or tech

  let questions = hrQuestions;

  if (type === "tech") {
    questions = techQuestions;
  }

  const randomIndex = Math.floor(Math.random() * questions.length);
  const question = questions[randomIndex];

  res.json({ question });
};
