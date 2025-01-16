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

  const fetchNodeChartDataById = useCallback(async (nodeId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/v1/water-level/${nodeId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch water level for nodeId ${nodeId}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchNodeMetaData, fetchNodeMetaDataById, fetchNodeChartDataById, loading };
};

export default useApiCalls;
