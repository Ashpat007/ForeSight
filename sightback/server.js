const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars BEFORE requiring routes
dotenv.config({ path: "./local.env" });

const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes"); 
const uploadRoutes = require("./routes/uploadRoutes");
const dataRoutes = require("./routes/dataRoutes");
const forecastRoutes = require("./routes/forecastRoutes");
const { resetData } = require("./utils/dataStore");

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Connect to MongoDB =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit if DB connection fails
  });

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Routes =====
app.use("/api/auth", authRoutes); // Use the auth routes for login and registration
app.use("/api/upload", uploadRoutes); // Use the upload routes for file handling (CSV upload)
app.use("/api/forecast", forecastRoutes); // AI Forecasting route
app.use("/api", dataRoutes); // Add this line to use the new data route

// ===== Optional: Clear in-memory data on server start =====
resetData();  // Only call this if you want to reset the in-memory data each time the server starts

// ===== Server Start =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
