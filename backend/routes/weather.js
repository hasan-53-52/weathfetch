// routes/weather.js
// All weather-related API proxy routes

const express = require("express");
const axios = require("axios");
const cache = require("../cache/weatherCache");

const router = express.Router();

const BASE_URL = process.env.OPENWEATHER_BASE_URL || "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.OPENWEATHER_API_KEY;

/**
 * Validate that the API key is configured
 */
const validateApiKey = (req, res, next) => {
  if (!API_KEY || API_KEY === "your_openweathermap_api_key_here") {
    return res.status(503).json({
      success: false,
      error: {
        message: "Weather API key is not configured on the server.",
        source: "config",
        code: 503,
      },
    });
  }
  next();
};

router.use(validateApiKey);

// ─────────────────────────────────────────────
// GET /api/weather/current?city=London&units=metric
// GET /api/weather/current?lat=51.5&lon=-0.12&units=metric
// ─────────────────────────────────────────────
router.get("/current", async (req, res, next) => {
  try {
    const { city, lat, lon, units = "metric" } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({
        success: false,
        error: { message: "Provide either 'city' or 'lat' and 'lon' query params.", code: 400 },
      });
    }

    const params = city
      ? { q: city, units, appid: API_KEY }
      : { lat, lon, units, appid: API_KEY };

    const cacheKey = cache.buildKey("current", { ...params, appid: undefined });
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ success: true, cached: true, data: cached });

    const { data } = await axios.get(`${BASE_URL}/weather`, { params });

    const normalized = {
      city: data.name,
      country: data.sys.country,
      coordinates: data.coord,
      weather: {
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      },
      temperature: {
        current: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        min: Math.round(data.main.temp_min),
        max: Math.round(data.main.temp_max),
      },
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      visibility: data.visibility ? Math.round(data.visibility / 1000) : null,
      wind: {
        speed: data.wind.speed,
        deg: data.wind.deg,
        gust: data.wind.gust || null,
      },
      clouds: data.clouds.all,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,
      units,
      fetchedAt: Date.now(),
    };

    cache.set(cacheKey, normalized);
    res.json({ success: true, cached: false, data: normalized });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────
// GET /api/weather/forecast?city=London&units=metric&days=5
// ─────────────────────────────────────────────
router.get("/forecast", async (req, res, next) => {
  try {
    const { city, lat, lon, units = "metric", days = 5 } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({
        success: false,
        error: { message: "Provide either 'city' or 'lat' and 'lon' query params.", code: 400 },
      });
    }

    const params = city
      ? { q: city, units, cnt: Math.min(parseInt(days) * 8, 40), appid: API_KEY }
      : { lat, lon, units, cnt: Math.min(parseInt(days) * 8, 40), appid: API_KEY };

    const cacheKey = cache.buildKey("forecast", { ...params, appid: undefined });
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ success: true, cached: true, data: cached });

    const { data } = await axios.get(`${BASE_URL}/forecast`, { params });

    // Group 3-hour forecasts into daily summaries
    const dailyMap = {};
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString("en-CA"); // YYYY-MM-DD
      if (!dailyMap[date]) {
        dailyMap[date] = { temps: [], icons: [], descriptions: [], humidity: [], wind: [], dt: item.dt };
      }
      dailyMap[date].temps.push(item.main.temp);
      dailyMap[date].icons.push(item.weather[0].icon);
      dailyMap[date].descriptions.push(item.weather[0].description);
      dailyMap[date].humidity.push(item.main.humidity);
      dailyMap[date].wind.push(item.wind.speed);
    });

    const daily = Object.entries(dailyMap).map(([date, d]) => ({
      date,
      dt: d.dt,
      temperature: {
        min: Math.round(Math.min(...d.temps)),
        max: Math.round(Math.max(...d.temps)),
        avg: Math.round(d.temps.reduce((a, b) => a + b, 0) / d.temps.length),
      },
      icon: d.icons[Math.floor(d.icons.length / 2)], // midday icon
      description: d.descriptions[Math.floor(d.descriptions.length / 2)],
      humidity: Math.round(d.humidity.reduce((a, b) => a + b, 0) / d.humidity.length),
      wind: +(d.wind.reduce((a, b) => a + b, 0) / d.wind.length).toFixed(1),
    }));

    // Also return hourly (raw 3-hour intervals) for charts
    const hourly = data.list.map((item) => ({
      dt: item.dt,
      time: new Date(item.dt * 1000).toISOString(),
      temperature: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      humidity: item.main.humidity,
      icon: item.weather[0].icon,
      description: item.weather[0].description,
      wind: item.wind.speed,
      pop: item.pop || 0, // probability of precipitation
    }));

    const normalized = {
      city: data.city.name,
      country: data.city.country,
      coordinates: data.city.coord,
      timezone: data.city.timezone,
      daily,
      hourly,
      units,
      fetchedAt: Date.now(),
    };

    cache.set(cacheKey, normalized);
    res.json({ success: true, cached: false, data: normalized });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────
// GET /api/weather/search?q=Lon  (city autocomplete)
// ─────────────────────────────────────────────
router.get("/search", async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: { message: "Query must be at least 2 characters.", code: 400 },
      });
    }

    const cacheKey = cache.buildKey("search", { q: q.trim().toLowerCase(), limit });
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ success: true, cached: true, data: cached });

    const { data } = await axios.get("https://api.openweathermap.org/geo/1.0/direct", {
      params: { q: q.trim(), limit, appid: API_KEY },
    });

    const results = data.map((loc) => ({
      name: loc.name,
      country: loc.country,
      state: loc.state || null,
      lat: loc.lat,
      lon: loc.lon,
    }));

    cache.set(cacheKey, results, 3600); // cache suggestions for 1 hour
    res.json({ success: true, cached: false, data: results });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────
// GET /api/weather/cache/stats  (debug endpoint)
// ─────────────────────────────────────────────
router.get("/cache/stats", (req, res) => {
  res.json({ success: true, data: cache.stats() });
});

// DELETE /api/weather/cache  (flush all cache)
router.delete("/cache", (req, res) => {
  cache.flush();
  res.json({ success: true, message: "Cache cleared." });
});

module.exports = router;
