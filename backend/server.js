// server.js
// WeathFetch Express backend — API proxy server

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const weatherRoutes = require("./routes/weather");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────
// Security & Middleware
// ─────────────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS — only allow your frontend origin
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Rate limiting — prevent abuse
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Too many requests. Please wait a moment and try again.",
      source: "rate-limit",
      code: 429,
    },
  },
});

app.use("/api", limiter);

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({
    name: "WeathFetch API",
    version: "1.0.0",
    status: "running",
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      currentWeather: "GET /api/weather/current?city=London&units=metric",
      forecast: "GET /api/weather/forecast?city=London&units=metric&days=5",
      search: "GET /api/weather/search?q=Lon",
      cacheStats: "GET /api/weather/cache/stats",
      cacheFlush: "DELETE /api/weather/cache",
    },
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), timestamp: Date.now() });
});

app.use("/api/weather", weatherRoutes);

// ─────────────────────────────────────────────
// Error Handling (must be last)
// ─────────────────────────────────────────────

app.use(notFoundHandler);
app.use(errorHandler);

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║       WeathFetch API Server          ║
╠══════════════════════════════════════╣
║  Port     : ${PORT}                      ║
║  Env      : ${(process.env.NODE_ENV || "development").padEnd(12)}           ║
║  API Key  : ${process.env.OPENWEATHER_API_KEY ? "✓ Configured" : "✗ MISSING"}              ║
╚══════════════════════════════════════╝
  `);
});

module.exports = app; // for testing
