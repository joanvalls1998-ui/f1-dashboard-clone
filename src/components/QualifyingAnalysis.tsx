"use client";

import { useState, useEffect } from "react";
import { Flag, Search, Clock } from "lucide-react";

interface QualifyingResult {
  position: number;
  driver_number: number;
  driver_name: string;
  team_name: string;
  team_color: string;
  q1_time: string | null;
  q2_time: string | null;
  q3_time: string | null;
  q1_lap: number;
  q2_lap: number;
  q3_lap: number;
}

const mockQualifying: QualifyingResult[] = [
  { position: 1, driver_number: 1, driver_name: "VER", team_name: "Red Bull Racing", team_color: "3671c6", q1_time: "1:30.123", q2_time: "1:29.456", q3_time: "1:28.789", q1_lap: 3, q2_lap: 5, q3_lap: 8 },
  { position: 2, driver_number: 16, driver_name: "LEC", team_name: "Ferrari", team_color: "e8002d", q1_time: "1:30.234", q2_time: "1:29.567", q3_time: "1:28.890", q1_lap: 3, q2_lap: 5, q3_lap: 8 },
  { position: 3, driver_number: 55, driver_name: "NOR", team_name: "McLaren", team_color: "ff8000", q1_time: "1:30.345", q2_time: "1:29.678", q3_time: "1:29.001", q1_lap: 3, q2_lap: 5, q3_lap: 8 },
  { position: 4, driver_number: 11, driver_name: "PER", team_name: "Red Bull Racing", team_color: "3671c6", q1_time: "1:30.456", q2_time: "1:29.789", q3_time: "1:29.123", q1_lap: 3, q2_lap: 5, q3_lap: 8 },
  { position: 5, driver_number: 44, driver_name: "HAM", team_name: "Mercedes", team_color: "27f4d2", q1_time: "1:30.567", q2_time: "1:29.890", q3_time: "1:29.234", q1_lap: 3, q2_lap: 5, q3_lap: 8 },
  { position: 6, driver_number: 14, driver_name: "ALO", team_name: "Aston Martin", team_color: "229971", q1_time: "1:30.678", q2_time: "1:30.001", q3_time: "1:29.345", q1_lap: 3, q2_lap: 5, q3_lap: 8 },
  { position: 7, driver_number: 63, driver_name: "RUS", team_name: "Mercedes", team_color: "27f4d2", q1_time: "1:30.789", q2_time: "1:30.123", q3_time: "1:29.456", q1_lap: 3, q2_lap: 5, q3_lap: 8 },
  { position: 8, driver_number: 81, driver_name: "PIA", team_name: "McLaren", team_color: "ff8000", q1_time: "1:30.890", q2_time: "1:30.234", q3_time: "1:29.567", q1_lap: 3, q2_lap: 5, q3_lap: 8 },
  { position: 9, driver_number: 18, driver_name: "STR", team_name: "Aston Martin", team_color: "229971", q1_time: "1:31.001", q2_time: "1:30.345", q3_time: "1:29.678", q1_lap: 3, q2_lap: 5, q3_lap: 8 },
  { position: 10, driver_number: 27, driver_name: "HUL", team_name: "Haas F1 Team", team_color: "b6babd", q1_time: "1:31.123", q2_time: "1:30.456", q3_time: "1:29.789", q1_lap: 3, q2_lap: 5, q3_lap: 8 },
  { position: 11, driver_number: 31, driver_name: "OCO", team_name: "Alpine", team_color: "ff87bc", q1_time: "1:31.234", q2_time: "1:30.567", q3_time: null, q1_lap: 3, q2_lap: 5, q3_lap: 0 },
  { position: 12, driver_number: 10, driver_name: "GAS", team_name: "Alpine", team_color: "ff87bc", q1_time: "1:31.345", q2_time: "1:30.678", q3_time: null, q1_lap: 3, q2_lap: 5, q3_lap: 0 },
  { position: 13, driver_number: 24, driver_name: "ZHO", team_name: "Kick Sauber", team_color: "52e252", q1_time: "1:31.456", q2_time: null, q3_time: null, q1_lap: 3, q2_lap: 0, q3_lap: 0 },
  { position: 14, driver_number: 77, driver_name: "BOT", team_name: "Kick Sauber", team_color: "52e252", q1_time: "1:31.567", q2_time: null, q3_time: null, q1_lap: 3, q2_lap: 0, q3_lap: 0 },
  { position: 15, driver_number: 4, driver_name: "MAG", team_name: "Haas F1 Team", team_color: "b6babd", q1_time: "1:31.678", q2_time: null, q3_time: null, q1_lap: 3, q2_lap: 0, q3_lap: 0 },
  { position: 16, driver_number: 20, driver_name: "MAG", team_name: "Haas F1 Team", team_color: "b6babd", q1_time: "1:31.789", q2_time: null, q3_time: null, q1_lap: 3, q2_lap: 0, q3_lap: 0 },
  { position: 17, driver_number: 22, driver_name: "TSU", team_name: "RB", team_color: "6692ff", q1_time: "1:31.890", q2_time: null, q3_time: null, q1_lap: 3, q2_lap: 0, q3_lap: 0 },
  { position: 18, driver_number: 3, driver_name: "RIC", team_name: "RB", team_color: "6692ff", q1_time: "1:32.001", q2_time: null, q3_time: null, q1_lap: 3, q2_lap: 0, q3_lap: 0 },
  { position: 19, driver_number: 43, driver_name: "ALB", team_name: "Williams", team_color: "64c4ff", q1_time: "1:32.123", q2_time: null, q3_time: null, q1_lap: 3, q2_lap: 0, q3_lap: 0 },
  { position: 20, driver_number: 6, driver_name: "SAR", team_name: "Williams", team_color: "64c4ff", q1_time: "1:32.234", q2_time: null, q3_time: null, q1_lap: 3, q2_lap: 0, q3_lap: 0 },
];

