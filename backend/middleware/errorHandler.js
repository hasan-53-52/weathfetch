// middleware/errorHandler.js
// Centralized error handling middleware

/**
 * Maps OpenWeatherMap HTTP status codes to user-friendly messages
 */
const OWM_ERRORS = {
  400: "Invalid request. Please check your input.",
  401: "API authentication failed. Please contact support.",
  404: "Location not found. Try a different city name or coordinates.",
  429: "Too many requests. Please try again in a moment.",
  500: "Weather service is temporarily unavailable.",
  503: "Weather service is down for maintenance.",
};

/**
 * Extracts meaningful error info from Axios errors (API proxy errors)
 */
const parseAxiosError = (err) => {
  if (err.response) {
    const status = err.response.status;
    const owmMessage = err.response.data?.message || null;
    const fallbackMessage = OWM_ERRORS[status] || "An unexpected error occurred.";
    return {
      status,
      message: owmMessage || fallbackMessage,
      source: "openweathermap",
    };
  }

  if (err.request) {
    return {
      status: 503,
      message: "Could not reach the weather service. Check your internet connection.",
      source: "network",
    };
  }

  return {
    status: 500,
    message: "Internal server error.",
    source: "server",
  };
};

/**
 * Global error handler middleware
 * Must be registered LAST in Express app
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.path}:`, err.message);

  // Handle Axios errors from API proxy calls
  if (err.isAxiosError) {
    const { status, message, source } = parseAxiosError(err);
    return res.status(status).json({
      success: false,
      error: { message, source, code: status },
    });
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: { message: err.message, source: "validation", code: 400 },
    });
  }

  // Generic fallback
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: {
      message: err.message || "An unexpected error occurred.",
      source: "server",
      code: status,
    },
  });
};

/**
 * 404 Not Found handler for unmatched routes
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.path} not found.`,
      source: "router",
      code: 404,
    },
  });
};

module.exports = { errorHandler, notFoundHandler };
