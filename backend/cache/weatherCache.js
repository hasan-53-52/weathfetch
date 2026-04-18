// cache/weatherCache.js
// In-memory caching layer using node-cache
// Reduces redundant API calls and improves response times

const NodeCache = require("node-cache");

const cache = new NodeCache({
  stdTTL: parseInt(process.env.CACHE_TTL) || 600, // default 10 minutes
  maxKeys: parseInt(process.env.CACHE_MAX_KEYS) || 500,
  checkperiod: 120, // check for expired keys every 2 minutes
  useClones: false,
});

/**
 * Generate a consistent cache key from query params
 */
const buildKey = (prefix, params) => {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return `${prefix}:${sorted}`;
};

/**
 * Get a cached value
 */
const get = (key) => {
  try {
    const value = cache.get(key);
    if (value !== undefined) {
      console.log(`[Cache HIT] ${key}`);
      return value;
    }
    console.log(`[Cache MISS] ${key}`);
    return null;
  } catch (err) {
    console.error("[Cache] Get error:", err.message);
    return null;
  }
};

/**
 * Set a cached value with optional TTL override
 */
const set = (key, value, ttl = null) => {
  try {
    if (ttl) {
      cache.set(key, value, ttl);
    } else {
      cache.set(key, value);
    }
    console.log(`[Cache SET] ${key}`);
  } catch (err) {
    console.error("[Cache] Set error:", err.message);
  }
};

/**
 * Delete a specific cache key
 */
const del = (key) => {
  cache.del(key);
};

/**
 * Flush all cached entries
 */
const flush = () => {
  cache.flushAll();
  console.log("[Cache] Flushed all entries");
};

/**
 * Get cache statistics
 */
const stats = () => cache.getStats();

module.exports = { get, set, del, flush, stats, buildKey };
