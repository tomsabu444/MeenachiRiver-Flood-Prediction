import React, { useRef, useEffect } from "react";
import Chart from 'chart.js/auto';
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";

const DetailChart = ({
    chartData,
    selectedRange,
    handleTimeRangeChange,
    chartType = "actual" // "actual" or "predicted"
}) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current && chartData?.datasets?.length > 0) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            console.log(`📈 ${chartType} Chart data provided to Chart.js:`, chartData);

            chartInstance.current = new Chart(chartRef.current, {
                type: 'line',
                data: {
                    datasets: [chartData.datasets.find(dataset => 
                        dataset.label.toLowerCase().includes(chartType.toLowerCase())
                    )].filter(Boolean)
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    parsing: {
                        xAxisKey: 'x',
                        yAxisKey: 'y'
                    },
                    scales: {
                        x: {
                            type: 'category',
                            reverse: true, // This flips the X-axis
                            ticks: {
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
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [chartData, chartType]);

    return (
        <div>
            {chartType === "actual" && (
                <div className="flex justify-end mb-4">
                    <FormControl
                        variant="outlined"
                        sx={{
                            minWidth: 160,
                            "& .MuiInputLabel-root": { color: "#fff" },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#18181b", borderRadius: "8px" },
                                "&:hover fieldset": { borderColor: "#18181b" },
                                "&.Mui-focused fieldset": { borderColor: "#18181b" },
                                color: "#fff",
                                borderRadius: "8px",
                            },
                            "& .MuiSelect-icon": { color: "#fff" },
                            backgroundColor: "#18181b",
                            borderRadius: "8px",
                        }}
                    >
                        <InputLabel id="range-select-label">Time Range</InputLabel>
                        <Select
                            labelId="range-select-label"
                            id="range-select"
                            value={selectedRange}
                            onChange={handleTimeRangeChange}
                            label="Time Range"
                        >
                            <MenuItem value="2">2 Days</MenuItem>
                            <MenuItem value="5">5 Days</MenuItem>
                            <MenuItem value="10">10 Days</MenuItem>
                            <MenuItem value="20">20 Days</MenuItem>
                            <MenuItem value="1">1 Month</MenuItem>
                            <MenuItem value="3">3 Months</MenuItem>
                            <MenuItem value="6">6 Months</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            )}

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4">
                    {chartType === "actual" ? "Actual Water Level Over Time" : "Predicted Water Level Over Time"}
                </h2>
                <div className="h-[400px]">
                    {chartData?.datasets?.some(dataset => 
                        dataset.label.toLowerCase().includes(chartType.toLowerCase()) && 
                        dataset.data?.length > 0
                    ) ? (
                        <canvas ref={chartRef} />
                    ) : (
                        <p className="text-white">No {chartType} data available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailChart;