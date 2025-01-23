import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApiCalls from "../hooks/useApiCalls";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Custom MUI theme for dark mode
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#06b6d4",
    },
    background: {
      paper: "#1e293b",
    },
    text: {
      primary: "#ffffff",
    },
  },
});

const Detail = () => {
  const { nodeId } = useParams();
  const { fetchNodeMetaDataById, fetchNodeChartDataById, loading } =
    useApiCalls();
  const [nodeData, setNodeData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [selectedRange, setSelectedRange] = useState("1");

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "Invalid Date";

      return new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  const updateChartData = (data) => {
    if (!data || data.length === 0) {
      setChartData({
        labels: [],
        datasets: [
          {
            label: "Water Level (ft)",
            data: [],
            borderColor: "#06b6d4",
            backgroundColor: "rgba(6, 182, 212, 0.2)",
            borderWidth: 2,
          },
        ],
      });
      return;
    }

    const validData = data.filter(
      (entry) => entry.timestamp && !isNaN(new Date(entry.timestamp).getTime())
    );
    const reversedData = [...validData].reverse();

    const formattedChartData = {
      labels: reversedData.map((entry) => formatDateTime(entry.timestamp)),
      datasets: [
        {
          label: "Water Level (ft)",
          data: reversedData.map((entry) => entry.waterLevel),
          borderColor: "#06b6d4",
          backgroundColor: "rgba(6, 182, 212, 0.2)",
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 3,
        },
      ],
    };
    setChartData(formattedChartData);
  };

  useEffect(() => {
    if (nodeId) {
      fetchNodeMetaDataById(nodeId)
        .then((data) => {
          if (data?.data) setNodeData(data.data);
        })
        .catch((error) => {
          console.error("Error fetching node metadata:", error);
        });

      fetchNodeChartDataById(nodeId, selectedRange)
        .then((chartResponse) => {
          updateChartData(chartResponse.data);
        })
        .catch((error) => {
          console.error("Error fetching chart data:", error);
          updateChartData(null);
        });
    }
  }, [nodeId, selectedRange, fetchNodeMetaDataById, fetchNodeChartDataById]);

  const handleTimeRangeChange = (event) => {
    setSelectedRange(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!nodeData || !chartData) {
    return <div>No data available for this node.</div>;
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
      },
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
        },
      },
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-slate-700 text-white p-6 font-roboto">
        <div className="max-w-[1500px] mx-auto space-y-6">
          <h1 className="text-3xl font-bold border-b pb-2">
            {nodeData.locationName || "Unknown Location"}
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h2 className="text-xl font-bold mb-4">Current Status</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Water Level:</span>
                  <span>{nodeData.latest_water_level || "N/A"} ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Latitude:</span>
                  <span>{nodeData.latitude || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Longitude:</span>
                  <span>{nodeData.longitude || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Last Updated:</span>
                  <span>{formatDateTime(nodeData.timestamp)}</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h2 className="text-xl font-bold mb-4">Warning Specifications</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Yellow Alert Level:</span>
                  <span>{nodeData.yellow_alert || "N/A"} ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Orange Alert Level:</span>
                  <span>{nodeData.orange_alert || "N/A"} ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Red Alert Level:</span>
                  <span>{nodeData.red_alert || "N/A"} ft</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <FormControl
              variant="outlined"
              sx={{
                minWidth: 120,
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

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Water Level Over Time</h2>
            <div className="h-[400px]">
              {chartData.labels.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <p>No chart data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Detail;