export function QualifyingAnalysis() {
  const [results, setResults] = useState<QualifyingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSession, setSelectedSession] = useState<"Q1" | "Q2" | "Q3">("Q3");

  useEffect(() => {
    async function fetchQualifying() {
      try {
        const response = await fetch("https://api.openf1.org/v1/qualifying?session_key=latest");
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            const transformed: QualifyingResult[] = data.map((q: any) => ({
              position: q.position || 0,
              driver_number: q.driver_number,
              driver_name: q.driver_code || `DRV${q.driver_number}`,
              team_name: q.team_name || "Unknown",
              team_color: q.team_colour || "666666",
              q1_time: q.q1 || null,
              q2_time: q.q2 || null,
              q3_time: q.q3 || null,
              q1_lap: q.q1_lap || 0,
              q2_lap: q.q2_lap || 0,
              q3_lap: q.q3_lap || 0,
            })).sort((a: QualifyingResult, b: QualifyingResult) => a.position - b.position);
            
            setResults(transformed);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching qualifying:", error);
      }
      setResults(mockQualifying);
      setLoading(false);
    }

    fetchQualifying();
  }, []);

  const filteredResults = results.filter(r => {
    if (!search) return true;
    return r.driver_name.toLowerCase().includes(search.toLowerCase()) ||
           r.team_name.toLowerCase().includes(search.toLowerCase()) ||
           r.driver_number.toString().includes(search);
  });

  const getTimeColumn = (result: QualifyingResult): string | null => {
    switch (selectedSession) {
      case "Q1": return result.q1_time;
      case "Q2": return result.q2_time;
      case "Q3": return result.q3_time;
    }
  };

  const bestTime = (session: "Q1" | "Q2" | "Q3"): string | null => {
    const times = filteredResults.map(r => {
      switch (session) {
        case "Q1": return r.q1_time;
        case "Q2": return r.q2_time;
        case "Q3": return r.q3_time;
      }
    }).filter((t): t is string => t !== null);
    
    if (times.length === 0) return null;
    return times.sort((a, b) => {
      const aMs = parseTimeToMs(a);
      const bMs = parseTimeToMs(b);
      return aMs - bMs;
    })[0];
  };

  const parseTimeToMs = (time: string): number => {
    const parts = time.split(":");
    if (parts.length === 2) {
      const mins = parseInt(parts[0]);
      const secs = parseFloat(parts[1]);
      return mins * 60000 + secs * 1000;
    }
    return parseFloat(time) * 1000;
  };

  const formatGap = (time: string | null, best: string | null): string => {
    if (!time || !best) return "--";
    const timeMs = parseTimeToMs(time);
    const bestMs = parseTimeToMs(best);
    const diff = timeMs - bestMs;
    if (diff <= 0) return "Leader";
    return `+${(diff / 1000).toFixed(3)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const best = bestTime(selectedSession);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Flag className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-semibold">Qualifying Analysis</h2>
      </div>

      {/* Session selector */}
      <div className="flex gap-2">
        {(["Q1", "Q2", "Q3"] as const).map(session => (
          <button
            key={session}
            onClick={() => setSelectedSession(session)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedSession === session
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {session}
          </button>
        ))}
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

      {/* Results table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium">Pos</th>
              <th className="text-left p-3 font-medium">Driver</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Team</th>
              <th className="text-center p-3 font-medium">Time</th>
              <th className="text-center p-3 font-medium">Gap</th>
              <th className="text-center p-3 font-medium hidden lg:table-cell">Lap</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((result) => {
              const time = getTimeColumn(result);
              const gap = formatGap(time, best);
              
              return (
                <tr key={result.driver_number} className="border-t hover:bg-muted/50">
                  <td className="p-3">
                    <span className={`font-bold ${
                      result.position === 1 ? "text-yellow-500" :
                      result.position === 2 ? "text-gray-400" :
                      result.position === 3 ? "text-amber-600" :
                      result.position <= 15 ? "text-green-500" : "text-red-500"
                    }`}>
                      {result.position}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-6 rounded-full"
                        style={{ backgroundColor: `#${result.team_color}` }}
                      />
                      <div>
                        <div className="font-medium">#{result.driver_number} {result.driver_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <span className="text-muted-foreground">{result.team_name}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`font-mono font-medium ${
                      time === best ? "text-green-500" : ""
                    }`}>
                      {time || "DNQ"}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={time === best ? "text-green-500 font-bold" : "text-muted-foreground"}>
                      {gap}
                    </span>
                  </td>
                  <td className="p-3 text-center hidden lg:table-cell">
                    <span className="text-muted-foreground">
                      {selectedSession === "Q1" ? result.q1_lap :
                       selectedSession === "Q2" ? result.q2_lap :
                       result.q3_lap || "-"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Q1/Q2/Q3 progression info */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border bg-card text-center">
          <div className="text-2xl font-bold text-red-500">20</div>
          <div className="text-sm text-muted-foreground">Q1 Entrants</div>
        </div>
        <div className="p-4 rounded-lg border bg-card text-center">
          <div className="text-2xl font-bold text-yellow-500">15</div>
          <div className="text-sm text-muted-foreground">Q2 Qualifiers</div>
        </div>
        <div className="p-4 rounded-lg border bg-card text-center">
          <div className="text-2xl font-bold text-green-500">10</div>
          <div className="text-sm text-muted-foreground">Q3 Entrants</div>
        </div>
      </div>

      {filteredResults.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          No qualifying data available.
        </div>
      )}
    </div>
  );
}
