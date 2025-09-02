import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens (if needed)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Dashboard Overview
  async getDashboardOverview() {
    try {
      const response = await api.get('/api/dashboard/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw error;
    }
  },

  // Lead Scoring
  async getLeadScoring() {
    try {
      const response = await api.get('/api/leads/scoring');
      return response.data;
    } catch (error) {
      console.error('Error fetching lead scoring:', error);
      throw error;
    }
  },

  // Performance Trends
  async getPerformanceTrends() {
    try {
      const response = await api.get('/api/performance/trends');
      return response.data;
    } catch (error) {
      console.error('Error fetching performance trends:', error);
      throw error;
    }
  },

  // Revenue Forecasting
  async getRevenueForecast() {
    try {
      const response = await api.get('/api/forecasting/revenue');
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue forecast:', error);
      throw error;
    }
  },

  // AI Recommendations
  async getAIRecommendations() {
    try {
      const response = await api.get('/api/insights/recommendations');
      return response.data;
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      throw error;
    }
  },

  // Pipeline Stages
  async getPipelineStages() {
    try {
      const response = await api.get('/api/pipeline/stages');
      return response.data;
    } catch (error) {
      console.error('Error fetching pipeline stages:', error);
      throw error;
    }
  },

  // Create Lead
  async createLead(leadData) {
    try {
      const response = await api.post('/api/leads', leadData);
      return response.data;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },

  // Health Check
  async healthCheck() {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Error checking API health:', error);
      throw error;
    }
  }
};

export default api;