"use client";

import { useState, useEffect } from "react";
import { Gauge, Search, TrendingUp, Zap } from "lucide-react";

interface SpeedData {
  driver_number: number;
  driver_name: string;
  team_name: string;
  team_color: string;
  speed: number;
  is_fastest: boolean;
  gap_to_fastest: number;
  location?: string;
}

// Mock speed trap data for fallback (realistic Japan GP Suzuka speeds)
const mockSpeedData: SpeedData[] = [
  { driver_number: 1, driver_name: "VER", team_name: "Red Bull Racing", team_color: "3671c6", speed: 318, is_fastest: true, gap_to_fastest: 0 },
  { driver_number: 16, driver_name: "LEC", team_name: "Ferrari", team_color: "e8002d", speed: 317, is_fastest: false, gap_to_fastest: -1 },
  { driver_number: 55, driver_name: "NOR", team_name: "McLaren", team_color: "ff8000", speed: 316, is_fastest: false, gap_to_fastest: -2 },
  { driver_number: 44, driver_name: "HAM", team_name: "Mercedes", team_color: "27f4d2", speed: 315, is_fastest: false, gap_to_fastest: -3 },
  { driver_number: 11, driver_name: "PER", team_name: "Red Bull Racing", team_color: "3671c6", speed: 315, is_fastest: false, gap_to_fastest: -3 },
  { driver_number: 81, driver_name: "PIA", team_name: "McLaren", team_color: "ff8000", speed: 314, is_fastest: false, gap_to_fastest: -4 },
  { driver_number: 14, driver_name: "ALO", team_name: "Aston Martin", team_color: "229971", speed: 313, is_fastest: false, gap_to_fastest: -5 },
  { driver_number: 63, driver_name: "RUS", team_name: "Mercedes", team_color: "27f4d2", speed: 312, is_fastest: false, gap_to_fastest: -6 },
  { driver_number: 18, driver_name: "STR", team_name: "Aston Martin", team_color: "229971", speed: 311, is_fastest: false, gap_to_fastest: -7 },
  { driver_number: 10, driver_name: "GAS", team_name: "Alpine", team_color: "ff87bc", speed: 310, is_fastest: false, gap_to_fastest: -8 },
  { driver_number: 27, driver_name: "HUL", team_name: "Haas F1 Team", team_color: "b6babd", speed: 309, is_fastest: false, gap_to_fastest: -9 },
  { driver_number: 31, driver_name: "OCO", team_name: "Alpine", team_color: "ff87bc", speed: 308, is_fastest: false, gap_to_fastest: -10 },
];

