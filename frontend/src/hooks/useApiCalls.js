import { useState, useCallback } from "react";
import axios from "axios";
import { SERVER_BASE_URL } from "../config/Backend_URL";
/**
 * Custom hook to handle API calls for fetching categories, manufacturers, and submitting data.
 * @returns {Object} - Methods for API calls and loading state.
 */
const useApiCalls = () => {
  const [loading, setLoading] = useState(false);

  const fetchNodeMetaData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/v1/node-metadata`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error;
    }
  }, []);

  

  return { fetchNodeMetaData, loading };
};

export default useApiCalls;
