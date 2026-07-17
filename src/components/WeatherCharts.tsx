import { useState } from 'react';
import { DailyForecast, HourlyForecast, CurrentWeather } from '../types';
import { formatDayName, formatDateLabel, getMoonDetails } from '../utils/weatherUtils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, Clock, Calendar, Moon, Gauge, Sunrise, Sunset, Sparkles } from 'lucide-react';

interface WeatherChartsProps {
  daily: DailyForecast[];
  hourly?: HourlyForecast[];
  current?: CurrentWeather;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isHourly = data.hasOwnProperty('Temperature');

    if (isHourly) {
      return (
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2.5">
            Atmosphere Target Time
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-semibold text-slate-400">
              Hour {data.name}:
            </span>
            <span className="text-xs font-black text-slate-100 font-mono">
              {data['Temperature']}°C
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2.5">
          {data.fullDate}
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs font-semibold text-slate-400">
              Maximum Temp:
            </span>
            <span className="text-xs font-black text-slate-100">
              {data['Max Temp']}°C
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs font-semibold text-slate-400">
              Minimum Temp:
            </span>
            <span className="text-xs font-black text-slate-100">
              {data['Min Temp']}°C
            </span>
          </div>
          {data.precipitation > 0 && (
            <div className="flex items-center gap-2 pt-1.5 border-t border-slate-800 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-[10px] font-semibold text-slate-500">
                Rain Sum:
              </span>
              <span className="text-[10px] font-bold text-blue-400 font-mono">
                {data.precipitation.toFixed(1)} mm
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default function WeatherCharts({ daily, hourly, current }: WeatherChartsProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'hourly'>('daily');

  // Compute advanced astronomical and meteorological variables
  const referenceDateStr = daily[0]?.date || new Date().toISOString().split('T')[0];
  const moon = getMoonDetails(referenceDateStr);

  const pressureVal = current?.pressure ? Math.round(current.pressure) : 1013;
  const pressureStatus = pressureVal > 1020 ? 'High' : pressureVal < 1009 ? 'Low' : 'Normal';

  const uvIndex = daily[0]?.uvIndexMax !== undefined ? daily[0].uvIndexMax : 4;
  let uvCategory = 'Low';
  let uvColor = 'text-emerald-400';
  if (uvIndex >= 8) {
    uvCategory = 'Very High';
    uvColor = 'text-red-400';
  } else if (uvIndex >= 6) {
    uvCategory = 'High';
    uvColor = 'text-orange-400';
  } else if (uvIndex >= 3) {
    uvCategory = 'Moderate';
    uvColor = 'text-amber-400';
  }

  const formatIsoTime = (isoStr?: string) => {
    if (!isoStr) return '--:--';
    try {
      const date = new Date(isoStr);
      if (isNaN(date.getTime())) {
        const match = isoStr.match(/T(\d{2}):(\d{2})/);
        if (match) {
          const h = parseInt(match[1]);
          const m = match[2];
          const ampm = h >= 12 ? 'PM' : 'AM';
          const displayH = h % 12 === 0 ? 12 : h % 12;
          return `${displayH}:${m} ${ampm}`;
        }
        return isoStr;
      }
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return isoStr;
    }
  };

  const sunriseStr = daily[0]?.sunrise ? formatIsoTime(daily[0].sunrise) : '05:32 AM';
  const sunsetStr = daily[0]?.sunset ? formatIsoTime(daily[0].sunset) : '08:44 PM';

  const chartData = daily.map((day) => ({
    name: formatDayName(day.date),
    fullDate: `${formatDayName(day.date)}, ${formatDateLabel(day.date)}`,
    'Max Temp': Math.round(day.tempMax),
    'Min Temp': Math.round(day.tempMin),
    precipitation: day.precipitationSum,
  }));

  const hourlyData = (hourly || []).map((hour) => {
    const dateObj = new Date(hour.time);
    let hourStr = '';
    
    if (isNaN(dateObj.getTime())) {
      const match = hour.time.match(/T(\d{2}):/);
      if (match) {
        const h = parseInt(match[1]);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 === 0 ? 12 : h % 12;
        hourStr = `${displayHour} ${ampm}`;
      } else {
        hourStr = hour.time;
      }
    } else {
      const hoursNum = dateObj.getHours();
      const ampm = hoursNum >= 12 ? 'PM' : 'AM';
      const displayHour = hoursNum % 12 === 0 ? 12 : hoursNum % 12;
      hourStr = `${displayHour} ${ampm}`;
    }

    return {
      name: hourStr,
      'Temperature': Math.round(hour.temperature),
    };
  });

  return (
    <div
      id="weather-charts-card"
      className="bg-slate-900/40 border border-slate-800/90 rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between"
    >
      <div>
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-100 flex items-center gap-2.5 font-display">
                <span className="w-1.5 h-5 bg-red-500 rounded-full inline-block" />
                Temperature Analytics
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {activeTab === 'daily' ? 'Real-time temperature range cycles' : 'Hour-by-hour temperature progression'}
              </p>
            </div>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex items-center p-1 bg-slate-950/60 border border-slate-800 rounded-xl shrink-0 self-start sm:self-center">
            <button
              type="button"
              id="chart-tab-daily"
              onClick={() => setActiveTab('daily')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'daily'
                  ? 'bg-red-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="h-3 w-3" />
              <span>7-Day</span>
            </button>
            <button
              type="button"
              id="chart-tab-hourly"
              onClick={() => setActiveTab('hourly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'hourly'
                  ? 'bg-red-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="h-3 w-3" />
              <span>Hourly</span>
            </button>
          </div>
        </div>

        {/* Legend pills & Tab specific metadata */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">
            {activeTab === 'daily' ? '7-Day Forecasting Cycle' : '24-Hour Diurnal Window'}
          </div>
          
          <div className="flex items-center gap-3.5 text-[10px] font-mono tracking-widest uppercase font-bold text-slate-400">
            {activeTab === 'daily' ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-red-500" />
                  <span>MAX</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-blue-500" />
                  <span>MIN</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-amber-500" />
                <span>TEMP</span>
              </div>
            )}
          </div>
        </div>

        {/* Recharts Area Container */}
        <div className="w-full h-[280px]" id="recharts-wrapper">
          {activeTab === 'daily' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#1e293b"
                  className="opacity-50"
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  dx={-5}
                  unit="°"
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="Max Temp"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorMax)"
                  activeDot={{ r: 5, strokeWidth: 0, fill: '#ef4444' }}
                />
                <Area
                  type="monotone"
                  dataKey="Min Temp"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorMin)"
                  activeDot={{ r: 5, strokeWidth: 0, fill: '#3b82f6' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={hourlyData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorHourly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#1e293b"
                  className="opacity-50"
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }}
                  dy={10}
                  interval={3}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  dx={-5}
                  unit="°"
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="Temperature"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorHourly)"
                  activeDot={{ r: 5, strokeWidth: 0, fill: '#f59e0b' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Astronomical & Advanced Meteorological Bento Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80" id="advanced-astro-bento">
          {/* Tile 1: Moon Phase */}
          <div className="bg-slate-950/40 border border-slate-800/40 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700/60 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 opacity-40 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                Moon Phase
              </span>
              <Moon className="h-4 w-4 text-purple-400" />
            </div>
            <div className="mt-3">
              <p className="text-sm font-black text-slate-100 truncate">
                {moon.phaseName}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold text-purple-300">
                  {moon.illumination}% Illum.
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Full: {moon.nextFullMoon}
                </span>
              </div>
            </div>
            <p className="text-[9px] text-slate-500 font-mono mt-2 uppercase">
              Rise: {moon.moonrise}
            </p>
          </div>

          {/* Tile 2: Atmospheric Pressure */}
          <div className="bg-slate-950/40 border border-slate-800/40 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700/60 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 opacity-40 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                Barometer
              </span>
              <Gauge className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-3">
              <p className="text-sm font-black text-slate-100">
                {pressureVal} <span className="text-[10px] text-slate-400 font-bold">hPa</span>
              </p>
              <p className="text-xs font-semibold text-slate-300 mt-1">
                {pressureStatus} Pressure
              </p>
            </div>
            <p className="text-[9px] text-slate-500 font-mono mt-2 uppercase">
              {pressureVal > 1020 ? 'Clear weather' : pressureVal < 1009 ? 'Storm potential' : 'Stable atmosphere'}
            </p>
          </div>

          {/* Tile 3: UV Index */}
          <div className="bg-slate-950/40 border border-slate-800/40 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700/60 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 opacity-40 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                UV Index
              </span>
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-3">
              <p className="text-sm font-black text-slate-100">
                {uvIndex.toFixed(1)} <span className="text-[10px] text-slate-400 font-bold">MAX</span>
              </p>
              <p className={`text-xs font-bold mt-1 ${uvColor}`}>
                {uvCategory}
              </p>
            </div>
            <p className="text-[9px] text-slate-500 font-mono mt-2 uppercase">
              {uvIndex >= 6 ? 'SPF 30+ advised' : uvIndex >= 3 ? 'Sunscreen advised' : 'Safe levels'}
            </p>
          </div>

          {/* Tile 4: Sunrise / Sunset */}
          <div className="bg-slate-950/40 border border-slate-800/40 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700/60 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 opacity-40 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                Daylight
              </span>
              <div className="flex gap-1">
                <Sunrise className="h-3 w-3 text-orange-400" />
                <Sunset className="h-3 w-3 text-red-400" />
              </div>
            </div>
            <div className="mt-2.5 space-y-1">
              <div className="flex items-center gap-1.5">
                <Sunrise className="h-3 w-3 text-orange-400/70" />
                <span className="text-xs font-semibold text-slate-300">{sunriseStr}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sunset className="h-3 w-3 text-red-400/70" />
                <span className="text-xs font-semibold text-slate-300">{sunsetStr}</span>
              </div>
            </div>
            <p className="text-[9px] text-slate-500 font-mono mt-2.5 uppercase">
              Sun elevation active
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-red-500/60 uppercase tracking-wider">
        <span>ATMOSPHERE DATA FLOW: ACTIVE</span>
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
