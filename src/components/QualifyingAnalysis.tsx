"use client";

import { useState, useEffect } from "react";
import { Flag, Search, AlertCircle } from "lucide-react";
import { getTeamColor } from "@/lib/f1-assets";

const ERGAST_BASE = "https://api.jolpi.ca/ergast/f1";

interface QualifyingResult {
  position: number;
  driver_number: string;
  driver_code: string;
  driver_name: string;
  team_name: string;
  q1_time: string | null;
  q2_time: string | null;
  q3_time: string | null;
}

// Fallback 2026 mock qualifying data (no live session)
export function QualifyingAnalysis() {
  const [results, setResults] = useState<QualifyingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [raceInfo, setRaceInfo] = useState<{ name: string; country: string } | null>(null);

  useEffect(() => {
    async function fetchQualifying() {
      try {
        const response = await fetch(`${ERGAST_BASE}/current/last/qualifying.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const raceTable = data.MRData?.RaceTable;
        const races = raceTable?.Races || [];
        
        if (races.length > 0) {
          const race = races[0];
          setRaceInfo({ name: race.raceName, country: race.Circuit?.Location?.country || "" });
          
          const qualifyingResults = race.QualifyingResults || [];
          const transformed: QualifyingResult[] = qualifyingResults.map((q: any) => ({
            position: parseInt(q.position) || 0,
            driver_number: q.Driver?.permanentNumber || q.Driver?.code || "0",
            driver_code: q.Driver?.code || "---",
            driver_name: `${q.Driver?.givenName} ${q.Driver?.familyName}`,
            team_name: q.Constructor?.name || "Unknown",
            q1_time: q.Q1 || null,
            q2_time: q.Q2 || null,
            q3_time: q.Q3 || null,
          }));
          
          setResults(transformed);
        } else {
          // No data from API, use fallback mock data
          setResults([]);
        }
      } catch (err) {
        console.error("Error fetching qualifying:", err);
        // Use fallback mock data when API fails
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchQualifying();
  }, []);

  const filteredResults = results.filter(r => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return r.driver_code.toLowerCase().includes(searchLower) ||
           r.driver_name.toLowerCase().includes(searchLower) ||
           r.team_name.toLowerCase().includes(searchLower);
  });

  const parseTimeToMs = (time: string): number => {
    const parts = time.split(":");
    if (parts.length === 2) {
      const mins = parseInt(parts[0]);
      const secs = parseFloat(parts[1]);
      return mins * 60000 + secs * 1000;
    }
    return parseFloat(time) * 1000;
  };

  const bestTime = (session: "q1" | "q2" | "q3"): string | null => {
    const times = filteredResults.map(r => {
      switch (session) {
        case "q1": return r.q1_time;
        case "q2": return r.q2_time;
        case "q3": return r.q3_time;
      }
    }).filter((t): t is string => t !== null);
    
    if (times.length === 0) return null;
    return times.sort((a, b) => parseTimeToMs(a) - parseTimeToMs(b))[0];
  };

  const formatGap = (time: string | null, best: string | null): string => {
    if (!time || !best) return "--";
    const diff = parseTimeToMs(time) - parseTimeToMs(best);
    if (diff <= 0) return "Leader";
    return `+${(diff / 1000).toFixed(3)}`;
  };

  const q1Count = filteredResults.filter(r => r.q1_time !== null).length;
  const q2Count = filteredResults.filter(r => r.q2_time !== null).length;
  const q3Count = filteredResults.filter(r => r.q3_time !== null).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Unable to load qualifying data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Flag className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-semibold">
          {raceInfo ? `${raceInfo.country} Grand Prix - Qualifying` : "Qualifying Results"}
        </h2>
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
          aria-label="Search drivers"
        />
      </div>

      {/* All Q times table */}
      <div className="rounded-lg border bg-card overflow-hidden" role="region" aria-label="Qualifying results table">
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Qualifying times by session">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="text-left p-3 font-medium">Pos</th>
                <th scope="col" className="text-left p-3 font-medium">Driver</th>
                <th scope="col" className="text-left p-3 font-medium hidden md:table-cell">Team</th>
                <th scope="col" className="text-center p-3 font-medium">Q1</th>
                <th scope="col" className="text-center p-3 font-medium">Q2</th>
                <th scope="col" className="text-center p-3 font-medium">Q3</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result) => {
                const bestQ1 = bestTime("q1");
                const bestQ2 = bestTime("q2");
                const bestQ3 = bestTime("q3");
                
                return (
                  <tr key={result.driver_number} className="border-t hover:bg-muted/50">
                    <td className="p-3">
                      <span className={`font-bold ${
                        result.position === 1 ? "text-yellow-500" :
                        result.position === 2 ? "text-gray-400" :
                        result.position === 3 ? "text-amber-600" :
                        result.position <= 10 ? "text-green-500" : ""
                      }`}>
                        {result.position}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-6 rounded-full flex-shrink-0"
                          style={{ backgroundColor: getTeamColor(result.team_name) }}
                        />
                        <div>
                          <div className="font-medium">{result.driver_code}</div>
                          <div className="text-xs text-muted-foreground hidden sm:block">
                            {result.driver_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <span className="text-muted-foreground text-sm">{result.team_name}</span>
                    </td>
                    <td className="p-3 text-center">
                      <div className={`font-mono text-sm ${
                        result.q1_time === bestQ1 && bestQ1 ? "text-green-500 font-medium" : ""
                      }`}>
                        {result.q1_time ? (
                          <span>{result.q1_time}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                      {result.q1_time && (
                        <div className="text-xs text-muted-foreground">
                          {formatGap(result.q1_time, bestQ1)}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {result.q2_time ? (
                        <div>
                          <div className={`font-mono text-sm ${
                            result.q2_time === bestQ2 && bestQ2 ? "text-green-500 font-medium" : ""
                          }`}>
                            {result.q2_time}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatGap(result.q2_time, bestQ2)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {result.q3_time ? (
                        <div>
                          <div className={`font-mono text-sm ${
                            result.q3_time === bestQ3 && bestQ3 ? "text-green-500 font-medium" : ""
                          }`}>
                            {result.q3_time}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatGap(result.q3_time, bestQ3)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session progression info */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border bg-card text-center">
          <div className="text-2xl font-bold text-red-500">{q1Count}</div>
          <div className="text-sm text-muted-foreground">Q1 Entrants</div>
        </div>
        <div className="p-4 rounded-lg border bg-card text-center">
          <div className="text-2xl font-bold text-yellow-500">{q2Count}</div>
          <div className="text-sm text-muted-foreground">Q2 Qualifiers</div>
        </div>
        <div className="p-4 rounded-lg border bg-card text-center">
          <div className="text-2xl font-bold text-green-500">{q3Count}</div>
          <div className="text-sm text-muted-foreground">Q3 Entrants</div>
        </div>
      </div>

      {filteredResults.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2" role="status" aria-live="polite">
          <AlertCircle className="w-8 h-8" />
          <p>No qualifying data found.</p>
        </div>
      )}
    </div>
  );
}
