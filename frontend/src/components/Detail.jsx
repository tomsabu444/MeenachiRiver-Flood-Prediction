import React from 'react';
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

const data = [
  { date: '09.12.2024', level: 1207.0 },
  { date: '12.12.2024', level: 1207.1 },
  { date: '15.12.2024', level: 1207.2 },
  { date: '18.12.2024', level: 1207.0 },
];

const Detail = () => {
  // Prepare data for Chart.js
  const chartData = {
    labels: data.map((entry) => entry.date),
    datasets: [
      {
        label: 'Water Level (m)',
        data: data.map((entry) => entry.level),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.2)',
        borderWidth: 2,
        tension: 0.4, // Smooth curve
        pointRadius: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#a1a1aa' }, // X-axis text color
      },
      y: {
        grid: { color: '#52525b' },
        ticks: { color: '#a1a1aa' }, // Y-axis text color
        suggestedMin: 1206,
        suggestedMax: 1208.5,
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        callbacks: {
          label: (context) => `Level: ${context.raw} m`,
        },
      },
    },
    elements: {
      horizontalLine: {
        y: 1206.02,
        color: '#f97316',
        label: {
          content: 'Orange Alert',
          enabled: true,
          position: 'start',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <h1 className="text-3xl font-bold border-b pb-2">Anayirankal</h1>

        {/* Cards Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Status */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Current Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Water Level:</span>
                <span>1207.02 m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Storage:</span>
                <span>49.8377 MCM (100.02%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Inflow:</span>
                <span>1.01 cumecs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Outflow:</span>
                <span>0.00 cumecs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Rainfall:</span>
                <span>1.00 mm</span>
              </div>
            </div>
          </div>

          {/* Dam Specifications */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Dam Specifications</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Maximum Water Level:</span>
                <span>1210.070 m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Full Reservoir Level:</span>
                <span>1207.020 m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Total Capacity:</span>
                <span>49.83 MCM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Red Alert Level:</span>
                <span>1207.02 m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Orange Alert Level:</span>
                <span>1206.02 m</span>
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
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
