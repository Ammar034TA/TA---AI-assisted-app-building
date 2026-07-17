export interface CityResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string; // State / Province
  timezone?: string;
  elevation?: number;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  isDay: boolean;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  time: string;
  pressure?: number;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  precipitationSum: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise?: string;
  sunset?: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
}

export interface WeatherData {
  city: CityResult;
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly?: HourlyForecast[];
  elevation: number;
  timezone: string;
}

export interface WeatherCodeDetails {
  label: string;
  iconName: string; // Used to resolve Lucide icons dynamically or select a static mapping
  bgGradient: string; // Tailwind background gradient for visual theme
  colorClass: string; // Theme color class
}
