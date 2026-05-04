"use client";

import { useState, useEffect } from "react";
import { Clock, Search, AlertCircle } from "lucide-react";
import { getTeamColor } from "@/lib/f1-assets";

interface SectorTime {
  driver_number: number;
  driver_name: string;
  team_name: string;
  team_color: string;
  lap: number;
  sector_1_time: number;
  sector_2_time: number;
  sector_3_time: number;
  lap_time: number;
  tyre: string;
  is_personal_best: boolean;
}

export function SectorTimes() {
  const [sectorTimes, setSectorTimes] = useState<SectorTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"lap_time" | "sector_1" | "sector_2" | "sector_3">("lap_time");
  const [selectedLap, setSelectedLap] = useState<number>(42);

  useEffect(() => {
    async function fetchSectorTimes() {
      try {
        // Try Ergast for race laps (most reliable historical source)
        const response = await fetch(
          "https://api.jolpi.ca/ergast/f1/2026/3/laps.json?limit=2000",
          { signal: AbortSignal.timeout(8000) }
        );
        if (response.ok) {
          const data = await response.json();
          const race = data.MRData?.RaceTable?.Races?.[0];
          if (race?.LapTable?.[0]?.Timings) {
            const timings = race.LapTable[0].Timings;
            const driverLaps: Record<string, any[]> = {};
            timings.forEach((t: any) => {
              if (!driverLaps[t.driverId]) driverLaps[t.driverId] = [];
              driverLaps[t.driverId].push(t);
            });

            const transformed: SectorTime[] = Object.entries(driverLaps)
              .filter(([, laps]) => laps.some((l: any) => l.number === "42"))
              .map(([driverId, laps]) => {
                const lap42 = laps.find((l: any) => l.number === "42");
                const bestLap = laps.reduce((best: any, curr: any) => {
                  const b = parseFloat(best.time);
                  const c = parseFloat(curr.time);
                  return c < b ? curr : best;
                });
                return {
                  driver_number: parseInt(driverId) || 0,
                  driver_name: driverId.slice(0, 3).toUpperCase(),
                  team_name: "Unknown",
                  team_color: "666666",
                  lap: parseInt(lap42?.number || "42"),
                  sector_1_time: 0,
                  sector_2_time: 0,
                  sector_3_time: 0,
                  lap_time: parseFloat(lap42?.time || "0"),
                  tyre: "UNKNOWN",
                  is_personal_best: lap42?.time === bestLap?.time,
                };
              })
              .filter((l: SectorTime) => l.lap_time > 0)
              .sort((a, b) => a.lap_time - b.lap_time);

            if (transformed.length > 0) {
              setSectorTimes(transformed);
              setSelectedLap(transformed[0]?.lap || 42);
              setLoading(false);
              return;
            }
          }
        }
      } catch (error) {
        console.error("Error fetching sector times:", error);
      }
      setSectorTimes([]);
      setLoading(false);
    }

    fetchSectorTimes();
  }, []);

  const filteredDrivers = sectorTimes
    .filter(s => {
      const matchesSearch = search === "" ||
        s.driver_name.toLowerCase().includes(search.toLowerCase()) ||
        s.driver_number.toString().includes(search);
      const matchesLap = s.lap === selectedLap;
      return matchesSearch && matchesLap;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "sector_1": return a.sector_1_time - b.sector_1_time;
        case "sector_2": return a.sector_2_time - b.sector_2_time;
        case "sector_3": return a.sector_3_time - b.sector_3_time;
        default: return a.lap_time - b.lap_time;
      }
    });

  const validS1 = filteredDrivers.map(s => s.sector_1_time).filter(t => t > 0);
  const validS2 = filteredDrivers.map(s => s.sector_2_time).filter(t => t > 0);
  const validS3 = filteredDrivers.map(s => s.sector_3_time).filter(t => t > 0);
  const validLap = filteredDrivers.map(s => s.lap_time).filter(t => t > 0);
  const bestS1 = validS1.length > 0 ? Math.min(...validS1) : 0;
  const bestS2 = validS2.length > 0 ? Math.min(...validS2) : 0;
  const bestS3 = validS3.length > 0 ? Math.min(...validS3) : 0;
  const bestLap = validLap.length > 0 ? Math.min(...validLap) : 0;

  const formatTime = (time: number): string => {
    if (time === 0) return "--";
    return time.toFixed(3);
  };

  const getGap = (time: number): string => {
    if (time === 0 || time === bestLap) return "Leader";
    return `+${(time - bestLap).toFixed(3)}`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold">Sector Times</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm"
            aria-label="Search drivers"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 rounded-md border bg-background text-sm"
          aria-label="Sort by sector"
        >
          <option value="lap_time">Sort by Lap Time</option>
          <option value="sector_1">Sort by S1</option>
          <option value="sector_2">Sort by S2</option>
          <option value="sector_3">Sort by S3</option>
        </select>

        <select
          value={selectedLap}
          onChange={(e) => setSelectedLap(Number(e.target.value))}
          className="px-3 py-2 rounded-md border bg-background text-sm"
          aria-label="Select lap"
        >
          {Array.from(new Set(sectorTimes.map(s => s.lap))).sort((a, b) => b - a).slice(0, 20).map(lap => (
            <option key={lap} value={lap}>Lap {lap}</option>
          ))}
        </select>
      </div>

      {/* Best sectors */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
          <div className="text-xs text-muted-foreground">Best S1</div>
          <div className="text-lg font-bold text-green-500">{formatTime(bestS1)}</div>
        </div>
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
          <div className="text-xs text-muted-foreground">Best S2</div>
          <div className="text-lg font-bold text-green-500">{formatTime(bestS2)}</div>
        </div>
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
          <div className="text-xs text-muted-foreground">Best S3</div>
          <div className="text-lg font-bold text-green-500">{formatTime(bestS3)}</div>
        </div>
        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-center">
          <div className="text-xs text-muted-foreground">Best Lap</div>
          <div className="text-lg font-bold text-yellow-500">{formatTime(bestLap)}</div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12" role="status" aria-label="Loading">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="rounded-lg border bg-card overflow-hidden" role="region" aria-label="Sector times table">
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Sector times by driver">
              <thead className="bg-muted">
                <tr>
                  <th scope="col" className="text-left p-3 font-medium">Pos</th>
                  <th scope="col" className="text-left p-3 font-medium">Driver</th>
                  <th scope="col" className="text-center p-3 font-medium">Tyre</th>
                  <th scope="col" className="text-center p-3 font-medium">S1</th>
                  <th scope="col" className="text-center p-3 font-medium">S2</th>
                  <th scope="col" className="text-center p-3 font-medium">S3</th>
                  <th scope="col" className="text-center p-3 font-medium">Lap Time</th>
                  <th scope="col" className="text-center p-3 font-medium">Gap</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.slice(0, 20).map((sector, index) => (
                  <tr key={`${sector.driver_number}-${sector.lap}`} className="border-t hover:bg-muted/50">
                    <td className="p-3">
                      <span className={`font-bold ${
                        index === 0 ? "text-yellow-500" :
                        index === 1 ? "text-gray-400" :
                        index === 2 ? "text-amber-600" : ""
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-6 rounded-full"
                          style={{ backgroundColor: getTeamColor(sector.team_name) }}
                          aria-hidden="true"
                        />
                        <div>
                          <div className="font-medium">#{sector.driver_number} {sector.driver_name}</div>
                          <div className="text-xs text-muted-foreground">{sector.team_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-1 rounded text-xs font-bold bg-muted">
                        {sector.tyre}
                      </span>
                    </td>
                    <td className={`p-3 text-center font-mono ${
                      sector.sector_1_time === bestS1 && bestS1 > 0 ? "text-green-500 font-bold" : ""
                    }`}>
                      {formatTime(sector.sector_1_time)}
                    </td>
                    <td className={`p-3 text-center font-mono ${
                      sector.sector_2_time === bestS2 && bestS2 > 0 ? "text-green-500 font-bold" : ""
                    }`}>
                      {formatTime(sector.sector_2_time)}
                    </td>
                    <td className={`p-3 text-center font-mono ${
                      sector.sector_3_time === bestS3 && bestS3 > 0 ? "text-green-500 font-bold" : ""
                    }`}>
                      {formatTime(sector.sector_3_time)}
                    </td>
                    <td className={`p-3 text-center font-mono font-bold ${
                      sector.lap_time === bestLap && bestLap > 0 ? "text-yellow-500" : ""
                    }`}>
                      {formatTime(sector.lap_time)}
                    </td>
                    <td className="p-3 text-center text-muted-foreground">
                      {getGap(sector.lap_time)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredDrivers.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2" role="status" aria-live="polite">
          <AlertCircle className="w-8 h-8" />
          <p>No sector times data available for this lap.</p>
        </div>
      )}
    </div>
  );
}
