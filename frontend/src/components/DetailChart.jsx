import React, { useRef, useEffect } from "react";
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns'; // Ensures time-based X-axis support
import { format } from 'date-fns'; // Helps format timestamps

const DetailChart = ({ actualData, predictedData }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current || actualData.length === 0) {
            return;
        }

        // Destroy existing chart instance before creating a new one
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Convert actual & predicted data into chart-friendly format
        const actualDataPoints = actualData.map(entry => ({
            x: new Date(entry.timestamp),
            y: entry.waterlevel,
        }));

        const predictedDataPoints = predictedData.length > 0
            ? predictedData.map(entry => ({
                x: new Date(entry.timestamp),
                y: entry.waterlevel,
            }))
            : [];

        console.log("📊 Actual Data:", actualDataPoints);
        console.log("🔮 Predicted Data:", predictedDataPoints.length > 0 ? predictedDataPoints : "No Prediction Data");

        // Create dataset array (conditionally add predicted data if available)
        const datasets = [
            {
                label: "Actual Water Level (ft)",
                data: actualDataPoints,
                borderColor: "#06b6d4",
                backgroundColor: "rgba(6, 182, 212, 0.2)",
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 3,
                fill: false,
            }
        ];

        if (predictedDataPoints.length > 0) {
            datasets.push({
                label: "Predicted Water Level (ft)",
                data: predictedDataPoints,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderWidth: 2,
                borderDash: [5, 5], // Makes it a dotted line
                tension: 0.4,
                pointRadius: 3,
                fill: false,
            });
        }

        // Create new Chart instance
        chartInstance.current = new Chart(chartRef.current, {
            type: 'line',
            data: {
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            tooltipFormat: 'dd/MM/yy hh:mm a',
                        },
                        ticks: {
                            callback: function(value) {
                                return format(new Date(value), "d/MM/yy h:mm a");
                            },
                            color: '#fff',
                            maxTicksLimit: 8,
                            autoSkip: true,
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                        },
                    },
                    y: {
                        min: 0,
                        suggestedMax: 10,
                        ticks: {
                            color: '#fff',
                            stepSize: 2,
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                        },
                        title: {
                            display: true,
                            text: 'Water Level (feet)',
                            color: '#fff',
                        },
                    },
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff',
                        },
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    },
                },
                spanGaps: true,
            },
        });

        // Cleanup: Destroy chart on unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [actualData, predictedData]);

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Water Level Over Time</h2>
            <div className="h-[400px]">
                <canvas ref={chartRef} />
            </div>
        </div>
    );
};

export default DetailChart;
