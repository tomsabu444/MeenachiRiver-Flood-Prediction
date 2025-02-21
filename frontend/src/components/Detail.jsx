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

  const updateChartData = (actualData, predictedData) => {
    if (!actualData || !actualData.length) {
      setChartError("No chart data available");
      return;
    }

    console.log("📊 Actual Data Sample:", actualData.slice(0, 2));
    console.log("🔮 Predicted Data Sample:", predictedData.slice(0, 2));

    const validActualData = actualData.filter(
      (entry) => entry.timestamp && !isNaN(new Date(entry.timestamp).getTime())
    );

    if (validActualData.length === 0) {
      setChartError("No valid actual data points found");
      return;
    }

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

    const formattedChartData = { datasets };
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
              <div className="space-y-6">
                <DetailChart
                  chartData={chartData}
                  selectedRange={selectedRange}
                  handleTimeRangeChange={(e) => setSelectedRange(e.target.value)}
                  chartType="actual"
                />
                <DetailChart
                  chartData={chartData}
                  selectedRange={selectedRange}
                  handleTimeRangeChange={(e) => setSelectedRange(e.target.value)}
                  chartType="predicted"
                />
              </div>
            )
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Detail;