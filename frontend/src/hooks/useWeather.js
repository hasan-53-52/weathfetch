// src/hooks/useWeather.js
// Custom hook managing all weather data fetching and state

import { useState, useCallback, useRef } from "react";
import { getCurrentWeather, getForecast, searchCities } from "../utils/api";

const DEFAULT_UNITS = process.env.REACT_APP_DEFAULT_UNITS || "metric";

const initialState = {
  current: null,
  forecast: null,
  loading: false,
  error: null,
  units: DEFAULT_UNITS,
  lastQuery: null,
};

export const useWeather = () => {
  const [state, setState] = useState(initialState);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const searchDebounceRef = useRef(null);

  const setPartial = (patch) => setState((prev) => ({ ...prev, ...patch }));

  /**
   * Fetch current weather + forecast together
   */
  const fetchWeather = useCallback(
    async (query) => {
      setPartial({ loading: true, error: null });

      const { city, lat, lon } = query;
      const units = state.units;

      try {
        const [currentRes, forecastRes] = await Promise.all([
          getCurrentWeather({ city, lat, lon, units }),
          getForecast({ city, lat, lon, units }),
        ]);

        setPartial({
          current: currentRes.data,
          forecast: forecastRes.data,
          loading: false,
          lastQuery: query,
        });
      } catch (err) {
        setPartial({
          loading: false,
          error: err.message || "Failed to fetch weather data.",
          current: null,
          forecast: null,
        });
      }
    },
    [state.units]
  );

  /**
   * Detect user geolocation and fetch weather
   */
  const fetchByLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setPartial({ error: "Geolocation is not supported by your browser." });
      return;
    }

    setPartial({ loading: true, error: null });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => {
        setPartial({
          loading: false,
          error: "Location access denied. Please search for a city manually.",
        });
      },
      { timeout: 8000 }
    );
  }, [fetchWeather]);

  /**
   * Toggle units and re-fetch if data exists
   */
  const toggleUnits = useCallback(() => {
    const newUnits = state.units === "metric" ? "imperial" : "metric";
    setState((prev) => ({ ...prev, units: newUnits }));

    if (state.lastQuery) {
      // Re-fetch with new units after state updates
      setTimeout(() => {
        fetchWeather(state.lastQuery);
      }, 0);
    }
  }, [state.units, state.lastQuery, fetchWeather]);

  /**
   * Debounced city search for autocomplete
   */
  const searchCity = useCallback((query) => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setSuggestionsLoading(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const res = await searchCities(query.trim());
        setSuggestions(res.data || []);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 350);
  }, []);

  const clearSuggestions = () => setSuggestions([]);
  const clearError = () => setPartial({ error: null });

  return {
    ...state,
    suggestions,
    suggestionsLoading,
    fetchWeather,
    fetchByLocation,
    toggleUnits,
    searchCity,
    clearSuggestions,
    clearError,
  };
};
