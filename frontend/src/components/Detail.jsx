import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApiCalls from "../hooks/useApiCalls";
import DetailOverview from "./DetailOverview";
import DetailChart from "./DetailChart";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Loading from "./Loading";

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
  const { fetchNodeMetaDataById, fetchNodeChartDataById, fetchPredictedDataById, loading } = useApiCalls();
  const [nodeData, setNodeData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [predictedData, setPredictedData] = useState([]);
  const [selectedRange, setSelectedRange] = useState("1");
  const [chartError, setChartError] = useState(null);
  const [metadataError, setMetadataError] = useState(null);

  // Reset data when `nodeId` changes to trigger a re-render
  useEffect(() => {
    setNodeData(null);
    setChartData(null);
    setPredictedData([]);
  }, [nodeId]);

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

  // Updated: Better handling of chart data with or without predictions
  const updateChartData = (actualData, predictedData) => {
    if (!actualData || !actualData.length) {
      setChartError("No chart data available");
      return;
    }

    const validActualData = actualData.filter(
      (entry) => entry.timestamp && !isNaN(new Date(entry.timestamp).getTime())
    );

    if (validActualData.length === 0) {
      setChartError("No valid actual data points found");
      return;
    }

    // Always create a valid chart with actual data
    const formattedChartData = {
      labels: validActualData.map((entry) => formatDateTime(entry.timestamp)).reverse(),
      datasets: [
        {
          label: "Actual Water Level (ft)",
          data: validActualData.map((entry) => entry.waterLevel).reverse(),
          borderColor: "#06b6d4",
          backgroundColor: "rgba(6, 182, 212, 0.2)",
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 3,
        }
      ]
    };

    // Only add predicted dataset if we have valid prediction data
    if (predictedData && predictedData.length > 0) {
      const validPredictedData = predictedData.filter(
        (entry) => 
          entry.timestamp && 
          !isNaN(new Date(entry.timestamp).getTime()) && 
          entry.predictedWaterLevel !== undefined && 
          entry.predictedWaterLevel !== null
      );

      if (validPredictedData.length > 0) {
        formattedChartData.datasets.push({
          label: "Predicted Water Level (ft)",
          data: validPredictedData.map((entry) => entry.predictedWaterLevel).reverse(),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 3,
        });
      }
    }

    setChartData(formattedChartData);
    setChartError(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (nodeId) {
        setMetadataError(null);
        setChartError(null);

        console.log(`🔍 Fetching data for nodeId: ${nodeId}, Range: ${selectedRange}`);

        const fetchMetadata = async () => {
          try {
            const metaDataResponse = await fetchNodeMetaDataById(nodeId);
            if (metaDataResponse?.data) {
              setNodeData({ ...metaDataResponse.data });
            } else {
              setMetadataError("No metadata available for this node");
            }
          } catch (error) {
            console.error("❌ Error fetching node metadata:", error);
            setMetadataError("Failed to load node information");
          }
        };

        const fetchChartData = async () => {
          try {
            const chartResponse = await fetchNodeChartDataById(nodeId, selectedRange);
            
            // Handle case where actual data exists but prediction might fail
            if (!chartResponse?.data || chartResponse.data.length === 0) {
              setChartError("No chart data available");
              return;
            }
            
            // Try to fetch prediction data, but proceed even if it fails
            let predictedData = [];
            try {
              const predictedResponse = await fetchPredictedDataById(nodeId, selectedRange);
              if (predictedResponse?.data && predictedResponse.data.length > 0) {
                predictedData = predictedResponse.data;
                setPredictedData([...predictedData]);
              }
            } catch (predictionError) {
              console.warn("⚠️ Prediction data unavailable:", predictionError);
              // Continue with only actual data
            }

            // Always update chart with actual data, with or without predictions
            updateChartData(chartResponse.data, predictedData);
            
          } catch (error) {
            console.error("❌ Error fetching chart data:", error);
            setChartError("Failed to load chart data");
          }
        };

        await Promise.allSettled([fetchMetadata(), fetchChartData()]);
      }
    };

    fetchData();
  }, [nodeId, selectedRange, fetchNodeMetaDataById, fetchNodeChartDataById, fetchPredictedDataById]);

  if (loading) return <Loading />;

  const latestPrediction = predictedData.length > 0 ? predictedData[0] : null;

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-slate-700 text-white p-6 font-roboto">
        <div className="max-w-[1500px] mx-auto space-y-6">
          <h1 className="text-3xl font-bold border-b pb-2">
            {nodeData?.locationName || "Unknown Location"}
          </h1>

          {metadataError && (
            <div className="bg-slate-800 p-4 rounded-lg text-center">
              <p className="text-yellow-400">{metadataError}</p>
            </div>
          )}

          {nodeData && (
            <DetailOverview
              key={nodeId}
              nodeData={{ ...nodeData, latestPrediction }}
              formatDateTime={formatDateTime}
            />
          )}

          {chartError ? (
            <div className="bg-slate-800 p-4 rounded-lg text-center">
              <p className="text-yellow-400">{chartError}</p>
            </div>
          ) : (
            chartData && (
              <DetailChart
                chartData={chartData}
                selectedRange={selectedRange}
                handleTimeRangeChange={(e) => setSelectedRange(e.target.value)}
              />
            )
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Detail;