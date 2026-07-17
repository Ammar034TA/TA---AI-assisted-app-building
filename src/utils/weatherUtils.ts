import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  Wind,
  Droplets,
  Thermometer,
  Sparkles,
  Shirt,
  Umbrella,
  Tv,
  AlertTriangle,
  LucideIcon
} from 'lucide-react';
import { DailyForecast, CurrentWeather } from '../types';

export interface WeatherCondition {
  label: string;
  icon: LucideIcon;
  gradient: string; // Tailwind gradient class
  themeColor: string; // primary text / border color
  bgSolid: string; // solid bg color
}

export function getWeatherCondition(code: number, isDay = true): WeatherCondition {
  // WMO Weather interpretation codes (WW)
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Sunny' : 'Clear Sky',
        icon: Sun,
        gradient: isDay 
          ? 'from-amber-400 via-orange-400 to-amber-500' 
          : 'from-slate-900 via-slate-800 to-indigo-950',
        themeColor: 'text-amber-500',
        bgSolid: 'bg-amber-50 dark:bg-amber-950/20'
      };
    case 1:
      return {
        label: isDay ? 'Mainly Clear' : 'Mostly Clear',
        icon: CloudSun,
        gradient: isDay 
          ? 'from-blue-400 via-amber-200 to-orange-200' 
          : 'from-slate-950 via-slate-900 to-slate-800',
        themeColor: 'text-amber-400',
        bgSolid: 'bg-amber-50/50 dark:bg-slate-900/40'
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        icon: CloudSun,
        gradient: isDay 
          ? 'from-sky-400 via-blue-300 to-slate-200' 
          : 'from-slate-900 via-slate-800 to-slate-700',
        themeColor: 'text-sky-400',
        bgSolid: 'bg-sky-50 dark:bg-sky-950/20'
      };
    case 3:
      return {
        label: 'Overcast',
        icon: Cloud,
        gradient: 'from-slate-400 via-slate-300 to-slate-500',
        themeColor: 'text-slate-500',
        bgSolid: 'bg-slate-50 dark:bg-slate-900/20'
      };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        icon: Cloud, // We can reuse Cloud with some opacity or style
        gradient: 'from-slate-300 via-zinc-200 to-slate-400',
        themeColor: 'text-slate-400',
        bgSolid: 'bg-zinc-50 dark:bg-zinc-950/20'
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        icon: CloudDrizzle,
        gradient: 'from-sky-300 via-blue-400 to-slate-400',
        themeColor: 'text-sky-400',
        bgSolid: 'bg-sky-50 dark:bg-sky-950/10'
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        icon: CloudSnow,
        gradient: 'from-blue-200 via-indigo-300 to-slate-400',
        themeColor: 'text-cyan-400',
        bgSolid: 'bg-cyan-50 dark:bg-cyan-950/10'
      };
    case 61:
    case 63:
    case 65:
      return {
        label: 'Rain',
        icon: CloudRain,
        gradient: 'from-blue-500 via-indigo-500 to-slate-600',
        themeColor: 'text-blue-500',
        bgSolid: 'bg-blue-50 dark:bg-blue-950/20'
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        icon: CloudSnow,
        gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
        themeColor: 'text-cyan-500',
        bgSolid: 'bg-cyan-50 dark:bg-cyan-950/20'
      };
    case 71:
    case 73:
    case 75:
      return {
        label: 'Snowing',
        icon: CloudSnow,
        gradient: 'from-cyan-100 via-blue-100 to-indigo-200',
        themeColor: 'text-sky-300',
        bgSolid: 'bg-sky-50/30 dark:bg-sky-900/10'
      };
    case 77:
      return {
        label: 'Snow Grains',
        icon: CloudSnow,
        gradient: 'from-slate-200 via-slate-100 to-blue-200',
        themeColor: 'text-sky-200',
        bgSolid: 'bg-slate-50 dark:bg-slate-900/10'
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        icon: CloudRain,
        gradient: 'from-blue-600 via-indigo-600 to-sky-700',
        themeColor: 'text-blue-600',
        bgSolid: 'bg-blue-100/50 dark:bg-blue-950/30'
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        icon: CloudSnow,
        gradient: 'from-blue-100 via-cyan-200 to-indigo-300',
        themeColor: 'text-sky-400',
        bgSolid: 'bg-sky-50 dark:bg-sky-950/20'
      };
    case 95:
      return {
        label: 'Thunderstorm',
        icon: CloudLightning,
        gradient: 'from-slate-800 via-indigo-950 to-purple-950',
        themeColor: 'text-violet-500',
        bgSolid: 'bg-violet-950/10'
      };
    case 96:
    case 99:
      return {
        label: 'Severe Thunderstorm',
        icon: CloudLightning,
        gradient: 'from-slate-950 via-purple-900 to-violet-950',
        themeColor: 'text-purple-600',
        bgSolid: 'bg-purple-950/20'
      };
    default:
      return {
        label: 'Unknown',
        icon: Cloud,
        gradient: 'from-slate-400 to-slate-500',
        themeColor: 'text-slate-500',
        bgSolid: 'bg-slate-50'
      };
  }
}

