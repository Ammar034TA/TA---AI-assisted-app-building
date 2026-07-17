# Weather Intelligence 🌤️

A highly polished, responsive weather dashboard providing real-time meteorological conditions, 7-day forecasts, temperature analytics, and personalized outdoor recommendations. Built with **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS**.

## ✨ Key Features

1. **Precision City Search**: 
   - Powered by the **Open-Meteo Geocoding API** to fetch exact geographical coordinates (latitude and longitude) of any city in the world.
   - Built-in real-time debounced autocomplete suggestions.
   - Elegant quick-select row for popular world capitals (New York, Tokyo, London, Sydney, Paris).

2. **Current Weather Overview**:
   - Displays real-time temperature, "feels like" apparent temperature, relative humidity, wind velocity, and wind direction.
   - Dynamic atmospheric gradient glow based on current weather conditions (e.g., bright golden for sunny days, cold cyan for snow, deep stormy indigo for thunderstorms).

3. **7-Day Meteorological Forecast**:
   - Custom cards showing maximum and minimum temperature ranges, weather conditions, and direct day-of-week labels.
   - Staggered responsive cards that gracefully adapt to desktop and mobile environments.

4. **Temperature Analytics Charts**:
   - Implemented using **Recharts** to display a smooth, dual-area visual trend of Maximum and Minimum daily temperatures.
   - Highly stylized custom tooltip for granular detail hover overlays.

5. **Intellectual Recommendations**:
   - Automatically computes customized daily recommendations based on active weather variables:
     - **Clothing**: Advises warm layering, jackets, or loose cotton based on active heat zones.
     - **Protection**: Warns when to carry an umbrella or apply high-SPF sunscreen (UV Index).
     - **Alerts**: Direct indicators of high winds or severe lightning storms.
     - **Activities**: Proactively suggests pleasant outdoor sports or cozy indoor alternatives depending on rain and temperature comfort thresholds.

6. **Error & Connectivity Resilience**:
   - Graceful fallback for offline, network errors, or failed search attempts ("City not found").
   - Detailed loading feedback to provide smooth, delightful micro-interaction.

---

## 🛠️ Architecture and Folder Structure

```
├── /assets/                # Visual resources and logs
├── /src/
│   ├── /components/        # Reusable dashboard components
│   │   ├── Header.tsx      # Main application branding and data attribution
│   │   ├── SearchBar.tsx   # Autocomplete inputs with popular quick-select
│   │   ├── CurrentWeather.tsx # Large temperature display and primary metrics grid
│   │   ├── ForecastSection.tsx # Seven individual forecast cards
│   │   ├── WeatherCharts.tsx # Recharts temperature trend visualizations
│   │   └── Recommendations.tsx # Intelligence and advisory cards
│   ├── /utils/             # Meteorological business logic
│   │   └── weatherUtils.ts # WMO weather mappers, wind direction labels, and tip generators
│   ├── types.ts            # Type definitions and structures
│   ├── App.tsx             # Application core state orchestration
│   ├── index.css           # Tailwind style declarations
│   └── main.tsx            # Application entry point
├── package.json            # Node dependencies and scripts
├── tsconfig.json           # Type definitions configurations
└── vite.config.ts          # Vite configuration with tailwind mapping
```

---

## 🚀 Running the Application

### Installation

First, install all required dependencies:

```bash
npm install
```

### Run Development Server

Launch the development server on `http://localhost:3000`:

```bash
npm run dev
```

### Build for Production

Compile typescript files and bundle production static files into the `dist/` directory:

```bash
npm run build
```

---

## 🔌 API & Third-party Attributions

All weather coordinates and indicators are fetched in real-time using open public endpoints. No API keys are required:
- **Geocoding Search**: `https://geocoding-api.open-meteo.com/v1/search`
- **Forecasting Services**: `https://api.open-meteo.com/v1/forecast`
- Special thanks to the **Open-Meteo** team for their wonderful open weather data services.
