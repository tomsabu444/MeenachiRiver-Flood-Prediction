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
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const labels = chartData?.labels || [];
            const data = chartData?.datasets?.[0]?.data || [];


            chartInstance.current = new Chart(chartRef.current, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Water Level',
                        data: data,
                        borderColor: 'rgb(75, 192, 192)',
                         tension: 0.1,
                         fill: false,
                    }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                    scales: {
                       x: {
                          ticks: {
                            color: '#fff', // Explicitly set x-axis tick color to white
                            maxTicksLimit: 8, // Reduced max ticks for better spacing
                            autoSkip: true,
                             callback: function(value, index, values) {
                                if(values.length > 10) {
                                  if (index % Math.ceil(values.length / 8) === 0) {
                                      return this.getLabelForValue(value);
                                    }
                                 } else {
                                    return this.getLabelForValue(value);
                                 }
                             },
                         },
                           grid: {
                              color: 'rgba(255, 255, 255, 0.1)', // Customize grid line color
                            },
                        },
                        y: {
                            min: 0,
                            max: 10,
                             ticks: {
                                color: '#fff', // Explicitly set y-axis tick color to white
                                stepSize: 2,
                            },
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)', // Customize grid line color
                            },
                             title: {
                              display: true,
                              text: 'Water Level (meters)',
                              color: '#fff', // Customize y-axis label color
                            },
                        },
                    },
                     plugins: {
                      legend: {
                        labels: {
                         color: '#fff' // Customize legend text color
                        }
                      },
                    }
                }
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        }
    }, [chartData]);

    return (
        <div>
            {/* Time Range Selector */}
            <div className="flex justify-end mb-4">
                <FormControl
                    variant="outlined"
                    sx={{
                        minWidth: 160,
                        "& .MuiInputLabel-root": {
                            color: "#fff", // Label color
                        },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#18181b", // Border color
                                borderRadius: "8px", // Border radius
                            },
                            "&:hover fieldset": {
                                borderColor: "#18181b", // Border color on hover
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#18181b", // Border color when focused
                            },
                            color: "#fff", // Text color
                            borderRadius: "8px", // Apply border radius to the input
                        },
                        "& .MuiSelect-icon": {
                            color: "#fff", // Dropdown arrow color
                        },
                        backgroundColor: "#18181b", // Background color of the dropdown
                        borderRadius: "8px", // Ensure overall border radius consistency
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