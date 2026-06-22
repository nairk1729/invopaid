import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

function Admin() {
  const [stats, setStats] = useState({
  uniqueVisitors: 0,
  invoicesGenerated: 0,
  currencies: {},

  todayVisitors: 0,
  todayInvoices: 0,

  weekVisitors: 0,
  weekInvoices: 0
});

  useEffect(() => {
    async function loadStats() {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("*");

      if (error) {
        console.error("Admin analytics error:", error);
        return;
      }

      const visitorIds = new Set(data.map((event) => event.visitor_id));
      const now = new Date();

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(now.getDate() - 7);

const todayEvents = data.filter(
  (event) => new Date(event.created_at) >= startOfToday
);

const todayVisitors = new Set(
  todayEvents.map((event) => event.visitor_id)
).size;

const todayInvoices = todayEvents.filter(
  (event) => event.event_type === "invoice_pdf_download"
).length;

const weekEvents = data.filter(
  (event) => new Date(event.created_at) >= sevenDaysAgo
);

const weekVisitors = new Set(
  weekEvents.map((event) => event.visitor_id)
).size;

const weekInvoices = weekEvents.filter(
  (event) => event.event_type === "invoice_pdf_download"
).length;

      const invoiceDownloads = data.filter(
        (event) => event.event_type === "invoice_pdf_download"
      );

      const currencyCounts = {};

      invoiceDownloads.forEach((event) => {
        if (event.currency) {
          currencyCounts[event.currency] =
            (currencyCounts[event.currency] || 0) + 1;
        }
      });

      

     setStats({
  uniqueVisitors: visitorIds.size,
  invoicesGenerated: invoiceDownloads.length,
  currencies: currencyCounts,

  todayVisitors,
  todayInvoices,

  weekVisitors,
  weekInvoices
});
    }

    loadStats();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "80px auto", color: "white" }}>
      <h1>Invopaid Admin Dashboard</h1>

      <div style={{ border: "1px solid gray", padding: "20px", marginTop: "24px" }}>
        <h2>Unique Visitors</h2>
        <p style={{ fontSize: "32px" }}>{stats.uniqueVisitors}</p>
      </div>

      <div style={{ border: "1px solid gray", padding: "20px", marginTop: "24px" }}>
        <h2>Invoices Generated</h2>
        <p style={{ fontSize: "32px" }}>{stats.invoicesGenerated}</p>
      </div>
      <div
  style={{
    border: "1px solid gray",
    padding: "20px",
    marginTop: "24px"
  }}
>
  <h2>Today</h2>

  <p>
    Visitors: {stats.todayVisitors}
  </p>

  <p>
    Invoices: {stats.todayInvoices}
  </p>
</div>

<div
  style={{
    border: "1px solid gray",
    padding: "20px",
    marginTop: "24px"
  }}
>
  <h2>Last 7 Days</h2>

  <p>
    Visitors: {stats.weekVisitors}
  </p>

  <p>
    Invoices: {stats.weekInvoices}
  </p>
</div>

      <div style={{ border: "1px solid gray", padding: "20px", marginTop: "24px" }}>
        <h2>Currencies Used</h2>

        {Object.keys(stats.currencies).length === 0 ? (
          <p>No invoice downloads yet.</p>
        ) : (
          Object.entries(stats.currencies).map(([currency, count]) => (
            <p key={currency}>
              {currency}: {count}
            </p>
          ))
        )}
      </div>

      <br />
      <Link to="/create">Back to Dashboard</Link>
    </div>
  );
}

export default Admin;