import React from "react";
import { Line } from "react-chartjs-2";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";

const DetailChart = ({
  chartData,
  chartOptions,
  selectedRange,
  handleTimeRangeChange,
}) => {
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
          {chartData.labels.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <p>No chart data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailChart;
