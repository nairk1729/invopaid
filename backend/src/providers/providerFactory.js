const mockProvider = require("./mockProvider");

function getPaymentProvider() {
  const provider = process.env.PAYMENT_PROVIDER || "mock";

  if (provider === "mock") {
    return mockProvider;
  }

  throw new Error(`Unsupported payment provider: ${provider}`);
}

module.exports = {
  getPaymentProvider
};