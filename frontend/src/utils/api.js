import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Send text to backend for sentiment analysis
 * @param {string} text - Text to analyze
 * @returns {Promise<{sentiment: number, keywords: string[], emotion: string, confidence: number}>}
 */
export const analyzeSentiment = async (text) => {
  try {
    const response = await apiClient.post('/process_text', { text });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.detail || 'Failed to analyze sentiment');
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please check if backend is running.');
    } else {
      // Something else happened
      throw new Error('Failed to make request: ' + error.message);
    }
  }
};

/**
 * Check backend health
 * @returns {Promise<object>}
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export default apiClient;