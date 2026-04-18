# WeathFetch

A weather forecast web app built with React and Node.js. It pulls real-time data from the OpenWeatherMap API through a backend proxy so the API key never touches the frontend.

## What it does

Search any city and get current weather, a 5-day forecast, and a 24-hour hourly breakdown. Supports live location detection, °C/°F toggle, and city autocomplete.

---

## Tech Stack

- **Frontend** — React.js
- **Backend** — Node.js + Express
- **API** — OpenWeatherMap
- **Caching** — node-cache (10 min TTL, reduces redundant API calls)
- **Security** — API key lives on the server only, rate limiting enabled

---

## Project Structure

```
weathfetch/
├── backend/
│   ├── cache/weatherCache.js
│   ├── middleware/errorHandler.js
│   ├── routes/weather.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── CurrentWeather.jsx
│   │   │   ├── ForecastCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── ErrorBanner.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── hooks/useWeather.js
│   │   ├── utils/api.js
│   │   ├── utils/weatherHelpers.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
├── start-backend.bat
├── start-frontend.bat
└── README.md
```

---

## Getting Started

### 1. Get an API Key

Sign up for a free account at [openweathermap.org](https://openweathermap.org/api) and grab your API key. New keys take about 10–30 minutes to activate.

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Rename `.env.example` to `.env` and add your API key:

```
OPENWEATHER_API_KEY=your_key_here
```

Start the backend:

```bash
npm run dev
```

It runs on `http://localhost:5000`.

### 3. Set Up the Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Rename `.env.example` to `.env`. The defaults work fine:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

Opens at `http://localhost:3000`.

Both terminals need to stay open while using the app.

---

## Quick Start (Windows)

Two `.bat` files are included so you don't have to type commands every time.

Just place them in the root `weathfetch/` folder (they're already there) and double-click:

- `start-backend.bat` — starts the backend server
- `start-frontend.bat` — starts the React app

Always start the backend first, then the frontend.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather/current?city=London` | Current weather |
| GET | `/api/weather/forecast?city=London` | 5-day forecast |
| GET | `/api/weather/search?q=Lon` | City autocomplete |

Supports `units=metric` (°C) or `units=imperial` (°F).

---

## Environment Variables

### Backend

| Variable | Description |
|----------|-------------|
| `OPENWEATHER_API_KEY` | Your OpenWeatherMap key |
| `PORT` | Server port (default: 5000) |
| `FRONTEND_URL` | Allowed CORS origin |
| `CACHE_TTL` | Cache duration in seconds (default: 600) |

### Frontend

| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Backend URL |
| `REACT_APP_DEFAULT_UNITS` | `metric` or `imperial` |

---

## Notes

- The `.env` file is blocked by `.gitignore` — your API key won't be pushed to GitHub
- `.env.example` is safe to commit — it's just a template with no real values
- Anyone cloning this repo needs to create their own `.env` with their own API key
