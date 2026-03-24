const express = require("express");
const mongoose = require("mongoose");
const Demand = require("../models/Demand");
const authenticateJWT = require("../middleware/authMiddleware");
const cacheService = require("../utils/cacheService");
const router = express.Router();

// ===== SYSTEM DESIGN: SUMMARY AGGREGATION =====
// Instead of the browser summing 2.6M rows, we do it in high-speed C++ in MongoDB.
router.get("/data/summary", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    const cacheKey = `summary_${userId}`;
    const cachedData = cacheService.get(cacheKey);

    if (cachedData) return res.json(cachedData);

    const matchQuery = { userId: new mongoose.Types.ObjectId(userId) };
    
    // 1. Calculate Core Stats
    const stats = await Demand.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: "$UnitsSold" },
          totalRevenue: { $sum: "$TotalRevenue" },
          recordCount: { $sum: 1 }
        }
      }
    ]);

    // 2. Find Top Product
    const topProdRes = await Demand.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$ProductName",
          units: { $sum: "$UnitsSold" }
        }
      },
      { $sort: { units: -1 } },
      { $limit: 1 }
    ]);

    if (!stats || stats.length === 0) {
      return res.status(204).send();
    }

    const s = stats[0];
    const top = topProdRes[0];

    const result = {
      totalUnits: s.totalUnits,
      totalRevenue: s.totalRevenue,
      avgUnitsPerDay: (s.totalUnits / Math.max(s.recordCount, 1)).toFixed(1),
      topProduct: top ? { name: top._id, units: top.units } : null
    };

    cacheService.set(cacheKey, result);
    res.json(result);

  } catch (err) {
    console.error("Summary Error:", err);
    res.status(500).json({ error: "Failed to load summary stats" });
  }
});

// ===== SYSTEM DESIGN: CHART AGGREGATION =====
// Pre-groups data by product for Bar/Pie charts.
router.get("/data/chart", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    const cacheKey = `chart_${userId}`;
    const cachedData = cacheService.get(cacheKey);

    if (cachedData) return res.json(cachedData);

    const chartData = await Demand.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$ProductName",
          UnitsSold: { $sum: "$UnitsSold" },
          TotalRevenue: { $sum: "$TotalRevenue" }
        }
      },
      { $project: { name: "$_id", UnitsSold: 1, TotalRevenue: 1, _id: 0 } },
      { $sort: { UnitsSold: -1 } }
    ]);

    cacheService.set(cacheKey, chartData);
    res.json(chartData);
  } catch (err) {
    res.status(500).json({ error: "Chart data generation failed" });
  }
});

// Route to get current user's demand data from MongoDB (with Safety Limit)
router.get("/data", authenticateJWT, async (req, res) => {
  try {
    // SECURITY: Never send 2.6M objects to a browser. We limit to 5000.
    const data = await Demand.find({ userId: req.user.userId }).limit(5000).sort({ OrderDate: -1 }).lean();
    if (!data || data.length === 0) {
      return res.status(204).send();
    }
    res.json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

// Route to clear only current user's demand data
router.delete("/data", authenticateJWT, async (req, res) => {
  try {
    await Demand.deleteMany({ userId: req.user.userId });
    cacheService.invalidate(req.user.userId); // CRITICAL: Clear cache on delete
    res.json({ message: "User data cleared successfully" });
  } catch (err) {
    console.error("Error clearing data:", err);
    res.status(500).json({ error: "Failed to clear data" });
  }
});

module.exports = router;
