// src/App.jsx
// WeathFetch — Main application component

import React, { useEffect } from "react";
import { useWeather } from "./hooks/useWeather";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import ForecastCard from "./components/ForecastCard";
import ErrorBanner from "./components/ErrorBanner";
import LoadingSpinner from "./components/LoadingSpinner";
import { weatherGradient } from "./utils/weatherHelpers";

const App = () => {
  const {
    current,
    forecast,
    loading,
    error,
    units,
    suggestions,
    suggestionsLoading,
    fetchWeather,
    fetchByLocation,
    toggleUnits,
    searchCity,
    clearSuggestions,
    clearError,
  } = useWeather();

  // Load a default city on first mount
  useEffect(() => {
    fetchWeather({ city: "London" });
  }, []); // eslint-disable-line

  const gradient = current ? weatherGradient(current.weather.main) : "from-zinc-900 via-red-950 to-black";

  return (
    <div className={`app bg-gradient-to-br ${gradient}`}>
      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Grid lines decoration */}
      <div className="grid-decoration" />

      <div className="app-container">

        {/* Header */}
        <header className="app-header">
          <div className="logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
            </svg>
            <span className="logo-text">Weath<em>Fetch</em></span>
          </div>

          <div className="header-controls">
            <button className="units-toggle" onClick={toggleUnits} title="Toggle temperature units">
              <span className={units === "metric" ? "active" : ""}>°C</span>
              <span className="toggle-divider">|</span>
              <span className={units === "imperial" ? "active" : ""}>°F</span>
            </button>
          </div>
        </header>

        {/* Search */}
        <div className="search-section">
          <SearchBar
            onSearch={fetchWeather}
            onLocationClick={fetchByLocation}
            onInputChange={searchCity}
            suggestions={suggestions}
            suggestionsLoading={suggestionsLoading}
            onSuggestionSelect={(sug) => fetchWeather({ lat: sug.lat, lon: sug.lon })}
            onClearSuggestions={clearSuggestions}
          />
        </div>

        {/* Error */}
        <ErrorBanner message={error} onDismiss={clearError} />

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Content */}
        {!loading && current && (
          <main className="weather-content">
            <CurrentWeather data={current} units={units} />
            <ForecastCard data={forecast} units={units} />
          </main>
        )}

        {/* Empty state */}
        {!loading && !current && !error && (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
            </svg>
            <p>Search for a city to get started</p>
          </div>
        )}

        <footer className="app-footer">
          <span>Powered by OpenWeatherMap</span>
          <span className="footer-dot">·</span>
          <span>WeathFetch {new Date().getFullYear()}</span>
        </footer>
      </div>
    </div>
  );
};

export default App;
