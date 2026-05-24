const express = require("express");
const dotenv = require("dotenv");

// Load env vars BEFORE requiring routes — uses standard .env file
dotenv.config();

const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const dataRoutes = require("./routes/dataRoutes");
const forecastRoutes = require("./routes/forecastRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Connect to MongoDB =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ===== Middleware =====
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/forecast", forecastRoutes);
app.use("/api", dataRoutes);

// ===== Server Start =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
