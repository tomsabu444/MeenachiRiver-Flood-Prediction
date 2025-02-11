// server/routes/getWaterlevel.js

const express = require("express");
const router = express.Router();
const NodeDataSchema = require('../schema/NodeDataSchema');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

// Get historical water level data with time range filtering
router.get("/:nodeId", async (req, res) => {
    try {
        const { nodeId } = req.params;
        const { range } = req.query;

        let daysToFilter = 30; // Default to 30 days
        if (range === "2") daysToFilter = 2;
        else if (range === "5") daysToFilter = 5;
        else if (range === "10") daysToFilter = 10;
        else if (range === "20") daysToFilter = 20;
        else if (range === "3") daysToFilter = 90;
        else if (range === "6") daysToFilter = 180;

        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - daysToFilter);

        // Aggregate to get data points at 10-minute intervals
        const nodeData = await NodeDataSchema.aggregate([
            {
                $match: {
                    nodeId: nodeId,
                    timestamp: { $gte: fromDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$timestamp" },
                        month: { $month: "$timestamp" },
                        day: { $dayOfMonth: "$timestamp" },
                        hour: { $hour: "$timestamp" },
                        tenMinute: {
                            $subtract: [
                                { $minute: "$timestamp" },
                                { $mod: [{ $minute: "$timestamp" }, 10] }
                            ]
                        }
                    },
                    timestamp: { $first: "$timestamp" },
                    nodeId: { $first: "$nodeId" },
                    waterLevel: { $first: "$waterLevel" }
                }
            },
            { $sort: { timestamp: -1 } }
        ]);

        if (!nodeData || nodeData.length === 0) {
            return res
                .status(404)
                .json({ message: "No data found for the given nodeId and range." });
        }

        res.json({ success: true, data: nodeData });
    } catch (error) {
        console.error("Error fetching water level data:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Get water level predictions
router.get("/:nodeId/predictions", async (req, res) => {
    try {
        const { nodeId } = req.params;
        
        // First, verify that the node exists and has recent data
        const recentData = await NodeDataSchema.find({ nodeId })
            .sort({ timestamp: -1 })
            .limit(1);

        if (!recentData || recentData.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No recent data found for this node"
            });
        }

        // Prepare current data file for the prediction model
        const last12Hours = await NodeDataSchema.find({
            nodeId,
            timestamp: { $gte: new Date(Date.now() - 12 * 60 * 60 * 1000) }
        }).sort({ timestamp: 1 });

        // Format data for the Python model
        const currentData = last12Hours.map(record => ({
            'Date and Time': record.timestamp.toFormat('dd-MM-yyyy HH:mm'),
            'Water Lev': record.waterLevel
        }));

        // Write current data to temporary CSV file
        const currentDataPath = path.join(__dirname, '..', 'data', 'current.csv');
        await fs.writeFile(
            currentDataPath,
            'Date and Time,Water Lev\n' +
            currentData.map(record => 
                `${record['Date and Time']},${record['Water Lev']}`
            ).join('\n')
        );

        // Run prediction model
        const pythonScript = path.join(__dirname, 'prediction.py');
        const pythonProcess = spawn('python', [
            pythonScript,
            process.env.WEATHER_API_KEY
        ]);

        let dataString = '';
        let errorString = '';

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        pythonProcess.on('close', async (code) => {
            try {
                // Clean up temporary file
                await fs.unlink(currentDataPath);

                if (code !== 0) {
                    console.error('Python prediction error:', errorString);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to generate predictions'
                    });
                }

                // Parse prediction results
                const predictions = JSON.parse(dataString);

                // Combine historical data with predictions
                const response = {
                    success: true,
                    historical: recentData[0],
                    predictions: predictions.predictions,
                    metadata: {
                        nodeId,
                        generatedAt: predictions.generated_at,
                        modelInfo: predictions.model_info
                    }
                };

                res.json(response);
            } catch (error) {
                console.error('Error processing predictions:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error processing predictions'
                });
            }
        });
    } catch (error) {
        console.error("Error generating predictions:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get latest water level
router.get("/:nodeId/latest", async (req, res) => {
    try {
        const { nodeId } = req.params;

        const latestData = await NodeDataSchema.findOne(
            { nodeId },
            { waterLevel: 1, timestamp: 1, nodeId: 1 }
        ).sort({ timestamp: -1 });

        if (!latestData) {
            return res.status(404).json({
                success: false,
                message: "No data found for the given nodeId"
            });
        }

        res.json({ success: true, data: latestData });
    } catch (error) {
        console.error("Error fetching latest water level:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

module.exports = router;