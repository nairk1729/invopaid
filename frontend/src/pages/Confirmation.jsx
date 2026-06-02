import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Confirmation() {
  const { transactionId } = useParams();

  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTransaction() {
      try {
        const response = await fetch(
          `http://localhost:4000/transactions/${transactionId}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Transaction not found");
          return;
        }

        setTransaction(data);
      } catch (err) {
        setError("Unable to load transaction");
      }
    }

    loadTransaction();
  }, [transactionId]);

  if (error) {
    return (
      <div style={{ maxWidth: "500px", margin: "80px auto", fontFamily: "Arial" }}>
        <h1>Payment Confirmation</h1>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div style={{ maxWidth: "500px", margin: "80px auto", fontFamily: "Arial" }}>
        <h1>Loading confirmation...</h1>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "500px", margin: "80px auto", fontFamily: "Arial" }}>
      <h1>Payment Successful</h1>

<p>Thank you for your payment.</p>
<p>Your transaction has been successfully processed.</p>

<Link to="/create">
  Create Another Payment Link
</Link>

      <div style={{ padding: "16px", border: "1px solid #ddd" }}>
        <p>Status: {transaction.status}</p>
        <p>Amount: {transaction.currency} {transaction.amount}</p>
        <p>Transaction ID: {transaction.id}</p>
        <p>Provider: {transaction.provider}</p>
      </div>
    </div>
  );
}

export default Confirmation;