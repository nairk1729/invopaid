import { useState } from "react";
import { Link } from "react-router-dom";

function Assistant() {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askQuestion(question) {
    setLoading(true);

    try {
      const response = await fetch(
        "https://invopaid.onrender.com/assistant/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query: question
          })
        }
      );

      const data = await response.json();

      setAnswer(data.answer);
    } catch (err) {
      setAnswer("Unable to contact assistant.");
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "80px auto",
        color: "white",
        textAlign: "center"
      }}
    >
      <h1>Merchant Copilot</h1>

      <p>Ask Invopaid about your payment operations.</p>

      <div
        style={{
          border: "1px solid gray",
          padding: "20px",
          marginTop: "30px"
        }}
      >
        <h2>Common Questions</h2>

      <button
  onClick={() =>
    askQuestion("How many payments are still pending?")
  }
>
  How many payments are still pending?
</button>

<button
  onClick={() =>
    askQuestion("How much revenue did I collect today?")
  }
>
  How much revenue did I collect today?
</button>

<button
  onClick={() =>
    askQuestion("How much revenue did I collect this month?")
  }
>
  How much revenue did I collect this month?
</button>

<button
  onClick={() =>
    askQuestion("What was my largest payment this month?")
  }
>
  What was my largest payment this month?
</button>

<button
  onClick={() =>
    askQuestion("What needs my attention today?")
  }
>
  What needs my attention today?
</button>
      </div>

      {loading && (
        <p style={{ marginTop: "20px" }}>
          Thinking...
        </p>
      )}

      {answer && (
        <div
          style={{
            border: "1px solid gray",
            marginTop: "30px",
            padding: "20px"
          }}
        >
          <h2>Answer</h2>
          <p>{answer}</p>
        </div>
      )}

      <br />

      <Link to="/create">
        Back to Payment Links
      </Link>
    </div>
  );
}

export default Assistant;