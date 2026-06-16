const assistantService = require("../services/assistantService");

function answerQuestion(req, res) {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({
      error: "query is required"
    });
  }

  const response = assistantService.answerQuestion(query);

  res.json(response);
}

module.exports = {
  answerQuestion
};