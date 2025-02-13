import React, { useState, useEffect } from "react";
import useApiCalls from "../hooks/useApiCalls"; // Assuming the hook is in hooks folder

function AlertPage() {
  const { fetchNodeMetaData, postAlertPreferences, loading } = useApiCalls();  // Using custom hook
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    locations: [],  // Storing nodeIds
  });
  const [nodeMetadata, setNodeMetadata] = useState([]);

  // Fetch the node metadata when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchNodeMetaData();
        setNodeMetadata(data.data); // Assuming data.data contains the array of node metadata
      } catch (error) {
        console.error("Error fetching node metadata:", error);
      }
    };
    fetchData();
  }, [fetchNodeMetaData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (nodeId) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.includes(nodeId)
        ? prev.locations.filter(id => id !== nodeId)
        : [...prev.locations, nodeId] // Store nodeId instead of locationName
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the postAlertPreferences function from the custom hook
      const response = await postAlertPreferences(formData.email, formData.phone, formData.locations);
      console.log("Alert preferences submitted:", response);
      // Handle successful submission, maybe show a success message
    } catch (error) {
      console.error("Error submitting alert preferences:", error);
      // Handle error, show error message
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black relative overflow-hidden p-4 mt-16 sm:mt-0">
      {/* Background Design */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute w-3/4 h-3/4 bg-gradient-to-r from-gray-900 to-black rounded-full blur-3xl opacity-30"></div>
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gray-800 rounded-full blur-2xl opacity-20"></div>

      <div className="relative bg-gray-800 p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-[600px] text-gray-100 my-4" style={{ fontFamily: 'SF Pro Display, Helvetica, Arial, sans-serif' }}>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center text-gray-100">Alert</h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-300 text-base sm:text-lg mb-2">Email ID:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 appearance-none shadow-md cursor-pointer border-gray-600 text-base sm:text-lg"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-300 text-base sm:text-lg mb-2">Phone Number:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 appearance-none shadow-md cursor-pointer border-gray-600 text-base sm:text-lg"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 text-base sm:text-lg mb-2">Locations for Alerts:</label>
            <div className="bg-gray-700 rounded-lg border border-gray-600 p-3 sm:p-4 max-h-36 sm:max-h-48 overflow-y-auto">
              {nodeMetadata.length === 0 ? (
                <div className="text-center text-gray-400">Loading location data...</div>
              ) : (
                nodeMetadata.map((node) => (
                  <div key={node.nodeId} className="mb-2 last:mb-0">
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-600 p-2 rounded-lg">
                      <input
                        type="checkbox"
                        checked={formData.locations.includes(node.nodeId)} // Check by nodeId
                        onChange={() => handleLocationChange(node.nodeId)} // Pass nodeId
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-500 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-gray-200 text-base sm:text-lg">{node.locationName}</span>
                    </label>
                  </div>
                ))
              )}
            </div>
            <div className="mt-2 flex items-center justify-between text-gray-400">
              <span className="text-xs sm:text-sm">Selected Locations: {formData.locations.length}</span>
              {formData.locations.length > 0 && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, locations: [] }))}
                  className="text-xs sm:text-sm text-blue-400 hover:text-blue-300"
                >
                  Clear All
                </button>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Select one or more locations to receive alerts specific to those areas. You'll be informed about important events, updates, and emergencies in your chosen locations.
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-lg hover:bg-blue-500 transition transform hover:scale-105 duration-300 shadow-lg text-base sm:text-lg font-semibold"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AlertPage;