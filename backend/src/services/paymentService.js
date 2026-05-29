//const { paymentLinks, transactions } = require("../store/memoryStore");
const db = require("../db/database");

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
    url: `https://invopaid.app/pay/${paymentLink.id}`
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

module.exports = {
  createPaymentLink,
  getPaymentLinkById,
  createCheckoutSession,
  getTransactionById,
  updateTransactionStatus
};

/*function createPaymentLink(data) {
  const paymentLink = {
    id: `plink_${Date.now()}`,
    businessName: data.businessName,
    serviceTitle: data.serviceTitle,
    description: data.description,
    amount: data.amount,
    currency: data.currency || "USD",
    status: "active",
    createdAt: new Date().toISOString()
  };

  paymentLinks.push(paymentLink);

  return {
    paymentLink,
    url: `https://invopaid.app/pay/${paymentLink.id}`
  };
}

function getPaymentLinkById(id) {
  return paymentLinks.find((link) => link.id === id);
}

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
    createdAt: new Date().toISOString()
  };

  transactions.push(transaction);

  return transaction;
}

function getTransactionById(id) {
  return transactions.find((txn) => txn.id === id);
}

function updateTransactionStatus(transactionId, status) {
  const transaction = getTransactionById(transactionId);

  if (!transaction) return null;

  transaction.status = status;
  transaction.updatedAt = new Date().toISOString();

  return transaction;
}

module.exports = {
  createPaymentLink,
  getPaymentLinkById,
  createCheckoutSession,
  getTransactionById,
  updateTransactionStatus
};*/