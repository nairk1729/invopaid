import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CreatePaymentLink from "./pages/CreatePaymentLink";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import OperationsDashboard from "./pages/OperationsDashboard";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/create" />} />
        <Route path="/create" element={<CreatePaymentLink />} />
        <Route path="/pay/:paymentLinkId" element={<Checkout />} />
        <Route path="/confirmation/:transactionId" element={<Confirmation />} />
        <Route path="/operations" element={<OperationsDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);