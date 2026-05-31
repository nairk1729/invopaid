function createCheckoutSession({ transactionId }) {
  return {
    provider: "mock",
    providerSessionId: `mock_session_${transactionId}`,
    checkoutUrl: `${process.env.CHECKOUT_BASE_URL}/session/${transactionId}`
  };
}

module.exports = {
  createCheckoutSession
};