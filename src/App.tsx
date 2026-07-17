import { useState, useEffect } from 'react';
import { CityResult, WeatherData, DailyForecast } from './types';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import ForecastSection from './components/ForecastSection';
import WeatherCharts from './components/WeatherCharts';
import Recommendations from './components/Recommendations';
import { CloudOff, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const DEFAULT_CITY: CityResult = {
  id: 2643743,
  name: 'London',
  latitude: 51.50853,
  longitude: -0.12574,
  country: 'United Kingdom',
  country_code: 'GB',
  admin1: 'England',
  timezone: 'Europe/London'
};

export default function App() {
  const [selectedCity, setSelectedCity] = useState<CityResult>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch weather data for the selected city
  const fetchWeather = async (city: CityResult) => {
    setIsLoading(true);
    setError(null);
    try {
      const timezone = city.timezone ? encodeURIComponent(city.timezone) : 'auto';
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,wind_speed_10m_max,uv_index_max,sunrise,sunset&hourly=temperature_2m&timezone=${timezone}`
      );

      if (!response.ok) {
        throw new Error('Weather service is currently unavailable. Please try again later.');
      }

      const data = await response.json();
      const mapped = mapWeatherData(city, data);
      setWeatherData(mapped);
    } catch (err: any) {
      console.error('Error fetching weather:', err);
      setError(err.message || 'Unable to connect to weather data services.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity]);

  const mapWeatherData = (city: CityResult, raw: any): WeatherData => {
    const current = raw.current;
    const daily = raw.daily;
    const hourly = raw.hourly;

    const dailyForecasts: DailyForecast[] = daily.time.map((date: string, index: number) => ({
      date,
      weatherCode: daily.weather_code[index],
      tempMax: daily.temperature_2m_max[index],
      tempMin: daily.temperature_2m_min[index],
      apparentTempMax: daily.apparent_temperature_max[index],
      apparentTempMin: daily.apparent_temperature_min[index],
      precipitationSum: daily.precipitation_sum[index],
      windSpeedMax: daily.wind_speed_10m_max[index],
      uvIndexMax: daily.uv_index_max[index],
      sunrise: daily.sunrise ? daily.sunrise[index] : undefined,
      sunset: daily.sunset ? daily.sunset[index] : undefined,
    }));

    const hourlyForecasts = hourly && hourly.time ? hourly.time.slice(0, 24).map((time: string, index: number) => ({
      time,
      temperature: hourly.temperature_2m[index],
    })) : [];

    return {
      city,
      current: {
        temperature: current.temperature_2m,
        apparentTemperature: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        isDay: current.is_day === 1,
        weatherCode: current.weather_code,
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        time: current.time,
        pressure: current.surface_pressure,
      },
      daily: dailyForecasts,
      hourly: hourlyForecasts,
      elevation: raw.elevation,
      timezone: raw.timezone,
    };
  };

  const handleSelectCity = (city: CityResult) => {
    setSelectedCity(city);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-300 relative overflow-x-hidden">
      {/* Immersive top aurora glowing sphere backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Header */}
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 md:py-10 space-y-6 md:space-y-8 relative z-10">
        
        {/* Input/Search Area */}
        <SearchBar onSelectCity={handleSelectCity} isLoading={isLoading} />

        {/* Error States */}
        {error && (
          <div
            id="error-message-box"
            className="w-full max-w-2xl mx-auto p-5 bg-red-950/20 border border-red-900/40 rounded-2xl flex gap-3.5 items-start animate-in fade-in slide-in-from-top-4 duration-300"
          >
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <h4 className="font-bold text-red-400 text-sm">
                Atmospheric Query Error
              </h4>
              <p className="text-xs text-red-300/80 font-medium">
                {error}
              </p>
              <button
                id="error-retry-button"
                onClick={() => fetchWeather(selectedCity)}
                className="text-[11px] font-bold bg-red-950/40 text-red-400 hover:bg-red-900/30 px-3 py-1.5 rounded-lg border border-red-900/30 transition-colors flex items-center gap-1.5 mt-2"
              >
                <RefreshCw className="h-3 w-3" />
                Retry Connection
              </button>
            </div>
          </div>
        )}

        {/* Loading overlay for layout change */}
        {isLoading && !weatherData && (
          <div id="full-screen-loader" className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <p className="text-xs font-semibold text-slate-500 tracking-widest uppercase font-mono">
              Analyzing meteorological coordinates...
            </p>
          </div>
        )}

        {/* Cohesive Bento Grid Layout */}
        {weatherData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Left Column: Current Weather & Advanced Interactive Charts (Span 7) */}
            <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
              <div className="w-full">
                <CurrentWeather data={weatherData} />
              </div>
              <div className="w-full flex-1">
                <WeatherCharts daily={weatherData.daily} hourly={weatherData.hourly} current={weatherData.current} />
              </div>
            </div>

            {/* Right Column: Dynamic Recommendations & Forecast Projections (Span 5) */}
            <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
              <div className="w-full flex-1">
                <Recommendations data={weatherData} />
              </div>
              <div className="w-full">
                <ForecastSection daily={weatherData.daily} />
              </div>
            </div>

          </div>
        )}

        {/* No Report State */}
        {!isLoading && !weatherData && !error && (
          <div id="no-weather-state" className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <CloudOff className="h-10 w-10 text-slate-700" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-400">
                Data Stream Terminated
              </p>
              <p className="text-xs text-slate-500 max-w-sm">
                Enter target city coordinates or choose a preset anchor location from quick access.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/85 py-6 mt-12 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <span>© 2026 Weather Intelligence. Powered by React, Vite, and Open-Meteo.</span>
          <span className="text-[10px] tracking-wider uppercase text-slate-600 font-bold">
            BENTO GRID DESIGN THEME ENABLED
          </span>
        </div>
      </footer>
    </div>
  );
}
