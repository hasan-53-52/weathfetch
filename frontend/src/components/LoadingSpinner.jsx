// src/components/LoadingSpinner.jsx

import React from "react";

const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-ring">
      <div className="loading-ring-segment" />
      <div className="loading-ring-segment" />
      <div className="loading-ring-segment" />
    </div>
    <p className="loading-text">Fetching weather data…</p>
  </div>
);

export default LoadingSpinner;
