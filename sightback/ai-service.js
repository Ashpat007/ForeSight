const mongoose = require("mongoose");
const tf = require("@tensorflow/tfjs");
const Demand = require("./models/Demand");
const dotenv = require("dotenv");

dotenv.config({ path: "./local.env" });

// Connect to DB independently
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🤖 AI Engine Microservice Online"))
    .catch(err => console.error("AI Engine DB Error", err));

// SYSTEM DESIGN: This service would normally listen to a Message Queue (Redis/RabbitMQ)
// For this architecture demo, we'll create an exported function that can be run in a child process
async function runForecast(userId) {
    console.log(`🧠 AI Engine starting analysis for User: ${userId}`);
    
    // 1. High-Speed Aggregation (Optimized in previous step)
    const aggregatedData = await Demand.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$OrderDate" } },
                totalUnits: { $sum: "$UnitsSold" }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    if (!aggregatedData || aggregatedData.length < 5) {
        throw new Error("Insufficient data for deep learning");
    }

    const dates = aggregatedData.map(d => d._id);
    const values = aggregatedData.map(d => d.totalUnits);
    const maxVal = Math.max(...values, 1);
    const normalizedValues = values.map(v => v / maxVal);

    // 2. Heavy Neural Network Training (CPU Intensive)
    const xs = tf.tensor2d(normalizedValues.slice(0, -1).map((_, i) => [i]), [normalizedValues.length - 1, 1]);
    const ys = tf.tensor2d(normalizedValues.slice(1), [normalizedValues.length - 1, 1]);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 10, inputShape: [1], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ optimizer: tf.train.adam(0.1), loss: 'meanSquaredError' });

    await model.fit(xs, ys, { epochs: 50 }); // Reduced epochs for faster service response

    // 3. Generate 7-Day Prediction
    const forecast = [];
    const lastDate = new Date(dates[dates.length - 1]);
    for (let i = 1; i <= 7; i++) {
        const input = tf.tensor2d([[normalizedValues.length + i - 1]]);
        const prediction = model.predict(input);
        const predictedVal = prediction.dataSync()[0] * maxVal;
        
        const nextDate = new Date(lastDate);
        nextDate.setDate(lastDate.getDate() + i);

        forecast.push({
            OrderDate: nextDate.toISOString().split('T')[0],
            PredictedUnits: Math.max(0, Math.round(predictedVal * 100) / 100),
            isForecast: true
        });
    }

    // Cleanup
    xs.dispose(); ys.dispose();
    
    return {
        historical: dates.map((d, i) => ({ OrderDate: d, UnitsSold: values[i] })),
        forecast: forecast,
        engine: "Isolated AI Service (TensorFlow.js)"
    };
}

// Allow execution as a standalone worker or via messaging
if (require.main === module) {
    const userId = process.argv[2];
    if (userId) {
        runForecast(userId)
            .then(res => {
                process.send(res); // Send result back to parent process
                process.exit(0);
            })
            .catch(err => {
                process.send({ error: err.message });
                process.exit(1);
            });
    }
}

module.exports = { runForecast };
