// src/utils/api.js
// Centralized API client for WeathFetch backend

import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Response interceptor — unwrap data or throw structured error
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      "An unexpected error occurred.";
    const code = error.response?.status || 500;
    throw { message, code, raw: error };
  }
);

// ─────────────────────────────────────────────
// Weather API Methods
// ─────────────────────────────────────────────

/**
 * Fetch current weather by city name or coordinates
 */
export const getCurrentWeather = async ({ city, lat, lon, units = "metric" }) => {
  const params = city ? { city, units } : { lat, lon, units };
  return apiClient.get("/weather/current", { params });
};

/**
 * Fetch 5-day forecast
 */
export const getForecast = async ({ city, lat, lon, units = "metric", days = 5 }) => {
  const params = city ? { city, units, days } : { lat, lon, units, days };
  return apiClient.get("/weather/forecast", { params });
};

/**
 * Search city suggestions (autocomplete)
 */
export const searchCities = async (q, limit = 5) => {
  return apiClient.get("/weather/search", { params: { q, limit } });
};

export default apiClient;