export interface Recommendation {
  id: string;
  type: 'clothing' | 'activity' | 'protection' | 'alert';
  title: string;
  description: string;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
}

export function generateRecommendations(
  current: CurrentWeather,
  dailyForecasts: DailyForecast[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const temp = current.temperature;
  const code = current.weatherCode;
  const isRainy = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code);
  const isSnowy = [71, 73, 75, 77, 85, 86].includes(code);
  const isThunderstorm = [95, 96, 99].includes(code);

  // Get tomorrow's forecast to see if weather changes soon
  const todayForecast = dailyForecasts[0];
  const highWind = todayForecast ? todayForecast.windSpeedMax > 25 : current.windSpeed > 25;
  const highUV = todayForecast ? todayForecast.uvIndexMax > 6 : false;

  // 1. Clothing Recommendations
  if (temp < 10) {
    recommendations.push({
      id: 'wear-heavy',
      type: 'clothing',
      title: 'Wear Warm Layers',
      description: `With a chilly ${temp}°C, bundle up with a thick coat, scarf, gloves, and thermal wear to keep warm.`,
      icon: Shirt,
      bgColor: 'bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50',
      textColor: 'text-sky-700 dark:text-sky-300'
    });
  } else if (temp >= 10 && temp < 20) {
    recommendations.push({
      id: 'wear-medium',
      type: 'clothing',
      title: 'Wear Light Layers',
      description: `Cool and moderate (${temp}°C). A light jacket, cardigan, or sweater is perfect for this transitional weather.`,
      icon: Shirt,
      bgColor: 'bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50',
      textColor: 'text-zinc-700 dark:text-zinc-300'
    });
  } else {
    recommendations.push({
      id: 'wear-light',
      type: 'clothing',
      title: 'Wear Light & Breathable Clothes',
      description: `Warm temperatures (${temp}°C). Opt for cotton, linen, or loose shorts and t-shirts to stay cool and comfortable.`,
      icon: Shirt,
      bgColor: 'bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30',
      textColor: 'text-amber-700 dark:text-amber-300'
    });
  }

  // 2. Umbrella / Precipitation protection
  if (isRainy) {
    recommendations.push({
      id: 'umbrella',
      type: 'protection',
      title: 'Carry an Umbrella',
      description: 'Precipitation is active in your area. Don’t forget an umbrella, waterproof coat, or hood before heading out.',
      icon: Umbrella,
      bgColor: 'bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50',
      textColor: 'text-blue-700 dark:text-blue-300'
    });
  } else if (isSnowy) {
    recommendations.push({
      id: 'snow-protection',
      type: 'protection',
      title: 'Waterproof Boots',
      description: 'Snowy conditions. Wear insulated, water-resistant footwear with good traction to prevent slips and wet feet.',
      icon: Umbrella,
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50',
      textColor: 'text-indigo-700 dark:text-indigo-300'
    });
  } else {
    // Check if rain expected tomorrow/later today
    const rainForecasted = dailyForecasts.slice(0, 2).some(f => f.precipitationSum > 1.5);
    if (rainForecasted) {
      recommendations.push({
        id: 'rain-soon',
        type: 'protection',
        title: 'Keep Rain Gear Handy',
        description: 'Forecast suggests rain is expected in the coming hours or tomorrow. Keeping a small umbrella nearby is wise.',
        icon: Umbrella,
        bgColor: 'bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100/50 dark:border-sky-900/30',
        textColor: 'text-sky-600 dark:text-sky-300'
      });
    }
  }

  // 3. UV Protection
  if (highUV) {
    recommendations.push({
      id: 'uv-sunscreen',
      type: 'protection',
      title: 'Apply Sunscreen (UV index is high)',
      description: 'Sun intensity is high today. Apply SPF 30+ sunscreen, wear a wide-brimmed hat, and sport UV-protection sunglasses.',
      icon: Sun,
      bgColor: 'bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30',
      textColor: 'text-orange-700 dark:text-orange-300'
    });
  }

  // 4. Alerts
  if (isThunderstorm) {
    recommendations.push({
      id: 'thunder-alert',
      type: 'alert',
      title: 'Severe Thunderstorm Alert',
      description: 'Thunderstorms detected. Seek indoor shelter immediately. Avoid metallic structures, tall trees, and open waters.',
      icon: AlertTriangle,
      bgColor: 'bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50',
      textColor: 'text-red-700 dark:text-red-300'
    });
  } else if (highWind) {
    recommendations.push({
      id: 'wind-alert',
      type: 'alert',
      title: 'High Wind Warning',
      description: 'Strong gusts are active or forecasted. Secure lightweight patio furniture, trash cans, and be mindful of flying debris.',
      icon: Wind,
      bgColor: 'bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30',
      textColor: 'text-teal-700 dark:text-teal-300'
    });
  }

  // 5. Activity Recommendations
  if (!isRainy && !isSnowy && !highWind && temp >= 15 && temp <= 28) {
    recommendations.push({
      id: 'outdoor-activities',
      type: 'activity',
      title: 'Excellent Outdoor Weather',
      description: 'The atmosphere is highly pleasant. Great day for a jog, a bicycle ride, hiking, a local park picnic, or photography!',
      icon: Sparkles,
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30',
      textColor: 'text-emerald-700 dark:text-emerald-300'
    });
  } else if (isRainy || isSnowy || temp > 33 || temp < 5) {
    recommendations.push({
      id: 'indoor-activities',
      type: 'activity',
      title: 'Cozy Indoor Day Recommended',
      description: 'Harsh or wet outdoor environments. Perfect day to enjoy indoor hobbies, visit a museum, catch a movie, or read a book.',
      icon: Tv,
      bgColor: 'bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30',
      textColor: 'text-violet-700 dark:text-violet-300'
    });
  }

  return recommendations;
}

