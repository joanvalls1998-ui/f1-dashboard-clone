"use client";

import { useState, useEffect } from "react";
import { Radio, Clock, Gauge, RefreshCw } from "lucide-react";

interface LiveDriver {
  driver_number: number;
  last_name: string;
  team_name: string;
  team_color: string;
  position: number;
  gap_to_leader: string;
  interval: string;
  current_lap: number;
  current_lap_time: string;
  speed: number;
  sector_1_time: string;
  sector_2_time: string;
  sector_3_time: string;
  pit_lap: number;
  tyre: string;
}

interface LiveData {
  session_key: number;
  meeting_key: number;
  date: string;
  drivers: LiveDriver[];
}

const TYRE_COLORS: Record<string, string> = {
  "SOFT": "#ff3333",
  "MEDIUM": "#ffff33",
  "HARD": "#ffffff",
  "INTER": "#33ff33",
  "WET": "#3399ff",
  "UNKNOWN": "#666666"
};

// Mock data for when API is not available
const mockLiveDrivers: LiveDriver[] = [
  { driver_number: 1, last_name: "VER", team_name: "Red Bull Racing", team_color: "3671c6", position: 1, gap_to_leader: "--", interval: "--", current_lap: 42, current_lap_time: "1:32.456", speed: 285, sector_1_time: "28.123", sector_2_time: "32.456", sector_3_time: "31.877", pit_lap: 18, tyre: "MEDIUM" },
  { driver_number: 16, last_name: "LEC", team_name: "Ferrari", team_color: "e8002d", position: 2, gap_to_leader: "+2.847", interval: "+2.847", current_lap: 42, current_lap_time: "1:32.678", speed: 283, sector_1_time: "28.234", sector_2_time: "32.567", sector_3_time: "31.877", pit_lap: 18, tyre: "MEDIUM" },
  { driver_number: 55, last_name: "NOR", team_name: "McLaren", team_color: "ff8000", position: 3, gap_to_leader: "+5.123", interval: "+2.276", current_lap: 42, current_lap_time: "1:32.890", speed: 284, sector_1_time: "28.345", sector_2_time: "32.678", sector_3_time: "31.867", pit_lap: 18, tyre: "MEDIUM" },
  { driver_number: 11, last_name: "PER", team_name: "Red Bull Racing", team_color: "3671c6", position: 4, gap_to_leader: "+8.456", interval: "+3.333", current_lap: 41, current_lap_time: "1:33.012", speed: 282, sector_1_time: "28.456", sector_2_time: "32.789", sector_3_time: "31.767", pit_lap: 17, tyre: "HARD" },
  { driver_number: 44, last_name: "HAM", team_name: "Mercedes", team_color: "27f4d2", position: 5, gap_to_leader: "+12.234", interval: "+3.778", current_lap: 41, current_lap_time: "1:33.234", speed: 281, sector_1_time: "28.567", sector_2_time: "32.890", sector_3_time: "31.777", pit_lap: 19, tyre: "MEDIUM" },
  { driver_number: 14, last_name: "ALO", team_name: "Aston Martin", team_color: "229971", position: 6, gap_to_leader: "+15.678", interval: "+3.444", current_lap: 41, current_lap_time: "1:33.456", speed: 280, sector_1_time: "28.678", sector_2_time: "32.901", sector_3_time: "31.877", pit_lap: 18, tyre: "HARD" },
  { driver_number: 63, last_name: "RUS", team_name: "Mercedes", team_color: "27f4d2", position: 7, gap_to_leader: "+18.901", interval: "+3.223", current_lap: 40, current_lap_time: "1:33.567", speed: 279, sector_1_time: "28.789", sector_2_time: "32.912", sector_3_time: "31.866", pit_lap: 18, tyre: "HARD" },
  { driver_number: 81, last_name: "PIA", team_name: "McLaren", team_color: "ff8000", position: 8, gap_to_leader: "+22.345", interval: "+3.444", current_lap: 40, current_lap_time: "1:33.678", speed: 278, sector_1_time: "28.890", sector_2_time: "32.923", sector_3_time: "31.865", pit_lap: 19, tyre: "MEDIUM" },
  { driver_number: 18, last_name: "STR", team_name: "Aston Martin", team_color: "229971", position: 9, gap_to_leader: "+25.678", interval: "+3.333", current_lap: 40, current_lap_time: "1:33.789", speed: 277, sector_1_time: "28.901", sector_2_time: "32.934", sector_3_time: "31.954", pit_lap: 18, tyre: "HARD" },
  { driver_number: 27, last_name: "HUL", team_name: "Haas F1 Team", team_color: "b6babd", position: 10, gap_to_leader: "+30.123", interval: "+4.445", current_lap: 39, current_lap_time: "1:33.890", speed: 276, sector_1_time: "28.012", sector_2_time: "32.945", sector_3_time: "31.933", pit_lap: 17, tyre: "HARD" },
];

