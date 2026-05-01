"use client";

import { useState, useEffect } from "react";
import { Cloud, Droplets, Wind, Thermometer, RefreshCw, Sun, CloudRain } from "lucide-react";

interface WeatherData {
  air_temperature: number;
  track_temperature: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_direction: number;
  rainfall: number;
  track_temperature_change: string;
  air_temperature_change: string;
  wind_speed_change: string;
  conditions: "sunny" | "cloudy" | "rainy";
  session_key?: number;
  circuit?: string;
}

// Japan GP 2026 (Suzuka) mock weather data
const mockJapanWeather: WeatherData = {
  air_temperature: 19.4,
  track_temperature: 37.0,
  humidity: 46.1,
  pressure: 1012.1,
  wind_speed: 3.1,
  wind_direction: 115,
  rainfall: 0,
  track_temperature_change: "steady",
  air_temperature_change: "rising",
  wind_speed_change: "steady",
  conditions: "sunny",
  session_key: 11253,
  circuit: "Suzuka"
};

export function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      setError(null);
      try {
        // Try fetching latest race session to get session_key
        let sessionKey = "latest";
        
        // First try to get the most recent race session
        try {
          const sessionsRes = await fetch(
            "https://api.openf1.org/v1/sessions?year=2026&session_type=Race",
            { signal: AbortSignal.timeout(8000) }
          );
          if (sessionsRes.ok) {
            const sessions = await sessionsRes.json();
            // Find the most recent completed race (Japan GP was March 29, 2026)
            const now = new Date();
            const completedRaces = sessions.filter((s: any) => 
              new Date(s.date_end) < now && !s.is_cancelled
            );
            if (completedRaces.length > 0) {
              // Get the last completed race
              sessionKey = completedRaces[completedRaces.length - 1].session_key.toString();
            }
          }
        } catch {
          // Use session_key=latest as fallback
        }

        const response = await fetch(
          `https://api.openf1.org/v1/weather?session_key=${sessionKey}`,
          { signal: AbortSignal.timeout(8000) }
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const w = data[0];
            // Determine conditions based on rainfall and cloud cover
            let conditions: "sunny" | "cloudy" | "rainy" = "sunny";
            if (w.rainfall > 0) {
              conditions = "rainy";
            } else if (w.humidity > 70 || w.pressure < 1000) {
              conditions = "cloudy";
            }

            setWeather({
              air_temperature: w.air_temperature ?? 0,
              track_temperature: w.track_temperature ?? 0,
              humidity: w.humidity ?? 0,
              pressure: w.pressure ?? 0,
              wind_speed: w.wind_speed ?? 0,
              wind_direction: w.wind_direction ?? 0,
              rainfall: w.rainfall ?? 0,
              track_temperature_change: w.track_temperature_change ?? "steady",
              air_temperature_change: w.air_temperature_change ?? "steady",
              wind_speed_change: w.wind_speed_change ?? "steady",
              conditions,
              session_key: w.session_key,
              circuit: w.circuit_short_name || w.location
            });
            setLastUpdate(new Date());
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Error fetching weather:", err);
        setError("Using cached data");
      }

      // Fallback to mock Japan GP data
      setWeather(mockJapanWeather);
      setLastUpdate(new Date());
      setLoading(false);
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getWindDirection = (degrees: number): string => {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const getChangeIcon = (change: string): string => {
    switch (change) {
      case "rising": return "↑";
      case "falling": return "↓";
      default: return "→";
    }
  };

  const getConditionIcon = (conditions: string) => {
    switch (conditions) {
      case "rainy": return <CloudRain className="w-8 h-8 text-blue-500" />;
      case "cloudy": return <Cloud className="w-8 h-8 text-gray-400" />;
      default: return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getConditionLabel = (conditions: string) => {
    switch (conditions) {
      case "rainy": return "Rainy";
      case "cloudy": return "Cloudy";
      default: return "Sunny";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold">Weather Conditions</h2>
          {weather?.circuit && (
            <span className="text-sm text-muted-foreground ml-2">— {weather.circuit}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-amber-500">{error}</span>}
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">
              Updated: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {weather && (
        <>
          {/* Main weather cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Track Temperature */}
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="w-5 h-5 text-orange-500" />
                <span className="text-sm text-muted-foreground">Track Temp</span>
              </div>
              <div className="text-3xl font-bold">{weather.track_temperature.toFixed(1)}°C</div>
              <div className={`text-xs ${
                weather.track_temperature_change === "rising" ? "text-red-500" :
                weather.track_temperature_change === "falling" ? "text-blue-500" :
                "text-muted-foreground"
              }`}>
                {getChangeIcon(weather.track_temperature_change)} change
              </div>
            </div>

            {/* Air Temperature */}
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="w-5 h-5 text-cyan-500" />
                <span className="text-sm text-muted-foreground">Air Temp</span>
              </div>
              <div className="text-3xl font-bold">{weather.air_temperature.toFixed(1)}°C</div>
              <div className={`text-xs ${
                weather.air_temperature_change === "rising" ? "text-red-500" :
                weather.air_temperature_change === "falling" ? "text-blue-500" :
                "text-muted-foreground"
              }`}>
                {getChangeIcon(weather.air_temperature_change)} change
              </div>
            </div>

            {/* Humidity */}
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-muted-foreground">Humidity</span>
              </div>
              <div className="text-3xl font-bold">{weather.humidity}%</div>
              <div className="text-xs text-muted-foreground">Relative humidity</div>
            </div>

            {/* Conditions */}
            <div className="p-4 rounded-lg border bg-card flex flex-col items-center justify-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                weather.conditions === "rainy" 
                  ? "bg-blue-500/20" 
                  : weather.conditions === "cloudy"
                  ? "bg-gray-500/20"
                  : "bg-yellow-500/20"
              }`}>
                {getConditionIcon(weather.conditions)}
              </div>
              <div className="mt-2 text-sm font-medium">
                {getConditionLabel(weather.conditions)}
              </div>
            </div>
          </div>

          {/* Wind & Pressure */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Wind Speed */}
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-5 h-5 text-teal-500" />
                <span className="text-sm text-muted-foreground">Wind Speed</span>
              </div>
              <div className="text-3xl font-bold">{weather.wind_speed.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">km/h {getChangeIcon(weather.wind_speed_change)}</div>
            </div>

            {/* Wind Direction */}
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-5 h-5 text-teal-500" />
                <span className="text-sm text-muted-foreground">Wind Dir</span>
              </div>
              <div className="text-3xl font-bold">{getWindDirection(weather.wind_direction)}</div>
              <div className="text-xs text-muted-foreground">{weather.wind_direction}°</div>
            </div>

            {/* Pressure */}
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-muted-foreground">Pressure</span>
              </div>
              <div className="text-3xl font-bold">{weather.pressure.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">hPa</div>
            </div>

            {/* Rainfall */}
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className={`w-5 h-5 ${weather.rainfall > 0 ? "text-blue-500" : "text-gray-400"}`} />
                <span className="text-sm text-muted-foreground">Rainfall</span>
              </div>
              <div className="text-3xl font-bold">
                {weather.rainfall > 0 ? `${weather.rainfall}mm` : "Dry"}
              </div>
              <div className="text-xs text-muted-foreground">
                {weather.rainfall > 0 ? "Track wet" : "No rain"}
              </div>
            </div>
          </div>

          {/* Warning for rain */}
          {weather.rainfall > 0 && (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-blue-500">Wet track conditions</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Rainfall detected on track. Intermediates or wet tires recommended.
              </p>
            </div>
          )}

          {/* Wind direction indicator */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="text-sm text-muted-foreground mb-2">Wind Direction</div>
            <div className="flex items-center justify-center">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-2 border-muted"></div>
                <div 
                  className="absolute top-1/2 left-1/2 w-10 h-1 bg-blue-500 origin-left"
                  style={{ transform: `translate(-50%, -50%) rotate(${weather.wind_direction}deg)` }}
                >
                  <div className="absolute right-0 w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 text-xs">N</div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs">S</div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-xs">W</div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-xs">E</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