export function SpeedTrap() {
  const [speeds, setSpeeds] = useState<SpeedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"speed" | "team" | "driver">("speed");
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<"live" | "mock">("mock");

  useEffect(() => {
    async function fetchSpeedData() {
      setError(null);
      try {
        // First get the most recent race session key
        let sessionKey: number | null = null;
        
        try {
          const sessionsRes = await fetch(
            "https://api.openf1.org/v1/sessions?year=2026&session_type=Race",
            { signal: AbortSignal.timeout(8000) }
          );
          if (sessionsRes.ok) {
            const sessions = await sessionsRes.json();
            const now = new Date();
            const completedRaces = sessions.filter((s: any) => 
              new Date(s.date_end) < now && !s.is_cancelled
            );
            if (completedRaces.length > 0) {
              sessionKey = completedRaces[completedRaces.length - 1].session_key;
            }
          }
        } catch (e) {
          console.log("Could not fetch session, using mock data");
        }

        // Try speed_trap endpoint first
        if (sessionKey) {
          try {
            const trapRes = await fetch(
              `https://api.openf1.org/v1/speed_trap?session_key=${sessionKey}`,
              { signal: AbortSignal.timeout(8000) }
            );
            
            if (trapRes.ok) {
              const trapData = await trapRes.json();
              if (trapData && trapData.length > 0) {
                // Process speed trap data
                const driverSpeeds = new Map<number, SpeedData>();
                
                trapData.forEach((entry: any) => {
                  const existing = driverSpeeds.get(entry.driver_number);
                  if (!existing || (entry.speed && entry.speed > existing.speed)) {
                    driverSpeeds.set(entry.driver_number, {
                      driver_number: entry.driver_number,
                      driver_name: entry.driver_code || `DRV${entry.driver_number}`,
                      team_name: entry.team_name || "Unknown",
                      team_color: entry.team_colour || "666666",
                      speed: entry.speed || 0,
                      is_fastest: false,
                      gap_to_fastest: 0,
                      location: entry.location || "Speed Trap",
                    });
                  }
                });

                const speedsArray = Array.from(driverSpeeds.values()).sort((a, b) => b.speed - a.speed);
                if (speedsArray.length > 0) {
                  const maxSpeed = Math.max(...speedsArray.map(s => s.speed));
                  speedsArray.forEach(s => {
                    s.is_fastest = s.speed === maxSpeed;
                    s.gap_to_fastest = s.speed - maxSpeed;
                  });
                  
                  setSpeeds(speedsArray);
                  setDataSource("live");
                  setLoading(false);
                  return;
                }
              }
            }
          } catch (e) {
            console.log("Speed trap endpoint failed, trying car_data");
          }
        }

        // Fallback to car_data which has speed information
        try {
          const carRes = await fetch(
            "https://api.openf1.org/v1/car_data?session_key=latest&limit=500",
            { signal: AbortSignal.timeout(8000) }
          );
          
          if (carRes.ok) {
            const carData = await carRes.json();
            if (carData && carData.length > 0) {
              const driverSpeeds = new Map<number, SpeedData>();
              
              carData.forEach((item: any) => {
                if (item.speed && item.speed > 0) {
                  const existing = driverSpeeds.get(item.driver_number);
                  if (!existing || item.speed > existing.speed) {
                    driverSpeeds.set(item.driver_number, {
                      driver_number: item.driver_number,
                      driver_name: item.driver_code || `DRV${item.driver_number}`,
                      team_name: item.team_name || "Unknown",
                      team_color: item.team_colour || "666666",
                      speed: Math.round(item.speed),
                      is_fastest: false,
                      gap_to_fastest: 0,
                    });
                  }
                }
              });

              const speedsArray = Array.from(driverSpeeds.values()).sort((a, b) => b.speed - a.speed);
              if (speedsArray.length > 0) {
                const maxSpeed = Math.max(...speedsArray.map(s => s.speed));
                speedsArray.forEach(s => {
                  s.is_fastest = s.speed === maxSpeed;
                  s.gap_to_fastest = s.speed - maxSpeed;
                });
                
                setSpeeds(speedsArray);
                setDataSource("live");
                setLoading(false);
                return;
              }
            }
          }
        } catch (e) {
          console.log("Car data fetch failed, using mock");
        }

      } catch (err) {
        console.error("Error fetching speed data:", err);
        setError("Using demo data");
      }
      
      // Final fallback to mock data
      setSpeeds(mockSpeedData);
      setDataSource("mock");
      setLoading(false);
    }

    fetchSpeedData();
  }, []);

  const filteredSpeeds = speeds
    .filter(s => {
      if (!search) return true;
      return s.driver_name.toLowerCase().includes(search.toLowerCase()) ||
             s.team_name.toLowerCase().includes(search.toLowerCase()) ||
             s.driver_number.toString().includes(search);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "team": return a.team_name.localeCompare(b.team_name);
        case "driver": return a.driver_name.localeCompare(b.driver_name);
        default: return b.speed - a.speed;
      }
    });

  const maxSpeed = Math.max(...filteredSpeeds.map(s => s.speed), 0);
  const avgSpeed = filteredSpeeds.length > 0 
    ? Math.round(filteredSpeeds.reduce((acc, s) => acc + s.speed, 0) / filteredSpeeds.length)
    : 0;

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
          <Gauge className="w-5 h-5 text-green-500" />
          <h2 className="text-lg font-semibold">Speed Trap</h2>
        </div>
        {dataSource === "mock" && (
          <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-500">
            Demo Data
          </span>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 rounded-lg border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Zap className="w-4 h-4" />
            Fastest
          </div>
          <div className="text-2xl font-bold text-green-500">{maxSpeed} <span className="text-sm font-normal">km/h</span></div>
        </div>
        <div className="p-3 rounded-lg border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <TrendingUp className="w-4 h-4" />
            Average
          </div>
          <div className="text-2xl font-bold">{avgSpeed} <span className="text-sm font-normal">km/h</span></div>
        </div>
        <div className="p-3 rounded-lg border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Gauge className="w-4 h-4" />
            Drivers
          </div>
          <div className="text-2xl font-bold">{filteredSpeeds.length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search driver or team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 rounded-md border bg-background text-sm"
        >
          <option value="speed">Sort by Speed</option>
          <option value="team">Sort by Team</option>
          <option value="driver">Sort by Driver</option>
        </select>
      </div>

      {/* Speeds visualization */}
      <div className="space-y-2">
        {filteredSpeeds.map((speed, index) => {
          const widthPercent = maxSpeed > 0 ? (speed.speed / maxSpeed) * 100 : 0;
          
          return (
            <div
              key={speed.driver_number}
              className={`p-3 rounded-lg border ${
                speed.is_fastest ? "bg-yellow-500/10 border-yellow-500/30" : "bg-card"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                    <span className={`font-bold ${
                      index === 0 ? "text-yellow-500" :
                      index === 1 ? "text-gray-400" :
                      index === 2 ? "text-amber-600" : ""
                    }`}>
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-6 rounded"
                      style={{ backgroundColor: `#${speed.team_color}` }}
                    />
                    <div>
                      <div className="font-medium">#{speed.driver_number} {speed.driver_name}</div>
                      <div className="text-xs text-muted-foreground">{speed.team_name}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {speed.is_fastest && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-yellow-500 text-black rounded">
                      FASTEST
                    </span>
                  )}
                  <div className="text-right">
                    <div className="text-2xl font-bold">{speed.speed}</div>
                    <div className="text-xs text-muted-foreground">km/h</div>
                  </div>
                </div>
              </div>
              
              {/* Speed bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    speed.is_fastest ? "bg-yellow-500" : "bg-green-500"
                  }`}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {filteredSpeeds.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          No speed data available.
        </div>
      )}
    </div>
  );
}