export function LiveTiming() {
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [drivers, setDrivers] = useState<LiveDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  useEffect(() => {
    async function fetchLiveData() {
      try {
        // Try to fetch from OpenF1 live endpoint
        const response = await fetch("https://api.openf1.org/v1/live");
        if (response.ok) {
          const data = await response.json();
          
          // Transform OpenF1 data to our format
          const transformedDrivers: LiveDriver[] = data.drivers?.map((d: any) => ({
            driver_number: d.driver_number,
            last_name: d.last_name || `Driver ${d.driver_number}`,
            team_name: d.team_name || "Unknown",
            team_color: d.team_colour || d.team_color || "666666",
            position: d.position || 0,
            gap_to_leader: d.gap_to_leader || "--",
            interval: d.interval || "--",
            current_lap: d.current_lap || 0,
            current_lap_time: d.current_lap_time || "--:--.---",
            speed: d.speed || 0,
            sector_1_time: d.sector_1_time || "--",
            sector_2_time: d.sector_2_time || "--",
            sector_3_time: d.sector_3_time || "--",
            pit_lap: d.pit_lap || 0,
            tyre: d.tyre_compound || "UNKNOWN"
          })) || [];
          
          if (transformedDrivers.length > 0) {
            setDrivers(transformedDrivers.sort((a, b) => a.position - b.position));
            setLiveData(data);
            setIsLive(true);
          } else {
            // Use mock data if no live data
            setDrivers(mockLiveDrivers);
            setIsLive(false);
          }
        } else {
          // Use mock data if API fails
          setDrivers(mockLiveDrivers);
          setIsLive(false);
        }
      } catch (error) {
        console.error("Error fetching live data:", error);
        // Use mock data on error
        setDrivers(mockLiveDrivers);
        setIsLive(false);
      }
      setLastUpdate(new Date());
      setLoading(false);
    }

    fetchLiveData();

    // Auto refresh every 3 seconds if enabled
    if (autoRefresh) {
      const interval = setInterval(fetchLiveData, 3000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const filteredDrivers = showOnlyActive 
    ? drivers.filter(d => d.position > 0)
    : drivers;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Radio className={`w-5 h-5 ${isLive ? "text-red-500 animate-pulse" : "text-gray-500"}`} />
          <h2 className="text-lg font-semibold">Live Timing</h2>
          {isLive && (
            <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
              LIVE
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">
              Updated: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 rounded-md border ${autoRefresh ? "bg-primary/10 border-primary" : "bg-background"}`}
            title={autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyActive}
            onChange={(e) => setShowOnlyActive(e.target.checked)}
            className="rounded"
          />
          Show only active drivers
        </label>
      </div>

      {/* Live grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-muted-foreground">
            <div className="col-span-1">POS</div>
            <div className="col-span-2">DRIVER</div>
            <div className="col-span-1">LAP</div>
            <div className="col-span-2">TIME / GAP</div>
            <div className="col-span-1">TYRE</div>
            <div className="col-span-2 hidden md:block">SECTORS</div>
            <div className="col-span-1 hidden md:block">PIT</div>
            <div className="col-span-2">SPEED</div>
            <div className="col-span-1">TEAM</div>
          </div>

          {/* Driver rows */}
          {filteredDrivers.map((driver) => (
            <div
              key={driver.driver_number}
              className="grid grid-cols-12 gap-2 px-3 py-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              {/* Position */}
              <div className="col-span-1 flex items-center">
                <span className={`font-bold text-lg ${
                  driver.position === 1 ? "text-yellow-500" :
                  driver.position === 2 ? "text-gray-400" :
                  driver.position === 3 ? "text-amber-600" :
                  "text-foreground"
                }`}>
                  {driver.position}
                </span>
              </div>

              {/* Driver */}
              <div className="col-span-2 flex items-center gap-2">
                <div
                  className="w-2 h-8 rounded-full"
                  style={{ backgroundColor: `#${driver.team_color}` }}
                />
                <div>
                  <div className="font-bold">#{driver.driver_number}</div>
                  <div className="text-xs text-muted-foreground">{driver.last_name}</div>
                </div>
              </div>

              {/* Lap */}
              <div className="col-span-1 flex items-center">
                <div className="text-center">
                  <div className="font-medium">{driver.current_lap}</div>
                  <div className="text-xs text-muted-foreground">LAP</div>
                </div>
              </div>

              {/* Time / Gap */}
              <div className="col-span-2 flex items-center">
                <div>
                  <div className="font-mono text-sm">{driver.current_lap_time}</div>
                  <div className="text-xs text-muted-foreground">
                    {driver.gap_to_leader === "--" ? "LEADER" : driver.gap_to_leader}
                  </div>
                </div>
              </div>

              {/* Tyre */}
              <div className="col-span-1 flex items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
                  style={{ 
                    backgroundColor: TYRE_COLORS[driver.tyre] || TYRE_COLORS["UNKNOWN"],
                    borderColor: driver.tyre === "INTER" || driver.tyre === "WET" ? "#333" : "transparent"
                  }}
                  title={driver.tyre}
                >
                  {driver.tyre[0]}
                </div>
              </div>

              {/* Sectors */}
              <div className="col-span-2 hidden md:flex items-center gap-1">
                <div className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                  driver.sector_1_time !== "--" ? "bg-green-500/20 text-green-500" : "bg-muted"
                }`}>
                  {driver.sector_1_time}
                </div>
                <div className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                  driver.sector_2_time !== "--" ? "bg-green-500/20 text-green-500" : "bg-muted"
                }`}>
                  {driver.sector_2_time}
                </div>
                <div className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                  driver.sector_3_time !== "--" ? "bg-green-500/20 text-green-500" : "bg-muted"
                }`}>
                  {driver.sector_3_time}
                </div>
              </div>

              {/* Pit */}
              <div className="col-span-1 hidden md:flex items-center">
                <span className="text-sm">
                  {driver.pit_lap > 0 ? driver.pit_lap : "-"}
                </span>
              </div>

              {/* Speed */}
              <div className="col-span-2 flex items-center gap-1">
                <Gauge className="w-4 h-4 text-muted-foreground" />
                <span className="font-bold">{driver.speed}</span>
                <span className="text-xs text-muted-foreground">km/h</span>
              </div>

              {/* Team color bar */}
              <div className="col-span-1 flex items-center justify-end">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: `#${driver.team_color}` }}
                  title={driver.team_name}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-4 border-t text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: TYRE_COLORS["SOFT"] }}></div>
          <span>Soft</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: TYRE_COLORS["MEDIUM"] }}></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-gray-300" style={{ backgroundColor: TYRE_COLORS["HARD"] }}></div>
          <span>Hard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: TYRE_COLORS["INTER"] }}></div>
          <span>Intermediate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: TYRE_COLORS["WET"] }}></div>
          <span>Wet</span>
        </div>
      </div>
    </div>
  );
}
