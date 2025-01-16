import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // For extracting nodeId from the URL
import useApiCalls from '../hooks/useApiCalls'; // Assuming your custom hook is here
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Detail = () => {
  const { nodeId } = useParams(); // Get nodeId from URL
  const { fetchNodeMetaDataById, loading } = useApiCalls();
  const [nodeData, setNodeData] = useState(null); // To store the fetched node data
  const [chartData, setChartData] = useState(null); // To store data for the chart

  // Generate dummy data for chart
  const generateDummyChartData = () => {
    const dummyData = {
      labels: ['2024-01-01', '2024-02-01', '2024-03-01', '2024-04-01', '2024-05-01'],
      datasets: [
        {
          label: 'Water Level (m)',
          data: [10, 12, 14, 13, 15], // Example water levels over time
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.2)',
          borderWidth: 2,
          tension: 0.4, // Smooth curve
          pointRadius: 3,
        },
      ],
    };
    return dummyData;
  };

  // Fetch node data when component is mounted or nodeId changes
  useEffect(() => {
    if (nodeId) {
      fetchNodeMetaDataById(nodeId)
        .then((data) => {
          setNodeData(data.data); // Store the node data
          // Prepare chart data based on node data (assuming it contains a 'history' array)
          const chartData = {
            labels: data.data.history ? data.data.history.map((entry) => entry.date) : ['2024-01-01', '2024-02-01'],
            datasets: [
              {
                label: 'Water Level (m)',
                data: data.data.history ? data.data.history.map((entry) => entry.level) : [10, 12],
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.2)',
                borderWidth: 2,
                tension: 0.4, // Smooth curve
                pointRadius: 3,
              },
            ],
          };
          setChartData(chartData); // Update chart data
        })
        .catch((error) => {
          console.error("Error fetching node data:", error);
          // Use dummy data if the API fails
          setChartData(generateDummyChartData());
        });
    }
  }, [nodeId, fetchNodeMetaDataById]);

  // If loading, show a loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!nodeData || !chartData) {
    return <div>No data available for this node.</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <h1 className="text-3xl font-bold border-b pb-2">{nodeData.locationName}</h1>

        {/* Cards Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Status */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Current Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Water Level:</span>
                <span>{nodeData.latest_water_level} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Latitude:</span>
                <span>{nodeData.latitude}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Longitude:</span>
                <span>{nodeData.longitude}</span>
              </div>
            </div>
          </div>

          {/* Warning Specifications */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Warning Specifications</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Yellow Alert Level:</span>
                <span>{nodeData.yellow_alert} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Orange Alert Level:</span>
                <span>{nodeData.orange_alert} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Red Alert Level:</span>
                <span>{nodeData.red_alert} m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-end">
          <select
            defaultValue="1"
            className="bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-2 w-44"
          >
            <option value="1">1 Month</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
          </select>
        </div>

        {/* Water Level Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Water Level Over Time</h2>
          <div className="h-[300px]">
            <Line data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
