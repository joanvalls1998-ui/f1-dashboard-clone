"use client";

import { useState, useEffect } from "react";
import { Flag, Search } from "lucide-react";

interface GridPosition {
  position: number;
  driver_number: number;
  driver_name: string;
  team_name: string;
  team_color: string;
  q1_time: string | null;
  q2_time: string | null;
  q3_time: string | null;
  tyre_used: string;
}

const mockGrid: GridPosition[] = [
  { position: 1, driver_number: 1, driver_name: "VER", team_name: "Red Bull Racing", team_color: "3671c6", q1_time: "1:30.123", q2_time: "1:29.456", q3_time: "1:28.789", tyre_used: "SOFT" },
  { position: 2, driver_number: 16, driver_name: "LEC", team_name: "Ferrari", team_color: "e8002d", q1_time: "1:30.234", q2_time: "1:29.567", q3_time: "1:28.890", tyre_used: "SOFT" },
  { position: 3, driver_number: 55, driver_name: "NOR", team_name: "McLaren", team_color: "ff8000", q1_time: "1:30.345", q2_time: "1:29.678", q3_time: "1:29.001", tyre_used: "SOFT" },
  { position: 4, driver_number: 11, driver_name: "PER", team_name: "Red Bull Racing", team_color: "3671c6", q1_time: "1:30.456", q2_time: "1:29.789", q3_time: "1:29.123", tyre_used: "SOFT" },
  { position: 5, driver_number: 44, driver_name: "HAM", team_name: "Mercedes", team_color: "27f4d2", q1_time: "1:30.567", q2_time: "1:29.890", q3_time: "1:29.234", tyre_used: "MEDIUM" },
  { position: 6, driver_number: 14, driver_name: "ALO", team_name: "Aston Martin", team_color: "229971", q1_time: "1:30.678", q2_time: "1:30.001", q3_time: "1:29.345", tyre_used: "MEDIUM" },
  { position: 7, driver_number: 63, driver_name: "RUS", team_name: "Mercedes", team_color: "27f4d2", q1_time: "1:30.789", q2_time: "1:30.123", q3_time: "1:29.456", tyre_used: "MEDIUM" },
  { position: 8, driver_number: 81, driver_name: "PIA", team_name: "McLaren", team_color: "ff8000", q1_time: "1:30.890", q2_time: "1:30.234", q3_time: "1:29.567", tyre_used: "SOFT" },
  { position: 9, driver_number: 18, driver_name: "STR", team_name: "Aston Martin", team_color: "229971", q1_time: "1:31.001", q2_time: "1:30.345", q3_time: "1:29.678", tyre_used: "MEDIUM" },
  { position: 10, driver_number: 27, driver_name: "HUL", team_name: "Haas F1 Team", team_color: "b6babd", q1_time: "1:31.123", q2_time: "1:30.456", q3_time: "1:29.789", tyre_used: "SOFT" },
  { position: 11, driver_number: 31, driver_name: "OCO", team_name: "Alpine", team_color: "ff87bc", q1_time: "1:31.234", q2_time: "1:30.567", q3_time: null, tyre_used: "HARD" },
  { position: 12, driver_number: 10, driver_name: "GAS", team_name: "Alpine", team_color: "ff87bc", q1_time: "1:31.345", q2_time: "1:30.678", q3_time: null, tyre_used: "HARD" },
  { position: 13, driver_number: 24, driver_name: "ZHO", team_name: "Kick Sauber", team_color: "52e252", q1_time: "1:31.456", q2_time: null, q3_time: null, tyre_used: "MEDIUM" },
  { position: 14, driver_number: 77, driver_name: "BOT", team_name: "Kick Sauber", team_color: "52e252", q1_time: "1:31.567", q2_time: null, q3_time: null, tyre_used: "MEDIUM" },
  { position: 15, driver_number: 4, driver_name: "MAG", team_name: "Haas F1 Team", team_color: "b6babd", q1_time: "1:31.678", q2_time: null, q3_time: null, tyre_used: "HARD" },
  { position: 16, driver_number: 20, driver_name: "MAG", team_name: "Haas F1 Team", team_color: "b6babd", q1_time: "1:31.789", q2_time: null, q3_time: null, tyre_used: "HARD" },
  { position: 17, driver_number: 22, driver_name: "TSU", team_name: "RB", team_color: "6692ff", q1_time: "1:31.890", q2_time: null, q3_time: null, tyre_used: "MEDIUM" },
  { position: 18, driver_number: 3, driver_name: "RIC", team_name: "RB", team_color: "6692ff", q1_time: "1:32.001", q2_time: null, q3_time: null, tyre_used: "MEDIUM" },
  { position: 19, driver_number: 43, driver_name: "ALB", team_name: "Williams", team_color: "64c4ff", q1_time: "1:32.123", q2_time: null, q3_time: null, tyre_used: "HARD" },
  { position: 20, driver_number: 6, driver_name: "SAR", team_name: "Williams", team_color: "64c4ff", q1_time: "1:32.234", q2_time: null, q3_time: null, tyre_used: "HARD" },
];

