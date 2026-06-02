import { useState } from "react";

function CreatePaymentLink() {
  const [formData, setFormData] = useState({
    businessName: "",
    serviceTitle: "",
    description: "",
    amount: "",
    currency: "USD"
  });

  const [paymentUrl, setPaymentUrl] = useState("");
  const [paymentLinkId, setPaymentLinkId] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setPaymentUrl("");
    setPaymentLinkId("");

    try {
      const response = await fetch("http://localhost:4000/payment-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setPaymentUrl(data.url);
      setPaymentLinkId(data.paymentLink.id);
    } catch (err) {
      setError("Unable to connect to backend");
    }
  }

  return (
    <div style={{ maxWidth: "500px", margin: "80px auto", fontFamily: "Arial" }}>
      <h1>Create Payment Link</h1>
      <p>Create a hosted payment link for your customer.</p>

      <form onSubmit={handleSubmit}>
        <label>Business Name</label>
        <input
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
        />

        <label>Service Title</label>
        <input
          name="serviceTitle"
          value={formData.serviceTitle}
          onChange={handleChange}
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <label>Amount</label>
        <input
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
        />

        <label>Currency</label>
        <input
          name="currency"
          value={formData.currency}
          onChange={handleChange}
        />

        <button type="submit">Generate Payment Link</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {paymentUrl && (
        <div style={{ marginTop: "24px", padding: "16px", border: "1px solid #ddd" }}>
          <h3>Payment Link Created</h3>

          <p>{paymentUrl}</p>

          <a href={`/pay/${paymentLinkId}`} target="_blank" rel="noreferrer">
            Open Payment Page
          </a>
        </div>
      )}
    </div>
  );
}

export default CreatePaymentLink;