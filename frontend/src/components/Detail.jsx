import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApiCalls from "../hooks/useApiCalls";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Loading from "./Loading";
import DetailOverview from "./DetailOverview";
import DetailChart from "./DetailChart";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";

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

  // Define state variables
  const [nodeData, setNodeData] = useState(null);
  const [actualData, setActualData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);
  const [metadataError, setMetadataError] = useState(null);
  const [chartError, setChartError] = useState(null);
  const [selectedRange, setSelectedRange] = useState("2"); // Default: 10 Days

  // Function to fetch data based on selected range
  const fetchData = async (range) => {
    if (!nodeId) return;

    setMetadataError(null);
    setChartError(null);

    try {
        // Fetch Node Metadata
        const metaDataResponse = await fetchNodeMetaDataById(nodeId);
        if (metaDataResponse?.data) {
            setNodeData(metaDataResponse.data);
        } else {
            setMetadataError("No metadata available for this node.");
        }

        // Fetch Actual Water Levels based on selected range
        const actualResponse = await fetchNodeChartDataById(nodeId, range);
        if (actualResponse?.data) {
            setActualData(actualResponse.data);
        }

        // Fetch Predicted Water Levels (Handle 404 gracefully)
        try {
            const predictedResponse = await fetchPredictedDataById(nodeId, range);
            if (predictedResponse?.data) {
                setPredictedData(predictedResponse.data);
            }
        } catch (error) {
            if (error.response?.status === 404) {
                console.warn("🔍 Prediction data not found (404). Showing only actual data.");
                setPredictedData([]); // Ensure it's empty, but don't show an error
            } else {
                setChartError("Failed to load prediction data.");
            }
        }

        // If both actual & predicted data are missing, set chart error
        if ((!actualResponse?.data || actualResponse.data.length === 0) &&
            predictedData.length === 0) {
            setChartError("No actual or predicted water level data found.");
        }
    } catch (error) {
        setChartError("Failed to load chart data.");
    }
};


  // Fetch data on initial render and when selectedRange changes
  useEffect(() => {
    fetchData(selectedRange);
  }, [nodeId, selectedRange]);

  // // Debugging: Log fetched data
  // useEffect(() => {
  //   console.log("✅ Node Metadata:", nodeData);
  //   console.log("📊 Actual Water Level Data:", actualData);
  //   console.log("🔮 Predicted Water Level Data:", predictedData);
  // }, [nodeData, actualData, predictedData]);

  if (loading) return <Loading />;

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

          {nodeData && <DetailOverview nodeData={nodeData} />}

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
                onChange={(e) => setSelectedRange(e.target.value)}
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

          {chartError ? (
            <div className="bg-slate-800 p-4 rounded-lg text-center">
              <p className="text-yellow-400">{chartError}</p>
            </div>
          ) : actualData.length > 0 || predictedData.length > 0 ? (
            <DetailChart actualData={actualData} predictedData={predictedData} />
          ) : (
            <div className="bg-slate-800 p-4 rounded-lg text-center">
              <p className="text-yellow-400">No chart data available.</p>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Detail;
