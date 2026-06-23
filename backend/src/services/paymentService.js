//const { paymentLinks, transactions } = require("../store/memoryStore");
const db = require("../db/database");
const { getPaymentProvider } = require("../providers/providerFactory");

function createPaymentLink(data) {
  const paymentLink = {
    id: `plink_${Date.now()}`,
    businessName: data.businessName,
    serviceTitle: data.serviceTitle,
    description: data.description || "",
    amount: data.amount,
    currency: data.currency || "USD",
    status: "active",
    createdAt: new Date().toISOString()
  };

  db.prepare(`
    INSERT INTO payment_links (
      id, business_name, service_title, description, amount, currency, status, created_at
    ) VALUES (
      @id, @businessName, @serviceTitle, @description, @amount, @currency, @status, @createdAt
    )
  `).run(paymentLink);

  return {
    paymentLink,
    url: `${process.env.PAYMENT_BASE_URL}/${paymentLink.id}`
  };
}

function getPaymentLinkById(id) {
  const row = db.prepare(`
    SELECT * FROM payment_links WHERE id = ?
  `).get(id);

  if (!row) return null;

  return {
    id: row.id,
    businessName: row.business_name,
    serviceTitle: row.service_title,
    description: row.description,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    createdAt: row.created_at
  };
}
/*
function createCheckoutSession(paymentLinkId) {
  const paymentLink = getPaymentLinkById(paymentLinkId);

  if (!paymentLink) return null;

  const transaction = {
    id: `txn_${Date.now()}`,
    paymentLinkId: paymentLink.id,
    amount: paymentLink.amount,
    currency: paymentLink.currency,
    status: "pending",
    checkoutUrl: `https://checkout.invopaid.app/session/${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: null
  };

  db.prepare(`
    INSERT INTO transactions (
      id, payment_link_id, amount, currency, status, checkout_url, created_at, updated_at
    ) VALUES (
      @id, @paymentLinkId, @amount, @currency, @status, @checkoutUrl, @createdAt, @updatedAt
    )
  `).run(transaction);

  return transaction;
}
*/

function createCheckoutSession(paymentLinkId) {
  const paymentLink = getPaymentLinkById(paymentLinkId);

  if (!paymentLink) return null;

  const transactionId = `txn_${Date.now()}`;

  const provider = getPaymentProvider();

  console.log("Provider:", provider);
  console.log("createCheckoutSession:", provider.createCheckoutSession);

  const providerSession = provider.createCheckoutSession({
    transactionId,
    paymentLink
  });

  const transaction = {
    id: transactionId,
    paymentLinkId: paymentLink.id,
    amount: paymentLink.amount,
    currency: paymentLink.currency,
    status: "pending",
    checkoutUrl: providerSession.checkoutUrl,
    provider: providerSession.provider,
    providerSessionId: providerSession.providerSessionId,
    createdAt: new Date().toISOString(),
    updatedAt: null
  };

  db.prepare(`
    INSERT INTO transactions (
      id,
      payment_link_id,
      amount,
      currency,
      status,
      checkout_url,
      provider,
      provider_session_id,
      created_at,
      updated_at
    ) VALUES (
      @id,
      @paymentLinkId,
      @amount,
      @currency,
      @status,
      @checkoutUrl,
      @provider,
      @providerSessionId,
      @createdAt,
      @updatedAt
    )
  `).run(transaction);

  return transaction;
}
/*
function getTransactionById(id) {
  const row = db.prepare(`
    SELECT * FROM transactions WHERE id = ?
  `).get(id);

  if (!row) return null;

  return {
    id: row.id,
    paymentLinkId: row.payment_link_id,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    checkoutUrl: row.checkout_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
  */

function getTransactionById(id) {
  const row = db.prepare(`
    SELECT * FROM transactions WHERE id = ?
  `).get(id);

  if (!row) return null;

  return {
    id: row.id,
    paymentLinkId: row.payment_link_id,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    checkoutUrl: row.checkout_url,
    provider: row.provider,
    providerSessionId: row.provider_session_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function updateTransactionStatus(transactionId, status) {
  const transaction = getTransactionById(transactionId);

  if (!transaction) return null;

  const updatedAt = new Date().toISOString();

  db.prepare(`
    UPDATE transactions
    SET status = ?, updated_at = ?
    WHERE id = ?
  `).run(status, updatedAt, transactionId);

  return getTransactionById(transactionId);
}
function getOperationsSummary() {
  const transactions = db.prepare(`
    SELECT * FROM transactions
  `).all();

  const totalTransactions = transactions.length;

  const succeededTransactions = transactions.filter(
    (txn) => txn.status === "succeeded"
  );

  const pendingTransactions = transactions.filter(
    (txn) => txn.status === "pending"
  );

  const totalSucceededAmount = succeededTransactions.reduce(
    (sum, txn) => sum + txn.amount,
    0
  );

  const insights = [];
  const recommendedActions = [];

  if (totalTransactions === 0) {
    insights.push("No payment activity has been recorded yet.");
    recommendedActions.push("Create and share a payment link to start collecting payments.");
  }

  if (succeededTransactions.length > 0) {
    insights.push(
      `${succeededTransactions.length} transaction(s) have succeeded with total volume of USD ${totalSucceededAmount}.`
    );
  }

  if (pendingTransactions.length > 0) {
    insights.push(`${pendingTransactions.length} transaction(s) are still pending.`);
    recommendedActions.push("Follow up on pending transactions that have not completed.");
  }

  if (totalSucceededAmount >= 50000) {
    insights.push("Succeeded payment volume is above USD 500.");
    recommendedActions.push("Review high-value payment activity for reconciliation.");
  }
  if (recommendedActions.length === 0) {
  recommendedActions.push(
    "No immediate action required. Payment operations appear healthy."
  );
}

  return {
    summary: `You have ${totalTransactions} transaction(s): ${succeededTransactions.length} succeeded and ${pendingTransactions.length} pending.`,
    insights,
    recommendedActions
  };
}
module.exports = {
  createPaymentLink,
  getPaymentLinkById,
  createCheckoutSession,
  getTransactionById,
  updateTransactionStatus,
  getOperationsSummary
};

