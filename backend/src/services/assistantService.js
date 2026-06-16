const db = require("../db/database");

function answerQuestion(query) {
  const normalizedQuery = query.toLowerCase();

  if (
  normalizedQuery.includes("revenue") &&
  normalizedQuery.includes("today")
) {
  return getRevenueTodayAnswer();
}

if (
  normalizedQuery.includes("largest") ||
  normalizedQuery.includes("biggest")
) {
  return getLargestPaymentAnswer();
}

if (
  normalizedQuery.includes("revenue") &&
  normalizedQuery.includes("month")
) {
  return getRevenueThisMonthAnswer();
}

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
function getRevenueTodayAnswer() {
  const transactions = db.prepare(`
    SELECT *
    FROM transactions
    WHERE status = 'succeeded'
  `).all();

  const today = new Date().toISOString().slice(0, 10);

  const todaysTransactions = transactions.filter((txn) =>
  txn.created_at && txn.created_at.slice(0, 10) === today
  );

  const totalRevenue = todaysTransactions.reduce(
    (sum, txn) => sum + txn.amount,
    0
  );

  return {
    answer: `You collected USD ${totalRevenue} today from ${todaysTransactions.length} succeeded payment(s).`
  };
}

function getRevenueThisMonthAnswer() {
  const transactions = db.prepare(`
    SELECT *
    FROM transactions
    WHERE status = 'succeeded'
  `).all();

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthlyTransactions = transactions.filter((txn) =>
  txn.created_at && txn.created_at.slice(0, 7) === currentMonth
  );

  const totalRevenue = monthlyTransactions.reduce(
    (sum, txn) => sum + txn.amount,
    0
  );

  return {
    answer: `You collected USD ${totalRevenue} this month from ${monthlyTransactions.length} succeeded payment(s).`
  };
}

function getLargestPaymentAnswer() {
  const transactions = db.prepare(`
    SELECT *
    FROM transactions
    WHERE status = 'succeeded'
  `).all();

  if (transactions.length === 0) {
    return {
      answer: "No successful payments have been recorded yet."
    };
  }

  const largestPayment = transactions.reduce(
    (largest, txn) =>
      txn.amount > largest.amount ? txn : largest,
    transactions[0]
  );

  return {
answer: `Your largest successful payment this month was USD ${largestPayment.amount}.`  };
}

module.exports = {
  answerQuestion
};