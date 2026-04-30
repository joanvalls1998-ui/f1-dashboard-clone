"use client";

import { useState, useEffect } from "react";
import { CircleDot, Search, Clock } from "lucide-react";

interface TyreStint {
  driver_number: number;
  driver_name: string;
  team_name: string;
  team_color: string;
  compound: string;
  start_lap: number;
  end_lap: number;
  total_laps: number;
  tyre_age: number;
}

interface DriverStrategy {
  driver_number: number;
  driver_name: string;
  team_name: string;
  team_color: string;
  current_compound: string;
  total_pits: number;
  stints: TyreStint[];
}

const mockStrategies: DriverStrategy[] = [
  {
    driver_number: 1,
    driver_name: "VER",
    team_name: "Red Bull Racing",
    team_color: "3671c6",
    current_compound: "MEDIUM",
    total_pits: 1,
    stints: [
      { driver_number: 1, driver_name: "VER", team_name: "Red Bull Racing", team_color: "3671c6", compound: "MEDIUM", start_lap: 1, end_lap: 18, total_laps: 18, tyre_age: 18 },
      { driver_number: 1, driver_name: "VER", team_name: "Red Bull Racing", team_color: "3671c6", compound: "HARD", start_lap: 19, end_lap: 42, total_laps: 24, tyre_age: 24 },
    ]
  },
  {
    driver_number: 16,
    driver_name: "LEC",
    team_name: "Ferrari",
    team_color: "e8002d",
    current_compound: "MEDIUM",
    total_pits: 1,
    stints: [
      { driver_number: 16, driver_name: "LEC", team_name: "Ferrari", team_color: "e8002d", compound: "MEDIUM", start_lap: 1, end_lap: 18, total_laps: 18, tyre_age: 18 },
      { driver_number: 16, driver_name: "LEC", team_name: "Ferrari", team_color: "e8002d", compound: "HARD", start_lap: 19, end_lap: 42, total_laps: 24, tyre_age: 24 },
    ]
  },
  {
    driver_number: 55,
    driver_name: "NOR",
    team_name: "McLaren",
    team_color: "ff8000",
    current_compound: "MEDIUM",
    total_pits: 1,
    stints: [
      { driver_number: 55, driver_name: "NOR", team_name: "McLaren", team_color: "ff8000", compound: "MEDIUM", start_lap: 1, end_lap: 18, total_laps: 18, tyre_age: 18 },
      { driver_number: 55, driver_name: "NOR", team_name: "McLaren", team_color: "ff8000", compound: "HARD", start_lap: 19, end_lap: 42, total_laps: 24, tyre_age: 24 },
    ]
  },
  {
    driver_number: 11,
    driver_name: "PER",
    team_name: "Red Bull Racing",
    team_color: "3671c6",
    current_compound: "HARD",
    total_pits: 1,
    stints: [
      { driver_number: 11, driver_name: "PER", team_name: "Red Bull Racing", team_color: "3671c6", compound: "HARD", start_lap: 1, end_lap: 17, total_laps: 17, tyre_age: 17 },
      { driver_number: 11, driver_name: "PER", team_name: "Red Bull Racing", team_color: "3671c6", compound: "MEDIUM", start_lap: 18, end_lap: 42, total_laps: 25, tyre_age: 25 },
    ]
  },
  {
    driver_number: 44,
    driver_name: "HAM",
    team_name: "Mercedes",
    team_color: "27f4d2",
    current_compound: "MEDIUM",
    total_pits: 1,
    stints: [
      { driver_number: 44, driver_name: "HAM", team_name: "Mercedes", team_color: "27f4d2", compound: "HARD", start_lap: 1, end_lap: 19, total_laps: 19, tyre_age: 19 },
      { driver_number: 44, driver_name: "HAM", team_name: "Mercedes", team_color: "27f4d2", compound: "MEDIUM", start_lap: 20, end_lap: 42, total_laps: 23, tyre_age: 23 },
    ]
  },
  {
    driver_number: 14,
    driver_name: "ALO",
    team_name: "Aston Martin",
    team_color: "229971",
    current_compound: "HARD",
    total_pits: 1,
    stints: [
      { driver_number: 14, driver_name: "ALO", team_name: "Aston Martin", team_color: "229971", compound: "MEDIUM", start_lap: 1, end_lap: 18, total_laps: 18, tyre_age: 18 },
      { driver_number: 14, driver_name: "ALO", team_name: "Aston Martin", team_color: "229971", compound: "HARD", start_lap: 19, end_lap: 42, total_laps: 24, tyre_age: 24 },
    ]
  },
];

