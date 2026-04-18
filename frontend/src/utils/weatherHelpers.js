// src/utils/weatherHelpers.js
// Helper functions for formatting, icons, and conversions

/**
 * Returns an OpenWeatherMap icon URL
 */
export const getIconUrl = (iconCode, size = "2x") =>
  `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;

/**
 * Wind direction from degrees
 */
export const windDirection = (deg) => {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
};

/**
 * Format Unix timestamp to readable time
 */
export const formatTime = (unix, timezone = 0) => {
  const date = new Date((unix + timezone) * 1000);
  return date.toUTCString().slice(17, 22); // HH:MM
};

/**
 * Format Unix timestamp to short day name
 */
export const formatDay = (unix) => {
  return new Date(unix * 1000).toLocaleDateString("en-US", { weekday: "short" });
};

/**
 * Format Unix timestamp to full date
 */
export const formatDate = (unix) => {
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

/**
 * Temperature unit symbols
 */
export const unitSymbol = (units) => {
  const map = { metric: "°C", imperial: "°F", standard: "K" };
  return map[units] || "°C";
};

/**
 * Speed unit labels
 */
export const speedUnit = (units) => (units === "imperial" ? "mph" : "m/s");

/**
 * UV Index label
 */
export const uvLabel = (uvi) => {
  if (uvi <= 2) return { label: "Low", color: "#4ade80" };
  if (uvi <= 5) return { label: "Moderate", color: "#facc15" };
  if (uvi <= 7) return { label: "High", color: "#f97316" };
  if (uvi <= 10) return { label: "Very High", color: "#ef4444" };
  return { label: "Extreme", color: "#a855f7" };
};

/**
 * Map weather condition to a background gradient class
 */
export const weatherGradient = (main) => {
  const map = {
    Clear: "from-amber-900 via-red-950 to-black",
    Clouds: "from-zinc-800 via-red-950 to-black",
    Rain: "from-slate-900 via-red-950 to-black",
    Drizzle: "from-slate-800 via-zinc-900 to-black",
    Thunderstorm: "from-zinc-900 via-red-900 to-black",
    Snow: "from-slate-700 via-zinc-900 to-black",
    Mist: "from-zinc-700 via-zinc-900 to-black",
    Fog: "from-zinc-700 via-zinc-900 to-black",
    Haze: "from-zinc-700 via-red-950 to-black",
    Smoke: "from-zinc-800 via-zinc-900 to-black",
    Dust: "from-amber-900 via-zinc-900 to-black",
    Sand: "from-amber-800 via-zinc-900 to-black",
  };
  return map[main] || "from-zinc-900 via-red-950 to-black";
};

/**
 * Humidity comfort label
 */
export const humidityLabel = (h) => {
  if (h < 30) return "Dry";
  if (h < 50) return "Comfortable";
  if (h < 70) return "Humid";
  return "Very Humid";
};

/**
 * Debounce utility
 */
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
