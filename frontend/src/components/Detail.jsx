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

  // Fixed approach: Focus on directly displaying the data as received
  const updateChartData = (actualData, predictedData) => {
    if (!actualData || !actualData.length) {
      setChartError("No chart data available");
      return;
    }

    // Log received data for debugging
    console.log("📊 Actual Data Sample:", actualData.slice(0, 2));
    console.log("🔮 Predicted Data Sample:", predictedData.slice(0, 2));

    // Simple processing to ensure valid data points
    const validActualData = actualData.filter(
      (entry) => entry.timestamp && !isNaN(new Date(entry.timestamp).getTime())
    );

    if (validActualData.length === 0) {
      setChartError("No valid actual data points found");
      return;
    }

    // Now prepare datasets in the expected format by Chart.js
    const datasets = [
      {
        label: "Actual Water Level (ft)",
        data: validActualData.map(entry => ({
          x: formatDateTime(entry.timestamp),
          y: entry.waterLevel
        })),
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
      }
    ];

    // Only add predicted dataset if valid data exists
    if (predictedData && predictedData.length > 0) {
      const validPredictedData = predictedData.filter(entry => 
        entry.timestamp && 
        !isNaN(new Date(entry.timestamp).getTime()) &&
        entry.predictedWaterLevel !== undefined && 
        entry.predictedWaterLevel !== null
      );

      console.log(`✅ Found ${validPredictedData.length} valid prediction points`);
      
      if (validPredictedData.length > 0) {
        datasets.push({
          label: "Predicted Water Level (ft)",
          data: validPredictedData.map(entry => ({
            x: formatDateTime(entry.timestamp),
            y: entry.predictedWaterLevel
          })),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 3,
        });
      }
    }

    // Create the chart data structure
    const formattedChartData = {
      datasets: datasets
    };

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
            
            if (!chartResponse?.data || chartResponse.data.length === 0) {
              setChartError("No chart data available");
              return;
            }
            
            let predictedData = [];
            try {
              const predictedResponse = await fetchPredictedDataById(nodeId, selectedRange);
              console.log("🔮 Prediction API response:", predictedResponse);
              
              if (predictedResponse?.data && Array.isArray(predictedResponse.data)) {
                // Success - we have prediction data
                predictedData = predictedResponse.data;
                setPredictedData([...predictedData]);
                console.log(`📊 Received ${predictedData.length} prediction data points`);
              } else {
                console.warn("⚠️ Prediction data has unexpected format:", predictedResponse);
              }
            } catch (predictionError) {
              console.warn("⚠️ Prediction data fetch failed:", predictionError);
            }

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

          {/* Debug Information */}
          {/* <div className="bg-zinc-900 p-4 rounded-lg mt-4 text-xs">
            <details>
              <summary className="cursor-pointer text-cyan-400 font-bold">Debug Information</summary>
              <pre className="mt-2 text-gray-300 overflow-auto max-h-40">
                {JSON.stringify({
                  hasActualData: chartData?.datasets?.[0]?.data?.length || 0,
                  hasPredictionData: chartData?.datasets?.[1]?.data?.length || 0,
                  predictedDataCount: predictedData.length,
                  predictedDataSample: predictedData.slice(0, 2)
                }, null, 2)}
              </pre>
            </details>
          </div> */}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Detail;