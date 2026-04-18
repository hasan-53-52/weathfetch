// src/components/ForecastCard.jsx

import React from "react";
import { getIconUrl, formatDay, formatDate, unitSymbol } from "../utils/weatherHelpers";

const ForecastCard = ({ data, units }) => {
  if (!data?.daily?.length) return null;

  const sym = unitSymbol(units);

  return (
    <div className="forecast-section">
      <h3 className="section-title">5-Day Forecast</h3>
      <div className="forecast-grid">
        {data.daily.slice(0, 5).map((day, i) => (
          <div key={i} className={`forecast-card ${i === 0 ? "forecast-card--today" : ""}`}>
            <span className="forecast-day">
              {i === 0 ? "Today" : formatDay(day.dt)}
            </span>
            <span className="forecast-date">{formatDate(day.dt)}</span>
            <img
              src={getIconUrl(day.icon, "2x")}
              alt={day.description}
              className="forecast-icon"
            />
            <span className="forecast-desc">{day.description}</span>
            <div className="forecast-temps">
              <span className="forecast-high">{day.temperature.max}{sym}</span>
              <span className="forecast-separator">/</span>
              <span className="forecast-low">{day.temperature.min}{sym}</span>
            </div>
            <div className="forecast-humidity">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" opacity="0.3"/>
                <path d="M12 2c0 0-6 7.5-6 12a6 6 0 0 0 12 0C18 9.5 12 2 12 2z" />
              </svg>
              {day.humidity}%
            </div>
          </div>
        ))}
      </div>

      {/* Hourly temperature strip */}
      <div className="hourly-section">
        <h3 className="section-title">24-Hour Outlook</h3>
        <div className="hourly-strip">
          {data.hourly.slice(0, 8).map((h, i) => {
            const time = new Date(h.dt * 1000).toLocaleTimeString("en-US", {
              hour: "numeric",
              hour12: true,
            });
            return (
              <div key={i} className="hourly-item">
                <span className="hourly-time">{i === 0 ? "Now" : time}</span>
                <img src={getIconUrl(h.icon)} alt={h.description} className="hourly-icon" />
                <span className="hourly-temp">{h.temperature}{sym}</span>
                <div className="hourly-pop">
                  {h.pop > 0 && (
                    <>
                      <span className="pop-dot" />
                      {Math.round(h.pop * 100)}%
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;