const TYRE_COLORS: Record<string, string> = {
  "SOFT": "#ff3333",
  "MEDIUM": "#ffff33",
  "HARD": "#ffffff",
  "INTER": "#33ff33",
  "WET": "#3399ff",
  "UNKNOWN": "#666666"
};

export function TyreStrategy() {
  const [strategies, setStrategies] = useState<DriverStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchStrategies() {
      try {
        const response = await fetch("https://api.openf1.org/v1/stints?session_key=latest");
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            // Transform stints data into strategies
            const drivers = Array.from(new Set(data.map((s: any) => s.driver_number))) as number[];
            const transformed: DriverStrategy[] = drivers.map((driverNum: number) => {
              const driverStints = data.filter((s: any) => s.driver_number === driverNum);
              return {
                driver_number: driverNum,
                driver_name: driverStints[0]?.driver_code || `DRV${driverNum}`,
                team_name: driverStints[0]?.team_name || "Unknown",
                team_color: driverStints[0]?.team_colour || "666666",
                current_compound: driverStints[driverStints.length - 1]?.compound || "UNKNOWN",
                total_pits: driverStints.length - 1,
                stints: driverStints.map((s: any) => ({
                  driver_number: s.driver_number,
                  driver_name: s.driver_code || `DRV${s.driver_number}`,
                  team_name: s.team_name || "Unknown",
                  team_color: s.team_colour || "666666",
                  compound: s.compound || "UNKNOWN",
                  start_lap: s.lap_start || 1,
                  end_lap: s.lap_end || 1,
                  total_laps: (s.lap_end || 1) - (s.lap_start || 1) + 1,
                  tyre_age: s.tyre_age_at_start || 0,
                })),
              };
            });
            setStrategies(transformed);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching strategies:", error);
      }
      setStrategies(mockStrategies);
      setLoading(false);
    }

    fetchStrategies();
  }, []);

  const filteredStrategies = strategies.filter(s => {
    if (!search) return true;
    return s.driver_name.toLowerCase().includes(search.toLowerCase()) ||
           s.team_name.toLowerCase().includes(search.toLowerCase()) ||
           s.driver_number.toString().includes(search);
  });

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
      <div className="flex items-center gap-2">
        <CircleDot className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-semibold">Tyre Strategy</h2>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by driver or team..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm"
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        {Object.entries(TYRE_COLORS).filter(([key]) => key !== "UNKNOWN").map(([compound, color]) => (
          <div key={compound} className="flex items-center gap-1">
            <div 
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
            />
            <span>{compound}</span>
          </div>
        ))}
      </div>

      {/* Strategy cards */}
      <div className="space-y-4">
        {filteredStrategies.map((strategy) => (
          <div
            key={strategy.driver_number}
            className="rounded-lg border bg-card overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-10 rounded"
                  style={{ backgroundColor: `#${strategy.team_color}` }}
                />
                <div>
                  <div className="font-bold">#{strategy.driver_number} {strategy.driver_name}</div>
                  <div className="text-xs text-muted-foreground">{strategy.team_name}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold">{strategy.total_pits}</div>
                  <div className="text-xs text-muted-foreground">Pits</div>
                </div>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2"
                  style={{ 
                    backgroundColor: TYRE_COLORS[strategy.current_compound] || TYRE_COLORS["UNKNOWN"],
                    borderColor: strategy.current_compound === "INTER" || strategy.current_compound === "WET" ? "#333" : "transparent"
                  }}
                >
                  {strategy.current_compound[0]}
                </div>
              </div>
            </div>

            {/* Stints visualization */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Stints</span>
              </div>
              
              <div className="space-y-2">
                {strategy.stints.map((stint, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {/* Stint number */}
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    
                    {/* Tyre bar */}
                    <div 
                      className="h-8 rounded flex items-center justify-center text-xs font-bold"
                      style={{ 
                        backgroundColor: TYRE_COLORS[stint.compound] || TYRE_COLORS["UNKNOWN"],
                        width: `${Math.max(40, stint.total_laps * 3)}px`,
                        color: stint.compound === "HARD" || stint.compound === "INTER" ? "#333" : "#fff"
                      }}
                    >
                      {stint.compound}
                    </div>
                    
                    {/* Lap range */}
                    <div className="text-sm">
                      <span className="font-medium">Laps {stint.start_lap}-{stint.end_lap}</span>
                      <span className="text-muted-foreground"> ({stint.total_laps} laps, Age: {stint.tyre_age})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStrategies.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          No strategy data available.
        </div>
      )}
    </div>
  );
}
