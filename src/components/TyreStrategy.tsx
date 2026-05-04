"use client";

import { useState, useEffect } from "react";
import { CircleDot, Search, Clock } from "lucide-react";
import { TableSkeleton } from "@/components/Skeletons";

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
      setLoading(true);
      try {
        // Find latest completed race session
        let sessionKey = "latest";
        const sessionsRes = await fetch(
          "https://api.openf1.org/v1/sessions?year=2026&session_type=Race",
          { signal: AbortSignal.timeout(8000) }
        );
        if (sessionsRes.ok) {
          const sessions = await sessionsRes.json();
          const completed = (sessions || [])
            .filter((s: any) => new Date(s.date_end) < new Date() && !s.is_cancelled);
          if (completed.length > 0) {
            sessionKey = completed[completed.length - 1].session_key;
          }
        }

        const response = await fetch(
          `https://api.openf1.org/v1/stints?session_key=${sessionKey}`,
          { signal: AbortSignal.timeout(8000) }
        );

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
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
      // No mock fallback
      setStrategies([]);
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

  if (loading) return <TableSkeleton rows={6} />;

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

      {filteredStrategies.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No strategy data available.
        </div>
      )}
    </div>
  );
}
