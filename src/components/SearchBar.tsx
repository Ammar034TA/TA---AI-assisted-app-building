import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Navigation } from 'lucide-react';
import { CityResult } from '../types';

interface SearchBarProps {
  onSelectCity: (city: CityResult) => void;
  isLoading: boolean;
}

const POPULAR_CITIES: Omit<CityResult, 'id'>[] = [
  { name: 'London', latitude: 51.50853, longitude: -0.12574, country: 'United Kingdom', country_code: 'GB', admin1: 'England' },
  { name: 'New York', latitude: 40.71427, longitude: -74.00597, country: 'United States', country_code: 'US', admin1: 'New York' },
  { name: 'Tokyo', latitude: 35.6895, longitude: 139.6917, country: 'Japan', country_code: 'JP', admin1: 'Tokyo' },
  { name: 'Paris', latitude: 48.85341, longitude: 2.3488, country: 'France', country_code: 'FR', admin1: 'Île-de-France' },
  { name: 'Sydney', latitude: -33.86785, longitude: 151.20732, country: 'Australia', country_code: 'AU', admin1: 'New South Wales' }
];

export default function SearchBar({ onSelectCity, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setTimeout(() => setLocationError(null), 4000);
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          let cityName = 'Current Location';
          let country = 'Local Area';
          let country_code = '';
          let admin1 = '';

          if (response.ok) {
            const data = await response.json();
            cityName = data.city || data.locality || data.principalSubdivision || 'Current Location';
            country = data.countryName || 'Local Area';
            country_code = data.countryCode || '';
            admin1 = data.principalSubdivision || '';
          }

          const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto';

          const locatedCity: CityResult = {
            id: Date.now(),
            name: cityName,
            latitude,
            longitude,
            country,
            country_code,
            admin1,
            timezone: browserTimezone
          };

          onSelectCity(locatedCity);
          setQuery(`${cityName}${country ? `, ${country}` : ''}`);
        } catch (error) {
          console.error('Error in reverse geocoding:', error);
          const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto';
          const locatedCity: CityResult = {
            id: Date.now(),
            name: 'Current Location',
            latitude,
            longitude,
            country: 'Local Coordinates',
            country_code: '',
            timezone: browserTimezone
          };
          onSelectCity(locatedCity);
          setQuery(`Current Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMsg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location access was denied. Please allow location permissions.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'The request to get user location timed out.';
        }
        setLocationError(errorMsg);
        setIsLocating(false);
        setTimeout(() => setLocationError(null), 5000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch geocoding search suggestions as user types (debounced)
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en`
        );
        const data = await response.json();
        if (data.results) {
          setSuggestions(data.results);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching geocoding data:', error);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        onSelectCity(data.results[0]);
        setShowDropdown(false);
      } else {
        // We will let the App component handle the error globally, but we can alert locally or clear
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectCityHandler = (city: CityResult) => {
    onSelectCity(city);
    setQuery(`${city.name}${city.country ? `, ${city.country}` : ''}`);
    setShowDropdown(false);
  };

  const clearInput = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3" id="search-section">
      <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
        <div className="relative flex-1" ref={dropdownRef}>
          <form onSubmit={handleFormSubmit} className="relative w-full h-full">
            <input
              id="city-search-input"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search city (e.g. London, New York, Tokyo)..."
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-12 pr-10 py-3 text-sm font-medium text-slate-100 shadow-lg focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-500 h-full"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              {isLoading || isSearching || isLocating ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin text-blue-400" />
              ) : (
                <Search className="h-4.5 w-4.5" />
              )}
            </div>
            {query && (
              <button
                id="clear-search-button"
                type="button"
                onClick={clearInput}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 rounded-full hover:bg-slate-800/80 transition-colors flex items-center justify-center"
                title="Clear input"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown */}
          {showDropdown && (suggestions.length > 0 || isSearching) && (
            <div
              id="search-suggestions-dropdown"
              className="absolute z-50 w-full mt-2 bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200"
            >
              {isSearching && suggestions.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-400 flex items-center justify-center gap-2 font-medium">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  Searching geographical coordinates...
                </div>
              ) : (
                <ul className="divide-y divide-slate-800/50">
                  {suggestions.map((city) => (
                    <li key={`${city.latitude}-${city.longitude}-${city.id}`}>
                      <button
                        id={`city-suggestion-${city.id}`}
                        type="button"
                        onClick={() => selectCityHandler(city)}
                        className="w-full text-left px-5 py-3 hover:bg-slate-800/40 flex items-center gap-3 transition-colors group"
                      >
                        <MapPin className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors text-sm">
                            {city.name}
                          </span>
                          {city.admin1 && (
                            <span className="text-slate-500 text-xs ml-2 font-medium">
                              {city.admin1}
                            </span>
                          )}
                          <span className="text-slate-400 text-xs block mt-0.5">
                            {city.country}
                          </span>
                        </div>
                        <span className="text-[10px] bg-slate-950/60 border border-slate-800 text-slate-500 px-2 py-0.5 rounded font-mono shrink-0">
                          {city.country_code}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Prominent Current Location Button */}
        <button
          id="prominent-use-location-button"
          type="button"
          onClick={handleUseLocation}
          disabled={isLocating || isLoading}
          className={`px-5 py-3 sm:py-0 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all border shrink-0 ${
            isLocating
              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse'
              : 'bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white border-blue-500/20 hover:border-blue-500/80 shadow-md'
          }`}
          title="Detect and use current coordinates"
        >
          {isLocating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
              <span>Detecting Location...</span>
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4 rotate-45 text-blue-400 group-hover:text-white shrink-0" />
              <span>Use Current Location</span>
            </>
          )}
        </button>
      </div>

      {/* Geolocation Error Alert */}
      {locationError && (
        <div id="location-error-msg" className="mt-2 text-xs font-semibold text-red-400 bg-red-950/25 border border-red-900/30 rounded-xl py-2 px-3.5 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="flex-1">{locationError}</span>
        </div>
      )}

      {/* Popular Quick-Select Cities */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 px-2 animate-in fade-in duration-300" id="quick-select-cities">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mr-2">
          Quick Access:
        </span>
        {POPULAR_CITIES.map((city) => (
          <button
            id={`quick-select-${city.name.toLowerCase().replace(' ', '-')}`}
            key={city.name}
            onClick={() => onSelectCity({ ...city, id: Math.random() } as CityResult)}
            className="text-xs font-semibold bg-slate-900/40 hover:bg-slate-800/60 text-slate-300 hover:text-blue-400 px-3 py-1.5 rounded-lg transition-all border border-slate-800/80 hover:border-slate-700"
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
}
