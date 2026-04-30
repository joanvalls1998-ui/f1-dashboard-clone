"use client";

import { useState, useEffect } from "react";
import { Clock, TrendingUp, Search } from "lucide-react";

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

// Mock data for sector times
const mockSectorTimes: SectorTime[] = [
  { driver_number: 1, driver_name: "VER", team_name: "Red Bull Racing", team_color: "3671c6", lap: 42, sector_1_time: 28.123, sector_2_time: 32.456, sector_3_time: 31.877, lap_time: 92.456, tyre: "MEDIUM", is_personal_best: true },
  { driver_number: 16, driver_name: "LEC", team_name: "Ferrari", team_color: "e8002d", lap: 42, sector_1_time: 28.234, sector_2_time: 32.567, sector_3_time: 31.877, lap_time: 92.678, tyre: "MEDIUM", is_personal_best: true },
  { driver_number: 55, driver_name: "NOR", team_name: "McLaren", team_color: "ff8000", lap: 42, sector_1_time: 28.345, sector_2_time: 32.678, sector_3_time: 31.867, lap_time: 92.890, tyre: "MEDIUM", is_personal_best: true },
  { driver_number: 11, driver_name: "PER", team_name: "Red Bull Racing", team_color: "3671c6", lap: 41, sector_1_time: 28.456, sector_2_time: 32.789, sector_3_time: 31.767, lap_time: 93.012, tyre: "HARD", is_personal_best: false },
  { driver_number: 44, driver_name: "HAM", team_name: "Mercedes", team_color: "27f4d2", lap: 41, sector_1_time: 28.567, sector_2_time: 32.890, sector_3_time: 31.777, lap_time: 93.234, tyre: "MEDIUM", is_personal_best: true },
  { driver_number: 14, driver_name: "ALO", team_name: "Aston Martin", team_color: "229971", lap: 41, sector_1_time: 28.678, sector_2_time: 32.901, sector_3_time: 31.877, lap_time: 93.456, tyre: "HARD", is_personal_best: false },
  { driver_number: 63, driver_name: "RUS", team_name: "Mercedes", team_color: "27f4d2", lap: 40, sector_1_time: 28.789, sector_2_time: 32.912, sector_3_time: 31.866, lap_time: 93.567, tyre: "HARD", is_personal_best: false },
  { driver_number: 81, driver_name: "PIA", team_name: "McLaren", team_color: "ff8000", lap: 40, sector_1_time: 28.890, sector_2_time: 32.923, sector_3_time: 31.865, lap_time: 93.678, tyre: "MEDIUM", is_personal_best: false },
  { driver_number: 18, driver_name: "STR", team_name: "Aston Martin", team_color: "229971", lap: 40, sector_1_time: 28.901, sector_2_time: 32.934, sector_3_time: 31.954, lap_time: 93.789, tyre: "HARD", is_personal_best: false },
  { driver_number: 27, driver_name: "HUL", team_name: "Haas F1 Team", team_color: "b6babd", lap: 39, sector_1_time: 29.012, sector_2_time: 32.945, sector_3_time: 31.933, lap_time: 93.890, tyre: "HARD", is_personal_best: false },
];

export function SectorTimes() {
  const [sectorTimes, setSectorTimes] = useState<SectorTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"lap_time" | "sector_1" | "sector_2" | "sector_3">("lap_time");
  const [selectedLap, setSelectedLap] = useState<number>(42);

  useEffect(() => {
    async function fetchSectorTimes() {
      try {
        // Try OpenF1 API
        const response = await fetch("https://api.openf1.org/v1/laps?session_key=latest&limit=100");
        if (response.ok) {
          const data = await response.json();
          // Transform and sort by lap time
          const transformed = (data as any[]).map((lap: any) => ({
            driver_number: lap.driver_number,
            driver_name: lap.driver_code || `DRV${lap.driver_number}`,
            team_name: lap.team_name || "Unknown",
            team_color: lap.team_colour || "666666",
            lap: lap.lap_number,
            sector_1_time: lap.s1 || 0,
            sector_2_time: lap.s2 || 0,
            sector_3_time: lap.s3 || 0,
            lap_time: lap.lap_time || 0,
            tyre: lap.tyre_compound || "UNKNOWN",
            is_personal_best: lap.is_personal_best || false,
          })).filter((l: SectorTime) => l.lap_time > 0);
          
          if (transformed.length > 0) {
            setSectorTimes(transformed.sort((a, b) => a.lap_time - b.lap_time));
            setSelectedLap(transformed[0]?.lap || 42);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching sector times:", error);
      }
      // Use mock data
      setSectorTimes(mockSectorTimes);
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

  const bestS1 = Math.min(...filteredDrivers.map(s => s.sector_1_time).filter(t => t > 0));
  const bestS2 = Math.min(...filteredDrivers.map(s => s.sector_2_time).filter(t => t > 0));
  const bestS3 = Math.min(...filteredDrivers.map(s => s.sector_3_time).filter(t => t > 0));
  const bestLap = Math.min(...filteredDrivers.map(s => s.lap_time).filter(t => t > 0));

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
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 rounded-md border bg-background text-sm"
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
        >
          {[...new Set(sectorTimes.map(s => s.lap))].sort((a, b) => b - a).slice(0, 20).map(lap => (
            <option key={lap} value={lap}>Lap {lap}</option>
          ))}
        </select>
      </div>

      {/* Best sectors */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
          <div className="text-xs text-muted-foreground">Best S1</div>
          <div className="text-lg font-bold text-green-500">{bestS1.toFixed(3)}</div>
        </div>
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
          <div className="text-xs text-muted-foreground">Best S2</div>
          <div className="text-lg font-bold text-green-500">{bestS2.toFixed(3)}</div>
        </div>
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
          <div className="text-xs text-muted-foreground">Best S3</div>
          <div className="text-lg font-bold text-green-500">{bestS3.toFixed(3)}</div>
        </div>
        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-center">
          <div className="text-xs text-muted-foreground">Best Lap</div>
          <div className="text-lg font-bold text-yellow-500">{bestLap.toFixed(3)}</div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Pos</th>
                <th className="text-left p-3 font-medium">Driver</th>
                <th className="text-center p-3 font-medium">Tyre</th>
                <th className="text-center p-3 font-medium">S1</th>
                <th className="text-center p-3 font-medium">S2</th>
                <th className="text-center p-3 font-medium">S3</th>
                <th className="text-center p-3 font-medium">Lap Time</th>
                <th className="text-center p-3 font-medium">Gap</th>
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
                        style={{ backgroundColor: `#${sector.team_color}` }}
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
                    sector.sector_1_time === bestS1 ? "text-green-500 font-bold" : ""
                  }`}>
                    {formatTime(sector.sector_1_time)}
                  </td>
                  <td className={`p-3 text-center font-mono ${
                    sector.sector_2_time === bestS2 ? "text-green-500 font-bold" : ""
                  }`}>
                    {formatTime(sector.sector_2_time)}
                  </td>
                  <td className={`p-3 text-center font-mono ${
                    sector.sector_3_time === bestS3 ? "text-green-500 font-bold" : ""
                  }`}>
                    {formatTime(sector.sector_3_time)}
                  </td>
                  <td className={`p-3 text-center font-mono font-bold ${
                    sector.lap_time === bestLap ? "text-yellow-500" : ""
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
      )}

      {filteredDrivers.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          No sector times data available for this lap.
        </div>
      )}
    </div>
  );
}
