import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Checkout() {
  const { paymentLinkId } = useParams();
  const navigate = useNavigate();

  const [paymentLink, setPaymentLink] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPaymentLink() {
      try {
        const response = await fetch(
          `http://localhost:4000/payment-links/${paymentLinkId}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Payment link not found");
          return;
        }

        setPaymentLink(data);
      } catch (err) {
        setError("Unable to load payment link");
      }
    }

    loadPaymentLink();
  }, [paymentLinkId]);

  async function handlePayNow() {
    setError("");

    try {
      const checkoutResponse = await fetch("http://localhost:4000/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          paymentLinkId
        })
      });

      const checkoutData = await checkoutResponse.json();

      if (!checkoutResponse.ok) {
        setError(checkoutData.error || "Unable to create checkout session");
        return;
      }

      const transactionId = checkoutData.transaction.id;

      const webhookResponse = await fetch("http://localhost:4000/webhooks/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          transactionId,
          status: "succeeded"
        })
      });

      const webhookData = await webhookResponse.json();

      if (!webhookResponse.ok) {
        setError(webhookData.error || "Unable to complete payment");
        return;
      }

      navigate(`/confirmation/${transactionId}`);
    } catch (err) {
      setError("Payment failed. Please try again.");
    }
  }

  if (error) {
    return (
      <div style={{ maxWidth: "500px", margin: "80px auto", fontFamily: "Arial" }}>
        <h1>Checkout</h1>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!paymentLink) {
    return (
      <div style={{ maxWidth: "500px", margin: "80px auto", fontFamily: "Arial" }}>
        <h1>Loading checkout...</h1>
      </div>
    );
  }

  return (
    //<div style={{ maxWidth: "500px", margin: "80px auto", fontFamily: "Arial" }}>
    <div
  style={{
    maxWidth: "600px",
    margin: "80px auto",
    fontFamily: "Arial",
    padding: "24px"
  }}
>
     <h1 style={{ fontSize: "40px", lineHeight: "1.1", marginBottom: "32px" }}>
  Complete Your Payment
</h1>

      <div style={{ padding: "16px", border: "1px solid #ddd", marginBottom: "24px" }}>
        <h2>{paymentLink.businessName}</h2>
        <h3>{paymentLink.serviceTitle}</h3>
        <p>{paymentLink.description}</p>

        <h2>
          {paymentLink.currency} {paymentLink.amount}
        </h2>
      </div>

      <button onClick={handlePayNow}>
        Pay {paymentLink.currency} {paymentLink.amount}
      </button>
    </div>
  );
}

export default Checkout;