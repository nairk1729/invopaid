import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { trackEvent } from "../lib/analytics";

function CreatePaymentLink() {
  useEffect(() => {
  trackEvent("payment_link_page_visit");
}, []);
 const [searchParams] = useSearchParams();

const [formData, setFormData] = useState({
  businessName: searchParams.get("businessName") || "",
  serviceTitle: searchParams.get("serviceTitle") || "",
  description: "",
  amount: searchParams.get("amount") || "",
  currency: searchParams.get("currency") || "USD"
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
//https://invopaid.onrender.com
    try {
      const response = await fetch("https://invopaid.onrender.com/payment-links", {
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
const fieldStyle = {
  width: "85%",
  margin: "0 auto 20px auto",
  display: "block",
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #555",
  fontSize: "16px"
};
  return (
  <div
    style={{
      maxWidth: "900px",
      margin: "40px auto",
      padding: "24px",
      fontFamily: "Arial"
    }}
  >
    <div
      style={{
        textAlign: "center",
        marginBottom: "48px"
      }}
    >
      <h1
        style={{
          fontSize: "56px",
          fontWeight: "700",
          marginBottom: "12px"
        }}
      >
        Invopaid
      </h1>

      <h2
        style={{
          fontWeight: "normal",
          color: "#ddd",
          marginBottom: "24px"
        }}
      >
        Professional invoices and simple payment links
        <br />
        for freelancers and independent professionals.
      </h2>
    </div>

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "40px",
        flexWrap: "wrap",
        marginBottom: "40px",
        color: "#bbb",
        fontSize: "18px"
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
        <span style={{ color: "#22c55e", fontWeight: "bold" }}>✓</span>
        Professional PDF Invoices
      </span>

      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
        <span style={{ color: "#22c55e", fontWeight: "bold" }}>✓</span>
        Shareable Payment Links
      </span>

      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
        <span style={{ color: "#22c55e", fontWeight: "bold" }}>✓</span>
        Multiple Currencies
      </span>

      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
        <span style={{ color: "#22c55e", fontWeight: "bold" }}>✓</span>
        No Signup Required
      </span>
    </div>

    <div
      style={{
        border: "1px solid #ddd",
        padding: "16px",
        marginBottom: "24px"
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        Explore Invopaid
      </h3>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
          marginTop: "16px"
        }}
      >
        <Link
          to="/create"
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "1px solid #2563eb",
            padding: "10px 18px",
            textDecoration: "none",
            borderRadius: "6px",
            whiteSpace: "nowrap",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35)"
          }}
        >
          Create Payment Link
        </Link>

        <Link
          to="/invoice"
          style={{
            border: "1px solid #666",
            padding: "10px 18px",
            textDecoration: "none",
            borderRadius: "6px",
            whiteSpace: "nowrap",
            color: "#fff",
            backgroundColor: "#222"
          }}
        >
          Create Invoice
        </Link>

        <Link
          to="/operations"
          style={{
            border: "1px solid #666",
            padding: "10px 18px",
            textDecoration: "none",
            borderRadius: "6px",
            whiteSpace: "nowrap",
            color: "#fff",
            backgroundColor: "#222"
          }}
        >
          Operations Summary
        </Link>

        <Link
          to="/assistant"
          style={{
            border: "1px solid #666",
            padding: "10px 18px",
            textDecoration: "none",
            borderRadius: "6px",
            whiteSpace: "nowrap",
            color: "#fff",
            backgroundColor: "#222"
          }}
        >
          Merchant Copilot
        </Link>
      </div>
    </div>

    <div
      style={{
        border: "1px solid #555",
        borderRadius: "10px",
        padding: "40px",
        marginTop: "40px",
        backgroundColor: "#1f2028"
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "12px"
        }}
      >
        Generate a Payment Link
      </h2>

      <p
        style={{
          textAlign: "center",
          color: "#999",
          marginBottom: "36px"
        }}
      >
        Enter a few details and we'll generate a hosted payment page
        you can securely share with your client.
      </p>

      <form onSubmit={handleSubmit}>
        <label
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: "8px",
            marginTop: "16px"
          }}
        >
          Business Name
        </label>

        <input
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          style={fieldStyle}
        />

        <label
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: "8px",
            marginTop: "16px"
          }}
        >
          Service Title
        </label>

        <input
          name="serviceTitle"
          value={formData.serviceTitle}
          onChange={handleChange}
          style={fieldStyle}
        />

        <label
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: "8px",
            marginTop: "16px"
          }}
        >
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          style={fieldStyle}
        />

        <label
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: "8px",
            marginTop: "16px"
          }}
        >
          Amount
        </label>

        <input
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          style={fieldStyle}
        />

        <label
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: "8px",
            marginTop: "16px"
          }}
        >
          Currency
        </label>

        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          style={fieldStyle}
        >
          <option value="USD">🇺🇸 USD - US Dollar</option>
          <option value="INR">🇮🇳 INR - Indian Rupee</option>
          <option value="AED">🇦🇪 AED - UAE Dirham</option>
        </select>

        <button
          type="submit"
          style={{
            width: "85%",
            display: "block",
            margin: "30px auto 0",
            padding: "16px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Create Payment Link →
        </button>
      </form>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {paymentUrl && (
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            border: "1px solid #ddd"
          }}
        >
          <h3>Payment Link Created</h3>

          <p>{paymentUrl}</p>

          <a href={`/pay/${paymentLinkId}`} target="_blank" rel="noreferrer">
            Open Payment Page
          </a>
        </div>
      )}
    </div>
  </div>
);
  
}

export default CreatePaymentLink;