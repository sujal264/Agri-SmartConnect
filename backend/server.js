const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/ai",       require("./routes/ai"));
app.use("/api/products", require("./routes/products"));
app.use("/api/expenses", require("./routes/expenses"));
app.use("/api/forum",    require("./routes/forum"));
app.use("/api/orders",   require("./routes/orders"));

// ── Health Check ──────────────────────────────────────────────
app.get("/", (req, res) => res.send("Agri-Smart Connect API running ✅"));

// ── Connect DB & Start ────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`✅ Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err.message);
    process.exit(1);
  });