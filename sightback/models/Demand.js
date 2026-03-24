const mongoose = require("mongoose");

const demandSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ProductID: { type: String, required: true },
  ProductName: { type: String, required: true },
  Category: { type: String, required: true },
  UnitsSold: { type: Number, required: true },
  UnitPrice: { type: Number, required: true },
  TotalRevenue: { type: Number, required: true },
  OrderDate: { type: Date, required: true },
});

// ===== SYSTEM DESIGN: PERFORMANCE INDEXING =====
// Crucial for apps handling millions of rows (like your 2.6M row test)
// Indexing userId: makes 'Find My Data' near-instant
demandSchema.index({ userId: 1 });

// Indexing OrderDate: speeds up Time-Series/Trend charts
demandSchema.index({ OrderDate: -1 });

// Compound Index: Optimizes fetching historical trends for a specific user
demandSchema.index({ userId: 1, OrderDate: -1 });

// Indexing ProductID: speeds up product-specific forecasting
demandSchema.index({ ProductID: 1 });

module.exports = mongoose.model("Demand", demandSchema);
