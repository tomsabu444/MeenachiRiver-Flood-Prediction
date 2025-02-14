import { useState, useCallback } from "react";
import axios from "axios";
import { SERVER_BASE_URL } from "../config/Backend_URL";

/**
 * Custom hook to handle API calls
 * @returns {Object} - Methods for API calls and loading state.
 */
const useApiCalls = () => {
  const [loading, setLoading] = useState(false);

  // Fetch all node metadata
  const fetchNodeMetaData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/v1/node-metadata`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single node metadata by nodeId
  const fetchNodeMetaDataById = useCallback(async (nodeId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/v1/node-metadata/${nodeId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch data for nodeId ${nodeId}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNodeChartDataById = useCallback(async (nodeId, range = "1") => {
    setLoading(true);
    try {
      // Pass the time range as a query parameter
      const response = await axios.get(
        `${SERVER_BASE_URL}/v1/water-level/${nodeId}?range=${range}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch water level for nodeId ${nodeId}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

    // POST request to submit alert preferences
    const postAlertPreferences = useCallback(async (email, phone, locations) => {
      setLoading(true);
      try {
        const response = await axios.post(`${SERVER_BASE_URL}/v1/alert`, {
          email,
          phone,
          locations,
        });
        return response.data; // Returns the response data from the backend
      } catch (error) {
        console.error("Failed to submit alert preferences:", error);
        throw error; // Propagate error to be handled by the caller
      } finally {
        setLoading(false);
      }
    }, []);
  

  return { fetchNodeMetaData, fetchNodeMetaDataById, fetchNodeChartDataById, postAlertPreferences, loading };
};

export default useApiCalls;
