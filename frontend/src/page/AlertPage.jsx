import React, { useState, useEffect } from "react";
import useApiCalls from "../hooks/useApiCalls"; 
import { Snackbar, Alert } from "@mui/material"; 
import { useNavigate } from "react-router-dom";
import { parsePhoneNumberFromString, AsYouType, getCountries, getCountryCallingCode } from 'libphonenumber-js';

function AlertPage() {
  const { fetchNodeMetaData, postAlertPreferences, loading } = useApiCalls(); 
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    countryCode: "IN", // Default country code set to India
    locations: [],  // Storing nodeIds
  });
  const [nodeMetadata, setNodeMetadata] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); 
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); 
  const [phoneInputValue, setPhoneInputValue] = useState("");
  const [countries, setCountries] = useState([]);

  // Fetch the node metadata when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchNodeMetaData();
        setNodeMetadata(data.data);
      } catch (error) {
        console.error("Error fetching node metadata:", error);
      }
    };
    fetchData();

    // Get list of countries for dropdown
    setCountries(getCountries());
  }, [fetchNodeMetaData]);

  // Update phone when country code changes
  useEffect(() => {
    if (phoneInputValue) {
      updatePhoneWithCountryCode(phoneInputValue);
    }
  }, [formData.countryCode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    // Only allow digits
    const digitsOnly = input.replace(/\D/g, '');
    setPhoneInputValue(digitsOnly);
    updatePhoneWithCountryCode(digitsOnly);
  };

  const handlePhoneBlur = (e) => {
    // When the field loses focus, check for autofill patterns
    const value = e.target.value;
    
    // Check if there's a full phone number with country code that might be autofilled
    const match = value.match(/^\+(\d+)0?(\d+)$/);
    if (match) {
      const countryCodePart = match[1];
      const numberPart = match[2];
      
      // Find the country in our list
      const country = countries.find(c => getCountryCallingCode(c) === countryCodePart);
      
      if (country) {
        // Update the country code dropdown
        setFormData(prev => ({
          ...prev, 
          countryCode: country
        }));
        
        // Remove any leading zeros
        setPhoneInputValue(numberPart);
        
        // Update the full phone with correct format
        setFormData(prev => ({
          ...prev,
          phone: `+${countryCodePart}${numberPart}`
        }));
      }
    }
  };

  const updatePhoneWithCountryCode = (phoneInput) => {
    // Handle case where user or autofill might add a leading 0
    const sanitizedInput = phoneInput.replace(/^0/, '');
    
    // Format without spaces, just +[countrycode][number]
    try {
      const countryCode = getCountryCallingCode(formData.countryCode);
      setFormData(prev => ({
        ...prev,
        phone: `+${countryCode}${sanitizedInput}`
      }));
    } catch (error) {
      console.error("Error formatting phone number:", error);
    }
  };

  const handleCountryChange = (e) => {
    setFormData({ ...formData, countryCode: e.target.value });
  };

  const handleLocationChange = (nodeId) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.includes(nodeId)
        ? prev.locations.filter(id => id !== nodeId)
        : [...prev.locations, nodeId] 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the postAlertPreferences function with the complete phone number
      const response = await postAlertPreferences(
        formData.email, 
        formData.phone, // Contains country code + phone number without spaces
        formData.locations
      );
      console.log("Alert preferences submitted:", response);
      
      // Set success message
      setSnackbarMessage("Your alert preferences have been successfully submitted!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Clear the form
      setFormData({
        email: "",
        phone: "",
        countryCode: "IN", // Reset to India as default
        locations: [],
      });
      setPhoneInputValue("");

      setTimeout(() => {
        navigate("/"); 
      }, 2000);
    } catch (error) {
      console.error("Error submitting alert preferences:", error);
      setSnackbarMessage("Error submitting alert preferences. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Get country name for display
  const getCountryName = (countryCode) => {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    try {
      return regionNames.of(countryCode);
    } catch (e) {
      return countryCode;
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
          <div>
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
          
          <div>
            <label className="block text-gray-300 text-base sm:text-lg mb-2">Phone Number:</label>
            <div className="flex space-x-2">
              <div className="w-1/3">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleCountryChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 appearance-none shadow-md cursor-pointer border-gray-600 text-base sm:text-lg"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {getCountryName(country)} (+{getCountryCallingCode(country)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-2/3">
                <input
                  type="tel"
                  value={phoneInputValue}
                  onChange={handlePhoneChange}
                  onBlur={handlePhoneBlur}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 appearance-none shadow-md cursor-pointer border-gray-600 text-base sm:text-lg"
                  placeholder="Phone number (digits only)"
                  required
                />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Full number: {formData.phone || `+${getCountryCallingCode(formData.countryCode)}`}
            </p>
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
                        checked={formData.locations.includes(node.nodeId)} 
                        onChange={() => handleLocationChange(node.nodeId)} 
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

      {/* Snackbar for Success/Failure message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default AlertPage;