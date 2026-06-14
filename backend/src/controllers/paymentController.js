const paymentService = require("../services/paymentService");

function createPaymentLink(req, res) {
  const { businessName, serviceTitle, amount } = req.body;

  if (!businessName || !serviceTitle || amount === undefined) {
    return res.status(400).json({
      error: "Missing required fields",
      requiredFields: ["businessName", "serviceTitle", "amount"]
    });
  }

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({
      error: "Amount must be a number greater than 0"
    });
  }

  const result = paymentService.createPaymentLink(req.body);
  res.status(201).json(result);
}

function getPaymentLink(req, res) {
  const paymentLink = paymentService.getPaymentLinkById(req.params.id);

  if (!paymentLink) {
    return res.status(404).json({ error: "Payment link not found" });
  }

  res.json(paymentLink);
}

function createCheckoutSession(req, res) {
  const { paymentLinkId } = req.body;

  if (!paymentLinkId) {
    return res.status(400).json({
      error: "paymentLinkId is required"
    });
  }

  const transaction = paymentService.createCheckoutSession(paymentLinkId);

  if (!transaction) {
    return res.status(404).json({ error: "Payment link not found" });
  }

  res.status(201).json({ transaction });
}

function getTransaction(req, res) {
  const transaction = paymentService.getTransactionById(req.params.id);

  if (!transaction) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  res.json(transaction);
}

function handlePaymentWebhook(req, res) {
  const { transactionId, status } = req.body;

  if (!transactionId || !status) {
    return res.status(400).json({
      error: "transactionId and status are required"
    });
  }

  const transaction = paymentService.updateTransactionStatus(transactionId, status);

  if (!transaction) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  res.json({
    message: "Transaction updated successfully",
    transaction
  });
}
function getOperationsSummary(req, res) {
  const summary = paymentService.getOperationsSummary();

  res.json(summary);
}

module.exports = {
  createPaymentLink,
  getPaymentLink,
  createCheckoutSession,
  getTransaction,
  handlePaymentWebhook,
  getOperationsSummary
};