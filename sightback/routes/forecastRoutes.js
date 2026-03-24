const express = require("express");
const mongoose = require("mongoose");
const tf = require("@tensorflow/tfjs");
const Demand = require("../models/Demand");
const authenticateJWT = require("../middleware/authMiddleware");
const cacheService = require("../utils/cacheService");
const router = express.Router();

const { fork } = require("child_process");
const path = require("path");

// ===== SYSTEM DESIGN: MICROSERVICE ISOLATION =====
// Instead of running TensorFlow in this process (SPOF),
// we spawn a "Child Process" that acts like an isolated microservice.
// Main benefit: If the AI engine crashes, your API server stays ONLINE.
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    const cacheKey = `forecast_${userId}`;
    const cachedData = cacheService.get(cacheKey);

    if (cachedData) return res.json(cachedData);

    const aiWorkerPath = path.join(__dirname, "../ai-service.js");
    
    // Fork a separate process for CPU-intensive training
    const worker = fork(aiWorkerPath, [userId]);

    // Safety Timeout: Kill AI if it runs for more than 2 minutes
    const timeout = setTimeout(() => {
      worker.kill();
      if (!res.headersSent) res.status(504).json({ error: "AI Service Timeout: Analysis took too long" });
    }, 120000);

    worker.on("message", (result) => {
      clearTimeout(timeout);
      if (result.error) {
        if (!res.headersSent) return res.status(500).json({ error: result.error });
      }
      cacheService.set(cacheKey, result);
      if (!res.headersSent) res.json(result);
    });

    worker.on("error", (err) => {
      clearTimeout(timeout);
      console.error("AI Microservice Failure:", err);
      res.status(500).json({ error: "Isolated AI Service crashed" });
    });

    worker.on("exit", (code) => {
      clearTimeout(timeout);
      if (code !== 0 && !res.headersSent) {
        res.status(500).json({ error: "AI Analysis terminated unexpectedly" });
      }
    });

  } catch (err) {
    console.error("Gateway Error:", err);
    res.status(500).json({ error: "Failed to reach AI service" });
  }
});

module.exports = router;
