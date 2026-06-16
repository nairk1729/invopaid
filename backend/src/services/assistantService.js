const db = require("../db/database");

function answerQuestion(query) {
  const normalizedQuery = query.toLowerCase();

  if (normalizedQuery.includes("pending")) {
    return getPendingPaymentsAnswer();
  }

  if (
    normalizedQuery.includes("attention") ||
    normalizedQuery.includes("follow up")
  ) {
    return getAttentionAnswer();
  }

  return {
    answer:
      "I can currently answer questions about payment operations. More capabilities are coming soon."
  };
}

function getPendingPaymentsAnswer() {
  const pendingTransactions = db.prepare(`
    SELECT *
    FROM transactions
    WHERE status = 'pending'
  `).all();

  const totalPendingAmount = pendingTransactions.reduce(
    (sum, txn) => sum + txn.amount,
    0
  );

  if (pendingTransactions.length === 0) {
    return {
      answer: "You do not have any pending payments right now."
    };
  }

  return {
    answer: `You currently have ${pendingTransactions.length} pending payment(s) worth USD ${totalPendingAmount}.`
  };
}

function getAttentionAnswer() {
  const transactions = db.prepare(`
    SELECT * FROM transactions
  `).all();

  const pendingTransactions = transactions.filter(
    (txn) => txn.status === "pending"
  );

  const succeededAmount = transactions
    .filter((txn) => txn.status === "succeeded")
    .reduce((sum, txn) => sum + txn.amount, 0);

  const actions = [];

  if (pendingTransactions.length > 0) {
    actions.push(
      `Follow up on ${pendingTransactions.length} pending payment(s).`
    );
  }

  if (succeededAmount >= 500) {
    actions.push(
      "Review high-value payment activity for reconciliation."
    );
  }

  if (actions.length === 0) {
    actions.push(
      "No immediate action required. Payment operations appear healthy."
    );
  }

  return {
    answer: actions.join(" ")
  };
}

module.exports = {
  answerQuestion
};