const TYRE_COLORS: Record<string, string> = {
  "SOFT": "#ff3333",
  "MEDIUM": "#ffff33",
  "HARD": "#ffffff",
  "INTER": "#33ff33",
  "WET": "#3399ff",
};

export function StartingGrid() {
  const [grid, setGrid] = useState<GridPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchGrid() {
      try {
        const response = await fetch("https://api.openf1.org/v1/qualifying?session_key=latest");
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            const transformed: GridPosition[] = data.map((q: any) => ({
              position: q.position || 0,
              driver_number: q.driver_number,
              driver_name: q.driver_code || \`DRV\${q.driver_number}\`,
              team_name: q.team_name || "Unknown",
              team_color: q.team_colour || "666666",
              q1_time: q.q1 || null,
              q2_time: q.q2 || null,
              q3_time: q.q3 || null,
              tyre_used: q.tyre_compound || "MEDIUM",
            })).sort((a: GridPosition, b: GridPosition) => a.position - b.position);
            
            setGrid(transformed);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching grid:", error);
      }
      setGrid(mockGrid);
      setLoading(false);
    }

    fetchGrid();
  }, []);

  const filteredGrid = grid.filter(g => {
    if (!search) return true;
    return g.driver_name.toLowerCase().includes(search.toLowerCase()) ||
           g.team_name.toLowerCase().includes(search.toLowerCase()) ||
           g.driver_number.toString().includes(search);
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
        <Flag className="w-5 h-5 text-green-500" />
        <h2 className="text-lg font-semibold">Starting Grid</h2>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search driver or team..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm"
        />
      </div>

      {/* Grid visualization */}
      <div className="rounded-lg border bg-card overflow-hidden">
        {/* Row 1 - Pole */}
        <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-transparent border-b">
          <div className="flex items-center justify-center gap-8">
            {filteredGrid.filter(g => g.position <= 2).map((driver) => (
              <div key={driver.position} className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  driver.position === 1 ? "text-yellow-500" : "text-gray-400"
                }`}>
                  {driver.position === 1 ? "POLE" : \`P\${driver.position}\`}
                </div>
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: \`#\${driver.team_color}\` }}
                >
                  {driver.driver_name}
                </div>
                <div className="font-bold">#{driver.driver_number}</div>
                <div className="text-sm text-muted-foreground">{driver.team_name}</div>
                <div
                  className="inline-block w-6 h-6 rounded-full mt-2 border"
                  style={{ backgroundColor: TYRE_COLORS[driver.tyre_used] || "#666", borderColor: driver.tyre_used === "HARD" ? "#333" : "transparent" }}
                  title={driver.tyre_used}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Rest of grid */}
        <div className="p-4">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Pos</th>
                <th className="text-left p-3 font-medium">Driver</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Team</th>
                <th className="text-center p-3 font-medium hidden lg:table-cell">Q3 Time</th>
                <th className="text-center p-3 font-medium">Tyre</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrid.slice(2).map((driver) => (
                <tr key={driver.position} className="border-t hover:bg-muted/50">
                  <td className="p-3">
                    <span className={`font-bold ${
                      driver.position === 3 ? "text-amber-600" : ""
                    }`}>
                      {driver.position}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-6 rounded-full"
                        style={{ backgroundColor: \`#\${driver.team_color}\` }}
                      />
                      <div>
                        <div className="font-medium">#{driver.driver_number} {driver.driver_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">
                    {driver.team_name}
                  </td>
                  <td className="p-3 text-center hidden lg:table-cell font-mono">
                    {driver.q3_time || driver.q2_time || driver.q1_time || "DNQ"}
                  </td>
                  <td className="p-3 text-center">
                    <div
                      className="inline-block w-6 h-6 rounded-full border"
                      style={{ 
                        backgroundColor: TYRE_COLORS[driver.tyre_used] || "#666",
                        borderColor: driver.tyre_used === "HARD" || driver.tyre_used === "INTER" ? "#333" : "transparent"
                      }}
                      title={driver.tyre_used}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        {Object.entries(TYRE_COLORS).map(([compound, color]) => (
          <div key={compound} className="flex items-center gap-1">
            <div 
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
            />
            <span>{compound}</span>
          </div>
        ))}
      </div>

      {filteredGrid.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          No grid data available.
        </div>
      )}
    </div>
  );
}
