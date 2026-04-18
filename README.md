# ⛅ WeathFetch

A production-ready Weather Forecast Application built with **React.js** (frontend) and **Node.js + Express** (backend), proxying the **OpenWeatherMap API** securely.

---

## 🗂 Project Structure

```
weathfetch/
├── backend/                    # Node.js + Express API proxy
│   ├── cache/
│   │   └── weatherCache.js     # In-memory caching (node-cache)
│   ├── middleware/
│   │   └── errorHandler.js     # Centralized error handling
│   ├── routes/
│   │   └── weather.js          # /api/weather/* endpoints
│   ├── server.js               # Express entry point
│   ├── .env.example            # Environment variable template
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # React.js SPA
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx       # City search + autocomplete
│   │   │   ├── CurrentWeather.jsx  # Current conditions card
│   │   │   ├── ForecastCard.jsx    # 5-day + 24-hour forecast
│   │   │   ├── ErrorBanner.jsx     # Error display
│   │   │   └── LoadingSpinner.jsx  # Loading state
│   │   ├── hooks/
│   │   │   └── useWeather.js       # Custom hook — all data logic
│   │   ├── utils/
│   │   │   ├── api.js              # Axios client wrapper
│   │   │   └── weatherHelpers.js   # Formatters, icons, conversions
│   │   ├── App.jsx                 # Root component
│   │   ├── index.css               # Global styles (black/red theme)
│   │   └── index.js                # React DOM entry
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml          # Full-stack Docker orchestration
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- An [OpenWeatherMap API key](https://openweathermap.org/api) (free tier works)

---

### 1. Clone & Configure

```bash
git clone <your-repo-url>
cd weathfetch
```

**Backend environment:**
```bash
cd backend
cp .env.example .env
# Edit .env and add your OPENWEATHER_API_KEY
```

**Frontend environment:**
```bash
cd ../frontend
cp .env.example .env
# REACT_APP_API_URL should point to your backend
```

---

### 2. Run Backend

```bash
cd backend
npm install
npm run dev       # development (nodemon)
# or
npm start         # production
```

The API server starts at **http://localhost:5000**

---

### 3. Run Frontend

```bash
cd frontend
npm install
npm start
```

The React app opens at **http://localhost:3000**

---

### 4. Run with Docker (Full Stack)

```bash
# From the project root
cp backend/.env.example backend/.env
# Add your API key to backend/.env

docker-compose up --build
```

- Frontend → http://localhost:3000  
- Backend  → http://localhost:5000

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api/weather`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/current?city=London&units=metric` | Current weather by city |
| GET | `/current?lat=51.5&lon=-0.12&units=metric` | Current weather by coordinates |
| GET | `/forecast?city=London&units=metric&days=5` | 5-day forecast |
| GET | `/forecast?lat=51.5&lon=-0.12` | Forecast by coordinates |
| GET | `/search?q=Lon` | City autocomplete (top 5) |
| GET | `/cache/stats` | Cache statistics |
| DELETE | `/cache` | Flush all cache entries |

**Units:** `metric` (°C, m/s) · `imperial` (°F, mph) · `standard` (K)

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Express server port |
| `NODE_ENV` | `development` | Environment mode |
| `OPENWEATHER_API_KEY` | — | **Required.** Your OWM API key |
| `OPENWEATHER_BASE_URL` | OWM v2.5 URL | Base API URL |
| `FRONTEND_URL` | `http://localhost:3000` | CORS allowed origin |
| `CACHE_TTL` | `600` | Cache expiry in seconds |
| `CACHE_MAX_KEYS` | `500` | Max cached entries |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (15 min) |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:5000/api` | Backend base URL |
| `REACT_APP_DEFAULT_UNITS` | `metric` | Default temperature units |
| `REACT_APP_NAME` | `WeathFetch` | App display name |

---

## 🏗 Architecture

```
Browser (React)
     │
     │  HTTP requests to /api/*
     ▼
Express Backend (Node.js)          ← API key stays here, never exposed
     │  ├── Rate Limiter
     │  ├── CORS Guard
     │  ├── Cache Layer (node-cache)
     │  └── Error Handler
     │
     │  HTTPS to OpenWeatherMap
     ▼
OpenWeatherMap API
```

**Key design decisions:**
- **API key is server-side only** — the frontend never touches it
- **Cache-first strategy** — repeated queries for the same city are served from memory (600s TTL)
- **Parallel fetching** — current weather + forecast are fetched simultaneously with `Promise.all`
- **Debounced search** — city autocomplete fires after 350ms idle
- **Geolocation support** — one-click "use my location" via browser Geolocation API

---

## 🎨 Design

- **Theme:** Deep black + crimson red
- **Fonts:** Bebas Neue (display) · DM Sans (body) · JetBrains Mono (data)
- **Dynamic background:** Gradient shifts based on weather condition
- **Responsive:** Works on mobile, tablet, and desktop

---

## 📦 Dependencies

### Backend
| Package | Purpose |
|---------|---------|
| `express` | HTTP server |
| `axios` | OpenWeatherMap API calls |
| `cors` | Cross-origin request control |
| `dotenv` | Environment config |
| `node-cache` | In-memory response caching |
| `express-rate-limit` | Abuse prevention |

### Frontend
| Package | Purpose |
|---------|---------|
| `react` / `react-dom` | UI framework |
| `axios` | Backend API calls |

---

## 🔒 Security Notes

- API key is stored in backend `.env` — **never committed to git**
- CORS is restricted to the frontend origin only
- Rate limiting prevents API abuse
- No sensitive data is ever sent to the client

---

## 📄 License

MIT — free to use, modify, and distribute.
