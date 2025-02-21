import React, { useRef, useEffect } from "react";
import Chart from 'chart.js/auto';
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";

const DetailChart = ({
    chartData,
    selectedRange,
    handleTimeRangeChange,
}) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current && chartData?.labels?.length > 0) {
            // Clean up previous chart instance if it exists
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            // Create a new chart instance with the provided data
            chartInstance.current = new Chart(chartRef.current, {
                type: 'line',
                data: chartData, // Use the properly formatted chartData directly
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            ticks: {
                                color: '#fff',
                                maxTicksLimit: 8,
                                autoSkip: true,
                                callback: function(value, index, values) {
                                    if (values.length > 10) {
                                        if (index % Math.ceil(values.length / 8) === 0) {
                                            return this.getLabelForValue(value);
                                        }
                                    } else {
                                        return this.getLabelForValue(value);
                                    }
                                },
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                            },
                        },
                        y: {
                            min: 0, // Always starts at 0
                            max: 10, // Always ends at 10
                            ticks: {
                                color: '#fff',
                                stepSize: 2, // Steps of 2 for better readability
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
                },
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [chartData]);

    return (
        <div>
            {/* Time Range Selector */}
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

            {/* Chart Container */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4">Water Level Over Time</h2>
                <div className="h-[400px]">
                    {chartData?.labels?.length > 0 ? (
                        <canvas ref={chartRef} />
                    ) : (
                        <p className="text-white">No chart data available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailChart;