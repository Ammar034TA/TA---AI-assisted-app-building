import { getWeatherCondition, getWindDirectionLabel, formatTimeLabel } from '../utils/weatherUtils';
import { WeatherData } from '../types';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Compass, 
  MapPin, 
  Clock 
} from 'lucide-react';

interface CurrentWeatherProps {
  data: WeatherData;
}

export default function CurrentWeather({ data }: CurrentWeatherProps) {
  const { city, current, daily } = data;
  const condition = getWeatherCondition(current.weatherCode, current.isDay);
  const WeatherIcon = condition.icon;

  const windDirLabel = getWindDirectionLabel(current.windDirection);

  // Get high/low from today's forecast
  const todayForecast = daily[0];
  const tempMax = todayForecast ? Math.round(todayForecast.tempMax) : Math.round(current.temperature + 3);
  const tempMin = todayForecast ? Math.round(todayForecast.tempMin) : Math.round(current.temperature - 4);

  // Calculate dynamic bar percentages for display
  const windPercentage = Math.min((current.windSpeed / 60) * 100, 100);
  const humidityPercentage = current.humidity;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4" id="current-weather-bento-group">
      
      {/* 1. Main Current Weather Card (col-span-5) */}
      <div 
        id="current-weather-main-panel" 
        className="col-span-1 md:col-span-5 bg-gradient-to-br from-blue-600 via-indigo-700 to-indigo-900 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl shadow-blue-900/15 relative overflow-hidden group min-h-[320px]"
      >
        {/* Subtle backdrop overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 opacity-10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />

        {/* Card Header */}
        <div className="space-y-1 relative z-10">
          <div className="flex items-center justify-between">
            <p className="text-blue-100/80 text-xs font-bold uppercase tracking-widest font-display">
              Live Atmosphere
            </p>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-200/60 bg-blue-950/30 px-2.5 py-1 rounded-full">
              <Clock className="h-3 w-3" />
              <span>{formatTimeLabel(current.time)}</span>
            </div>
          </div>
          
          <div className="pt-2 flex items-start gap-2.5">
            <MapPin className="h-5 w-5 text-blue-300 mt-1 shrink-0" />
            <div>
              <h2 id="weather-city-name" className="text-3xl font-black tracking-tight text-white font-display">
                {city.name}
              </h2>
              <p className="text-xs font-semibold text-blue-200/70 mt-0.5">
                {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
              </p>
            </div>
          </div>
        </div>

        {/* Center weather visual */}
        <div className="flex items-center gap-4 my-4 relative z-10">
          <div className="p-3.5 bg-white/10 rounded-2xl backdrop-blur-sm shadow-inner group-hover:scale-105 transition-transform duration-300">
            <WeatherIcon className="h-10 w-10 text-white stroke-[2]" />
          </div>
          <div>
            <p id="weather-condition-label" className="text-base font-extrabold text-white">
              {condition.label}
            </p>
            <p className="text-xs text-blue-200/80 font-medium">
              Today's Range: {tempMax}°C / {tempMin}°C
            </p>
          </div>
        </div>

        {/* Temperature layout */}
        <div className="flex items-end justify-between relative z-10 mt-2">
          <div className="flex items-start">
            <span id="weather-temp-main" className="text-7xl md:text-8xl font-black tracking-tighter text-white font-display leading-none">
              {Math.round(current.temperature)}
            </span>
            <span className="text-2xl font-bold text-blue-300 mt-1">°C</span>
          </div>
          <div className="text-right pb-1">
            <p className="text-xs font-semibold text-blue-200">
              Feels like {Math.round(current.apparentTemperature)}°C
            </p>
            <p className="text-[10px] font-mono text-blue-300/80 uppercase tracking-widest mt-0.5">
              SYSTEM REPORT
            </p>
          </div>
        </div>
      </div>

      {/* 2. Secondary Meteorological Bento Squares (col-span-7) */}
      <div 
        id="current-weather-metrics-panel" 
        className="col-span-1 md:col-span-7 grid grid-cols-2 gap-4"
      >
        {/* Wind Speed Grid Cell */}
        <div className="bg-slate-900/40 border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between shadow-md transition-all duration-300 hover:border-slate-700/80 group">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Wind Velocity
            </p>
            <Wind className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <span id="weather-wind-speed" className="text-3xl font-black text-slate-100 font-display">
                {current.windSpeed}
              </span>
              <span className="text-xs text-slate-400 font-bold">km/h</span>
            </div>
            {/* Progress bar representing speed */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-blue-400 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${windPercentage}%` }}
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold mt-2">
            {current.windSpeed > 25 ? 'Strong gusts' : current.windSpeed > 10 ? 'Moderate breeze' : 'Calm breeze'}
          </p>
        </div>

        {/* Humidity Grid Cell */}
        <div className="bg-slate-900/40 border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between shadow-md transition-all duration-300 hover:border-slate-700/80 group">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Relative Humidity
            </p>
            <Droplets className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <span id="weather-humidity" className="text-3xl font-black text-slate-100 font-display">
                {current.humidity}
              </span>
              <span className="text-xs text-slate-400 font-bold">%</span>
            </div>
            {/* Progress bar representing humidity */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-emerald-400 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${humidityPercentage}%` }}
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold mt-2">
            {current.humidity > 70 ? 'Moist conditions' : current.humidity < 40 ? 'Dry atmosphere' : 'Optimal comfort'}
          </p>
        </div>

        {/* Wind Direction Grid Cell */}
        <div className="bg-slate-900/40 border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between shadow-md transition-all duration-300 hover:border-slate-700/80 group">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Compass Direction
            </p>
            <Compass className="h-4 w-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <span id="weather-wind-direction" className="text-3xl font-black text-slate-100 font-display">
                {windDirLabel}
              </span>
              <span className="text-xs text-slate-400 font-bold">({current.windDirection}°)</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-violet-400 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span>Bearing Verified</span>
          </div>
        </div>

        {/* Feels Like / Elevation Grid Cell */}
        <div className="bg-slate-900/40 border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between shadow-md transition-all duration-300 hover:border-slate-700/80 group">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Comfort Level
            </p>
            <Thermometer className="h-4 w-4 text-slate-500 group-hover:text-orange-400 transition-colors" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-100 font-display">
                {Math.round(current.apparentTemperature)}
              </span>
              <span className="text-xs text-slate-400 font-bold">°C</span>
            </div>
          </div>
          <div className="text-[10px] text-emerald-400 font-bold mt-3 uppercase tracking-wider">
            {Math.abs(current.temperature - current.apparentTemperature) < 2 
              ? 'Stable Atmosphere' 
              : current.apparentTemperature < current.temperature 
                ? 'Wind chill active' 
                : 'High heat stress'}
          </div>
        </div>
      </div>

    </div>
  );
}
