import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function OperationsDashboard() {
  const [operationsSummary, setOperationsSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOperationsSummary() {
      try {
        const response = await fetch(
          "https://invopaid.onrender.com/operations/summary"
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Unable to load operations summary");
          return;
        }

        setOperationsSummary(data);
      } catch (err) {
        setError("Unable to connect to backend");
      }
    }

    loadOperationsSummary();
  }, []);

  if (error) {
    return (
      <div style={{ maxWidth: "700px", margin: "80px auto", fontFamily: "Arial" }}>
        <h1>Operations Summary</h1>
        <p style={{ color: "red" }}>{error}</p>
        <Link to="/create">Back to Create Payment Link</Link>
      </div>
    );
  }

  if (!operationsSummary) {
    return (
      <div style={{ maxWidth: "700px", margin: "80px auto", fontFamily: "Arial" }}>
        <h1>Loading operations summary...</h1>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "80px auto", fontFamily: "Arial" }}>
      <h1>Payment Operations Summary</h1>

      <p style={{ marginBottom: "24px" }}>
        AI-assisted operational view of recent payment activity.
      </p>

      <div style={{ padding: "16px", border: "1px solid #ddd", marginBottom: "24px" }}>
        <h2>Summary</h2>
        <p>{operationsSummary.summary}</p>
      </div>

      <div style={{ padding: "16px", border: "1px solid #ddd", marginBottom: "24px" }}>
        <h2>Insights</h2>
        <ul>
          {operationsSummary.insights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      </div>

      <div style={{ padding: "16px", border: "1px solid #ddd", marginBottom: "24px" }}>
        <h2>Recommended Actions</h2>
        <ul>
          {operationsSummary.recommendedActions.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
      </div>

      <Link to="/create">Create Another Payment Link</Link>
    </div>
  );
}

export default OperationsDashboard;