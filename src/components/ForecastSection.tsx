import { DailyForecast } from '../types';
import { getWeatherCondition, formatDayName, formatDateLabel } from '../utils/weatherUtils';

interface ForecastSectionProps {
  daily: DailyForecast[];
}

export default function ForecastSection({ daily }: ForecastSectionProps) {
  return (
    <div 
      id="forecast-section-card" 
      className="bg-slate-900/40 border border-slate-800/90 rounded-3xl p-6 md:p-8 flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 h-full"
    >
      {/* Title with Bento Accent Bar */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-100 flex items-center gap-2.5 font-display">
          <span className="w-1.5 h-5 bg-blue-500 rounded-full inline-block" />
          7-Day Forecast
        </h3>
        <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 font-semibold px-2.5 py-1 rounded-md border border-blue-500/10">
          PROJECTIONS ACTIVE
        </span>
      </div>

      {/* Rows of days */}
      <div className="flex-1 flex flex-col gap-3.5 divide-y divide-slate-800/50">
        {daily.map((day, idx) => {
          const condition = getWeatherCondition(day.weatherCode, true);
          const WeatherIcon = condition.icon;
          const isToday = idx === 0;

          return (
            <div 
              key={day.date} 
              id={`forecast-row-${idx}`}
              className={`flex items-center justify-between pt-3.5 first:pt-0 ${
                isToday ? 'bg-blue-500/5 -mx-2 px-2 py-1.5 rounded-xl' : ''
              }`}
            >
              {/* Day column */}
              <div className="w-20 shrink-0">
                <p className={`font-bold text-sm ${isToday ? 'text-blue-400' : 'text-slate-200'}`}>
                  {isToday ? 'Today' : formatDayName(day.date)}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  {formatDateLabel(day.date)}
                </p>
              </div>

              {/* Condition block with Icon */}
              <div className="flex items-center gap-3 flex-1 px-4 min-w-0">
                <div className={`p-1.5 rounded-lg shrink-0 ${condition.bgSolid} ${condition.themeColor}`}>
                  <WeatherIcon className="h-4.5 w-4.5 stroke-[2.5]" />
                </div>
                <span className="text-xs font-bold text-slate-300 truncate hidden sm:inline">
                  {condition.label}
                </span>
                {day.precipitationSum > 0 && (
                  <span className="text-[9px] font-mono text-blue-400 bg-blue-950/40 border border-blue-900/30 px-1.5 py-0.5 rounded">
                    {day.precipitationSum.toFixed(1)}mm rain
                  </span>
                )}
              </div>

              {/* Max/Min Temperature Range */}
              <div className="text-right shrink-0 font-mono text-sm">
                <span className="font-extrabold text-slate-100">{Math.round(day.tempMax)}°</span>
                <span className="text-slate-500 mx-1.5">/</span>
                <span className="font-semibold text-slate-400">{Math.round(day.tempMin)}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
