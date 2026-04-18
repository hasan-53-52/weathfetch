// src/components/CurrentWeather.jsx

import React from "react";
import {
  getIconUrl,
  windDirection,
  formatTime,
  unitSymbol,
  speedUnit,
  humidityLabel,
} from "../utils/weatherHelpers";

const StatCard = ({ label, value, sub }) => (
  <div className="stat-card">
    <span className="stat-label">{label}</span>
    <span className="stat-value">{value}</span>
    {sub && <span className="stat-sub">{sub}</span>}
  </div>
);

const CurrentWeather = ({ data, units }) => {
  if (!data) return null;

  const sym = unitSymbol(units);
  const spd = speedUnit(units);

  const sunriseTime = formatTime(data.sunrise, data.timezone);
  const sunsetTime = formatTime(data.sunset, data.timezone);

  return (
    <div className="current-weather">
      {/* Header */}
      <div className="current-header">
        <div className="current-location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <h2>{data.city}, {data.country}</h2>
        </div>
        <p className="current-coords">
          {data.coordinates.lat.toFixed(2)}°N, {data.coordinates.lon.toFixed(2)}°E
        </p>
      </div>

      {/* Main temp block */}
      <div className="current-main">
        <div className="current-icon-block">
          <img
            src={getIconUrl(data.weather.icon, "4x")}
            alt={data.weather.description}
            className="weather-icon-large"
          />
          <p className="current-description">{data.weather.description}</p>
        </div>
        <div className="current-temp-block">
          <div className="current-temp">
            {data.temperature.current}
            <span className="temp-unit">{sym}</span>
          </div>
          <p className="current-feels">
            Feels like {data.temperature.feelsLike}{sym}
          </p>
          <p className="current-range">
            ↑ {data.temperature.max}{sym} &nbsp; ↓ {data.temperature.min}{sym}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        <StatCard
          label="Humidity"
          value={`${data.humidity}%`}
          sub={humidityLabel(data.humidity)}
        />
        <StatCard
          label="Wind"
          value={`${data.wind.speed} ${spd}`}
          sub={windDirection(data.wind.deg)}
        />
        <StatCard
          label="Pressure"
          value={`${data.pressure}`}
          sub="hPa"
        />
        <StatCard
          label="Visibility"
          value={data.visibility ? `${data.visibility} km` : "N/A"}
          sub="Visibility"
        />
        <StatCard
          label="Cloud Cover"
          value={`${data.clouds}%`}
          sub="Clouds"
        />
        {data.wind.gust && (
          <StatCard
            label="Wind Gust"
            value={`${data.wind.gust} ${spd}`}
            sub="Gust"
          />
        )}
      </div>

      {/* Sun times */}
      <div className="sun-times">
        <div className="sun-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <div>
            <span className="sun-label">Sunrise</span>
            <span className="sun-time">{sunriseTime}</span>
          </div>
        </div>
        <div className="sun-divider" />
        <div className="sun-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 18a5 5 0 0 0-10 0" />
            <line x1="12" y1="2" x2="12" y2="9" />
            <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
            <line x1="1" y1="18" x2="3" y2="18" />
            <line x1="21" y1="18" x2="23" y2="18" />
            <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
          </svg>
          <div>
            <span className="sun-label">Sunset</span>
            <span className="sun-time">{sunsetTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
