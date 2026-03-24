const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const authenticateJWT = require("../middleware/authMiddleware");

const Demand = require("../models/Demand"); // MongoDB model
const cacheService = require("../utils/cacheService");

const router = express.Router();

// ===== Multer Setup =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("uploads/")) {
      fs.mkdirSync("uploads/");
    }
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// ===== Helper: Validate CSV Row =====
function isValidRow(row) {
  return row.ProductID &&
         row.ProductName &&
         row.Category &&
         !isNaN(row.UnitsSold) &&
         !isNaN(row.UnitPrice) &&
         !isNaN(row.TotalRevenue) &&
         !isNaN(Date.parse(row.OrderDate));
}

// ===== POST Route for File Upload (CSV or JSON) =====
router.post("/", authenticateJWT, upload.single("file"), (req, res) => {
  let results = [];
  const invalidRows = [];

  if (!req.file) {
    // Check if data is passed in request body (Manual Entry)
    if (req.body.data && Array.isArray(req.body.data)) {
        results = req.body.data.map(row => ({ ...row, userId: req.user.userId }));
        return processAndSave(results, res, req.user.userId, null, true); // true = append for manual entry
    }
    return res.status(400).json({ error: "No file or data provided" });
  }

  const filePath = req.file.path;
  const fileExtension = path.extname(req.file.originalname).toLowerCase();

  if (fileExtension === ".json") {
      // Handle JSON File
      fs.readFile(filePath, "utf8", async (err, data) => {
          if (err) return res.status(500).json({ error: "Failed to read JSON file" });
          try {
              const jsonData = JSON.parse(data);
              const rows = Array.isArray(jsonData) ? jsonData : [jsonData];
              results = rows.filter(isValidRow).map(row => ({
                  userId: req.user.userId,
                  ProductID: row.ProductID,
                  ProductName: row.ProductName,
                  Category: row.Category,
                  UnitsSold: Number(row.UnitsSold),
                  UnitPrice: Number(row.UnitPrice),
                  TotalRevenue: Number(row.TotalRevenue),
                  OrderDate: new Date(row.OrderDate),
              }));
              await processAndSave(results, res, req.user.userId, filePath);
          } catch (e) {
              res.status(400).json({ error: "Invalid JSON format" });
          }
      });
  } else {
      // Handle CSV File (Streaming + Batching for High Performance)
      let batch = [];
      const BATCH_SIZE = 5000;
      let totalInserted = 0;

      const fileStream = fs.createReadStream(filePath);
      const csvStream = fileStream.pipe(csv());

      // If not appending, clear DB first (Isolated for CSV upload)
      Demand.deleteMany({ userId: req.user.userId })
        .then(() => {
          csvStream.on("data", (data) => {
            if (isValidRow(data)) {
              batch.push({
                userId: req.user.userId,
                ProductID: data.ProductID,
                ProductName: data.ProductName,
                Category: data.Category,
                UnitsSold: Number(data.UnitsSold),
                UnitPrice: Number(data.UnitPrice),
                TotalRevenue: Number(data.TotalRevenue),
                OrderDate: new Date(data.OrderDate),
              });

              if (batch.length >= BATCH_SIZE) {
                const currentBatch = [...batch];
                batch = [];
                fileStream.pause(); // Backpressure: Stop reading while writing to DB
                Demand.insertMany(currentBatch)
                  .then(() => {
                    totalInserted += currentBatch.length;
                    fileStream.resume(); // Safe to read more
                  })
                  .catch(err => {
                    console.error("Batch Insert Error:", err);
                    fileStream.resume();
                  });
              }
            }
          });

          csvStream.on("end", async () => {
            try {
              if (batch.length > 0) {
                await Demand.insertMany(batch);
                totalInserted += batch.length;
              }
              // CRITICAL: Clear cache so next dashboard load shows fresh data
              cacheService.invalidate(req.user.userId);
              
              res.status(200).json({
                message: `✅ Processed ${totalInserted.toLocaleString()} records successfully!`,
                inserted: totalInserted,
              });
            } catch (err) {
              res.status(500).json({ error: "Final batch sync failed" });
            } finally {
              fs.unlink(filePath, () => {});
            }
          });

          csvStream.on("error", (err) => {
            console.error("CSV Stream Error:", err);
            fs.unlink(filePath, () => {});
            if (!res.headersSent) res.status(500).json({ error: "Corrupted CSV file" });
          });
        })
        .catch(err => {
          fs.unlink(filePath, () => {});
          res.status(500).json({ error: "Failed to initialize database for sync" });
        });
  }
});

async function processAndSave(results, res, userId, filePath = null, shouldAppend = false) {
  try {
    if (results.length > 0) {
      if (!shouldAppend) {
        await Demand.deleteMany({ userId });
      }
      await Demand.insertMany(results);
    }
    // CRITICAL: Clear cache so next dashboard load shows fresh data
    cacheService.invalidate(userId);

    res.status(200).json({
      message: shouldAppend ? "Record added successfully" : "Data synced successfully",
      inserted: results.length,
    });
  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ error: "Storage failure" });
  } finally {
    if (filePath) fs.unlink(filePath, () => {});
  }
}

module.exports = router;