export function formatDayName(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatTimeLabel(timeStr: string): string {
  try {
    const date = new Date(timeStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return timeStr;
  }
}

export function getWindDirectionLabel(degree: number): string {
  const index = Math.round(degree / 45) % 8;
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[index];
}

export interface MoonDetails {
  phaseName: string;
  illumination: number; // 0 to 100
  moonrise: string;
  nextFullMoon: string;
}

export function getMoonDetails(dateStr: string): MoonDetails {
  try {
    const date = new Date(dateStr);
    const time = date.getTime();
    
    // A known new moon date: 1970-01-07 20:35:00 UTC
    const knownNewMoon = new Date('1970-01-07T20:35:00Z').getTime();
    const lunarCycle = 29.530588853; // synodic month (days)
    const msInDay = 86400000;
    
    const diffMs = time - knownNewMoon;
    const diffDays = diffMs / msInDay;
    const cycleCount = diffDays / lunarCycle;
    const ageOfMoon = (cycleCount - Math.floor(cycleCount)) * lunarCycle; // age in days
    
    const percentCycle = ageOfMoon / lunarCycle;
    
    // Calculate illumination percentage (0 to 100)
    const illumination = Math.round(50 * (1 - Math.cos(2 * Math.PI * percentCycle)));
    
    let phaseName = '';
    if (ageOfMoon < 1.845) phaseName = 'New Moon';
    else if (ageOfMoon < 5.536) phaseName = 'Waxing Crescent';
    else if (ageOfMoon < 9.228) phaseName = 'First Quarter';
    else if (ageOfMoon < 12.919) phaseName = 'Waxing Gibbous';
    else if (ageOfMoon < 16.611) phaseName = 'Full Moon';
    else if (ageOfMoon < 20.302) phaseName = 'Waning Gibbous';
    else if (ageOfMoon < 23.993) phaseName = 'Third Quarter';
    else if (ageOfMoon < 27.685) phaseName = 'Waning Crescent';
    else phaseName = 'New Moon';
    
    // Estimate Moonrise time
    let riseHourDecimal = (percentCycle * 24 + 6) % 24;
    let riseHour = Math.floor(riseHourDecimal);
    let riseMinute = Math.floor((riseHourDecimal - riseHour) * 60);
    let riseAMPM = riseHour >= 12 ? 'PM' : 'AM';
    let displayHour = riseHour % 12 === 0 ? 12 : riseHour % 12;
    let riseMinuteStr = riseMinute < 10 ? '0' + riseMinute : riseMinute.toString();
    let moonrise = `${displayHour}:${riseMinuteStr} ${riseAMPM}`;

    // Next Full Moon
    let daysToFull = 14.7652944 - ageOfMoon;
    if (daysToFull < 0) {
      daysToFull += lunarCycle;
    }
    const nextFullDate = new Date(time + daysToFull * msInDay);
    const nextFullMoon = nextFullDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return {
      phaseName,
      illumination,
      moonrise,
      nextFullMoon
    };
  } catch (e) {
    return {
      phaseName: 'Waxing Gibbous',
      illumination: 75,
      moonrise: '06:12 PM',
      nextFullMoon: 'Jul 31'
    };
  }
}
