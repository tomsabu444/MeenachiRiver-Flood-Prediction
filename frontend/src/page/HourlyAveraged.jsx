import React, { useState, useEffect, useRef } from "react";
import useApiCalls from "../hooks/useApiCalls";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { toPng } from "html-to-image"; // For downloading as PNG

const HourlyAveragedChartWithDownload = () => {
  const { loading, fetchNodeMetaData, fetchHourlyData } = useApiCalls();

  const [nodeList, setNodeList] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [chartData, setChartData] = useState([]);

  // Ref specifically for the chart content only
  const chartContentRef = useRef(null);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await fetchNodeMetaData();
        if (response?.data) {
          setNodeList(response.data);
        }
      } catch (error) {
        console.error("Error fetching node metadata:", error);
      }
    };
    fetchNodes();
  }, [fetchNodeMetaData]);

  // Ensure we have 24 data points (one per hour)
  const fillChartData = (data) => {
    const fullData = [];
    for (let hour = 0; hour < 24; hour++) {
      const found = data.find((item) => item.hour === hour);
      fullData.push({
        hour,
        avgWaterLevel: found ? found.avgWaterLevel : null
      });
    }
    return fullData;
  };

  const handleFetchData = async () => {
    if (!selectedNodeId || !selectedDate) {
      alert("Please select both a Node and a Date.");
      return;
    }
    try {
      const result = await fetchHourlyData(selectedNodeId, selectedDate);
      const fullData = fillChartData(result.data || []);
      setChartData(fullData);
    } catch (error) {
      console.error("Error fetching hourly data:", error);
    }
  };

  const handleDownload = async () => {
    if (!chartContentRef.current) return;
    
    try {
      // Apply specific styling for the export to make it look better
      const originalStyle = chartContentRef.current.style.backgroundColor;
      chartContentRef.current.style.backgroundColor = "white";
      
      const dataUrl = await toPng(chartContentRef.current, {
        quality: 1.0,
        pixelRatio: 2, // Higher resolution
        style: {
          // Remove any padding to capture just the chart
          margin: 0,
          padding: 0
        }
      });
      
      // Restore original styling
      chartContentRef.current.style.backgroundColor = originalStyle;
      
      // Create download link
      const link = document.createElement("a");
      link.download = `water-level-${selectedNodeId}-${selectedDate}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to download chart as PNG:", error);
    }
  };

  // Format hour to display "12 AM", "1 AM", …, "12 PM", "1 PM", etc.
  const formatHour = (hour) => {
    const h = hour % 12 === 0 ? 12 : hour % 12;
    const period = hour < 12 ? "AM" : "PM";
    return `${h} ${period}`;
  };

  return (
    <div className="max-w-fit mx-auto p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6">Hourly Averaged Water Level</h2>

      {/* Node Dropdown */}
      <div className="w-full mb-4">
        <label htmlFor="nodeSelect" className="mr-2 font-medium">
          Select Node:
        </label>
        <select
          id="nodeSelect"
          value={selectedNodeId}
          onChange={(e) => setSelectedNodeId(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">-- Select a Node --</option>
          {nodeList.map((node) => (
            <option key={node.nodeId} value={node.nodeId}>
              {node.nodeId}
            </option>
          ))}
        </select>
      </div>

      {/* Date Picker */}
      <div className="w-full mb-4">
        <label htmlFor="dateInput" className="mr-2 font-medium">
          Select Date:
        </label>
        <input
          id="dateInput"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      {/* Fetch Data Button */}
      <button
        onClick={handleFetchData}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded mb-6"
      >
        {loading ? "Loading..." : "Fetch Hourly Data"}
      </button>

      {chartData.length > 0 && (
        <div className="w-full flex flex-col items-center">
          {/* Chart container with the chart only */}
          <div className="bg-white p-6 shadow-lg rounded-lg w-full mb-6 overflow-x-auto">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Hourly Data for {selectedNodeId} on {selectedDate}
            </h3>
            
            {/* This is the chart content that will be exported */}
            <div ref={chartContentRef} style={{ width: 1600, backgroundColor: "white" }}>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="hour"
                    tickFormatter={formatHour}
                    ticks={[
                      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                      12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
                    ]}
                    interval={0}
                    label={{
                      value: "Time (12-hr format)",
                      position: "insideBottom",
                      offset: -5,
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Avg Water Level (feet)",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip labelFormatter={formatHour} />
                  <Line
                    type="monotone"
                    dataKey="avgWaterLevel"
                    stroke="#28a745"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
          >
            Download Chart as PNG
          </button>
        </div>
      )}
    </div>
  );
};

export default HourlyAveragedChartWithDownload;