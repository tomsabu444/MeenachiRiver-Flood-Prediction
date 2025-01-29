import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApiCalls from "../hooks/useApiCalls";
import DetailOverview from "./DetailOverview";
import DetailChart from "./DetailChart";
import { ThemeProvider, createTheme } from "@mui/material/styles";
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
import Loading from "./Loading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#06b6d4" },
    background: { paper: "#1e293b" },
    text: { primary: "#ffffff" },
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
    const date = new Date(timestamp);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(date);
  };

  const updateChartData = (data) => {
    if (!data || !data.length) return setChartData({ labels: [], datasets: [] });

    const validData = data.filter(
      (entry) => entry.timestamp && !isNaN(new Date(entry.timestamp).getTime())
    );

    const formattedChartData = {
      labels: validData.reverse().map((entry) => formatDateTime(entry.timestamp)),
      datasets: [
        {
          label: "Water Level (ft)",
          data: validData.map((entry) => entry.waterLevel),
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
    const fetchData = async () => {
      if (nodeId) {
        try {
          const metaDataResponse = await fetchNodeMetaDataById(nodeId);
          if (metaDataResponse?.data) {
            setNodeData(metaDataResponse.data);
          }
        } catch (error) {
          console.error("Error fetching node metadata:", error);
        }
  
        try {
          const chartResponse = await fetchNodeChartDataById(nodeId, selectedRange);
          if (chartResponse?.data) {
            updateChartData(chartResponse.data);
          } else {
            setChartData(null);
          }
        } catch (error) {
          console.error("Error fetching chart data:", error);
          setChartData(null);
        }
      }
    };
  
    fetchData();
  }, [nodeId, selectedRange, fetchNodeMetaDataById, fetchNodeChartDataById]);
  

  if (loading) return <Loading/>;
  if (!nodeData || !chartData) return <div>No data available for this node.</div>;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: { mode: "index", intersect: false },
      legend: { position: "top" },
    },
    scales: {
      x: { ticks: { color: "#fff" }, grid: { color: "rgba(255, 255, 255, 0.1)" } },
      y: { ticks: { color: "#fff" }, grid: { color: "rgba(255, 255, 255, 0.1)" } },
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-slate-700 text-white p-6 font-roboto">
        <div className="max-w-[1500px] mx-auto space-y-6">
          <h1 className="text-3xl font-bold border-b pb-2">
            {nodeData.locationName || "Unknown Location"}
          </h1>
          <DetailOverview nodeData={nodeData} formatDateTime={formatDateTime} />
          <DetailChart
            chartData={chartData}
            chartOptions={chartOptions}
            selectedRange={selectedRange}
            handleTimeRangeChange={(e) => setSelectedRange(e.target.value)}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Detail;
