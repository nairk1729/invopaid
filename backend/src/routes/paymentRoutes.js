const express = require("express");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

const assistantController = require("../controllers/assistantController");

router.post("/assistant/query", assistantController.answerQuestion);
router.post("/payment-links", paymentController.createPaymentLink);
router.get("/operations/summary", paymentController.getOperationsSummary);
router.get("/payment-links/:id", paymentController.getPaymentLink);
router.post("/checkout-session", paymentController.createCheckoutSession);
router.get("/transactions/:id", paymentController.getTransaction);
router.post("/webhooks/payment", paymentController.handlePaymentWebhook);

module.exports = router;