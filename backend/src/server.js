require("dotenv").config();
const cors = require("cors");

const express = require("express");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "invopaid-backend"
  });
});

app.use("/", paymentRoutes);

const PORT = process.env.PORT || 4000;

//const PORT = 4000;

app.get('/test', (req, res) => {
  res.send('Backend is working');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});