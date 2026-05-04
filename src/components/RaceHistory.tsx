"use client";

import { useState, useEffect } from "react";
import { Flag, Search } from "lucide-react";

interface PositionRecord {
  driver_number: number;
  driver_name: string;
  team_name: string;
  team_color: string;
  positions_by_lap: number[];
  total_laps: number;
  final_position: number;
  fastest_lap: number;
  fastest_lap_time?: string;
  pit_stops: number;
}


export function RaceHistory() {
  const [raceHistory, setRaceHistory] = useState<PositionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLap, setSelectedLap] = useState<number>(42);
  const [highlightFastestLap, setHighlightFastestLap] = useState(false);

  useEffect(() => {
    async function fetchRaceHistory() {
      try {
        const response = await fetch("https://api.openf1.org/v1/position?session_key=latest");
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            // Transform position data into race history
            const drivers = Array.from(new Set(data.map((p: any) => p.driver_number))) as number[];
            const history: PositionRecord[] = drivers.map((driverNum: number) => {
              const driverPositions = data
                .filter((p: any) => p.driver_number === driverNum)
                .sort((a: any, b: any) => a.lap - b.lap);
              
              return {
                driver_number: driverNum,
                driver_name: driverPositions[0]?.driver_code || `DRV${driverNum}`,
                team_name: driverPositions[0]?.team_name || "Unknown",
                team_color: driverPositions[0]?.team_colour || "666666",
                positions_by_lap: driverPositions.map((p: any) => p.position),
                total_laps: driverPositions.length,
                final_position: driverPositions[driverPositions.length - 1]?.position || 0,
                fastest_lap: 0,
                pit_stops: 0,
              };
            });
            
            if (history.length > 0) {
              setRaceHistory(history.sort((a, b) => a.final_position - b.final_position));
              setLoading(false);
              return;
            }
          }
        }
      } catch (error) {
        console.error("Error fetching race history:", error);
      }
      setRaceHistory([]); // no mock fallback
      setLoading(false);
    }

    fetchRaceHistory();
  }, []);

  const filteredHistory = raceHistory.filter(r => {
    if (!search) return true;
    return r.driver_name.toLowerCase().includes(search.toLowerCase()) ||
           r.team_name.toLowerCase().includes(search.toLowerCase()) ||
           r.driver_number.toString().includes(search);
  });

  const totalLaps = Math.max(...filteredHistory.map(r => r.total_laps), 42);
  const laps = Array.from({ length: totalLaps }, (_, i) => i + 1);

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
        <Flag className="w-5 h-5 text-purple-500" />
        <h2 className="text-lg font-semibold">Race History</h2>
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

        <label className="flex items-center gap-2 px-3 py-2 rounded-md border bg-background text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={highlightFastestLap}
            onChange={(e) => setHighlightFastestLap(e.target.checked)}
            className="rounded"
          />
          Highlight fastest lap
        </label>

        <select
          value={selectedLap}
          onChange={(e) => setSelectedLap(Number(e.target.value))}
          className="px-3 py-2 rounded-md border bg-background text-sm"
        >
          {laps.filter(l => l % 5 === 0 || l === 1 || l === totalLaps).map(lap => (
            <option key={lap} value={lap}>Lap {lap}</option>
          ))}
        </select>
      </div>

      {/* Race position chart */}
      <div className="rounded-lg border bg-card p-4 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Lap numbers */}
          <div className="flex mb-2">
            <div className="w-24 flex-shrink-0"></div>
            {laps.filter(l => l % 5 === 0 || l === 1).map(lap => (
              <div
                key={lap}
                className={`flex-1 text-center text-xs ${
                  lap === selectedLap ? "font-bold text-primary" : "text-muted-foreground"
                }`}
              >
                {lap}
              </div>
            ))}
          </div>

          {/* Position lines */}
          <div className="space-y-1">
            {filteredHistory.map((record, driverIndex) => (
              <div key={record.driver_number} className="flex items-center">
                {/* Driver info */}
                <div className="w-24 flex-shrink-0 pr-2">
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-4 rounded"
                      style={{ backgroundColor: record.team_color.startsWith('#') ? record.team_color : `#${record.team_color}` }}
                    />
                    <span className="text-xs font-medium truncate">
                      {record.driver_name}
                    </span>
                  </div>
                </div>

                {/* Position dots */}
                <div className="flex-1 flex">
                  {record.positions_by_lap.map((position, lapIndex) => {
                    const lap = lapIndex + 1;
                    const showLabel = lap % 5 === 0 || lap === 1;
                    
                    return (
                      <div
                        key={lapIndex}
                        className={`flex-1 flex items-center justify-center ${
                          lap === record.fastest_lap && highlightFastestLap ? "bg-yellow-500/20" : ""
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold transition-all ${
                            position === 1 ? "bg-yellow-500 text-black" :
                            position === 2 ? "bg-gray-400 text-black" :
                            position === 3 ? "bg-amber-600 text-white" :
                            "bg-muted text-muted-foreground"
                          } ${lap === selectedLap ? "ring-2 ring-primary" : ""}`}
                        >
                          {position}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>1st</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span>2nd</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-600"></div>
              <span>3rd</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-muted"></div>
              <span>Other</span>
            </div>
          </div>
        </div>
      </div>

      {/* Driver cards with stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHistory.slice(0, 6).map((record, index) => (
          <div
            key={record.driver_number}
            className="p-4 rounded-lg border bg-card"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-8 rounded"
                style={{ backgroundColor: record.team_color.startsWith('#') ? record.team_color : `#${record.team_color}` }}
              />
              <div>
                <div className="font-bold">#{record.driver_number} {record.driver_name}</div>
                <div className="text-xs text-muted-foreground">{record.team_name}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className={`text-xl font-bold ${
                  record.final_position === 1 ? "text-yellow-500" :
                  record.final_position === 2 ? "text-gray-400" :
                  record.final_position === 3 ? "text-amber-600" : ""
                }`}>
                  P{record.final_position}
                </div>
                <div className="text-xs text-muted-foreground">Finish</div>
              </div>
              <div>
                <div className="text-xl font-bold">{record.total_laps}</div>
                <div className="text-xs text-muted-foreground">Laps</div>
              </div>
              <div>
                <div className="text-xl font-bold">{record.pit_stops}</div>
                <div className="text-xs text-muted-foreground">Pits</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHistory.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          No race history data available.
        </div>
      )}
    </div>
  );
}
