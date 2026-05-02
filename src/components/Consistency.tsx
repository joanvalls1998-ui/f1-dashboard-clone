"use client";

import { useState, useEffect } from "react";
import { Activity, TrendingUp, Target, AlertTriangle, RefreshCw } from "lucide-react";

interface ConsistencyMetric {
  driver_name: string;
  abbreviation: string;
  team_name: string;
  team_color: string;
  position: number;
  // Lap time consistency
  lap_time_stddev: number; // milliseconds
  lap_time_avg: number; // milliseconds
  fastest_lap: number; // milliseconds
  slowest_lap: number; // milliseconds
  // Position consistency
  avg_finish_position: number;
  position_stddev: number;
  best_finish: number;
  worst_finish: number;
  // Race consistency
  races_finished: number;
  races_started: number;
  dnfs: number;
  // Points consistency
  points_total: number;
  points_per_race: number;
  points_stddev: number;
}

interface DriverResult {
  driver: string;
  abbreviation: string;
  team: string;
  position: number;
  points: number;
  status: string;
  laps: number;
  time?: string;
}

// Mock consistency data for 2026 season
const mockConsistencyData: ConsistencyMetric[] = [
  {
    driver_name: "Kimi Antonelli", abbreviation: "ANT", team_name: "Mercedes", team_color: "27f4d2", position: 1,
    lap_time_stddev: 127, lap_time_avg: 90523, fastest_lap: 90234, slowest_lap: 91234,
    avg_finish_position: 1.2, position_stddev: 0.4, best_finish: 1, worst_finish: 3,
    races_finished: 8, races_started: 8, dnfs: 0, points_total: 219, points_per_race: 27.4, points_stddev: 4.2
  },
  {
    driver_name: "Oscar Piastri", abbreviation: "PIA", team_name: "McLaren", team_color: "ff8700", position: 2,
    lap_time_stddev: 189, lap_time_avg: 90678, fastest_lap: 90345, slowest_lap: 91456,
    avg_finish_position: 2.8, position_stddev: 1.1, best_finish: 1, worst_finish: 5,
    races_finished: 8, races_started: 8, dnfs: 0, points_total: 178, points_per_race: 22.3, points_stddev: 6.8
  },
  {
    driver_name: "Lando Norris", abbreviation: "NOR", team_name: "McLaren", team_color: "ff8700", position: 3,
    lap_time_stddev: 203, lap_time_avg: 90712, fastest_lap: 90312, slowest_lap: 91678,
    avg_finish_position: 3.5, position_stddev: 1.8, best_finish: 1, worst_finish: 7,
    races_finished: 7, races_started: 8, dnfs: 1, points_total: 156, points_per_race: 19.5, points_stddev: 9.1
  },
  {
    driver_name: "Charles Leclerc", abbreviation: "LEC", team_name: "Ferrari", team_color: "ff1800", position: 4,
    lap_time_stddev: 178, lap_time_avg: 90789, fastest_lap: 90456, slowest_lap: 91345,
    avg_finish_position: 4.2, position_stddev: 1.3, best_finish: 2, worst_finish: 6,
    races_finished: 8, races_started: 8, dnfs: 0, points_total: 145, points_per_race: 18.1, points_stddev: 5.6
  },
  {
    driver_name: "Lewis Hamilton", abbreviation: "HAM", team_name: "Ferrari", team_color: "ff1800", position: 5,
    lap_time_stddev: 167, lap_time_avg: 90801, fastest_lap: 90489, slowest_lap: 91312,
    avg_finish_position: 4.8, position_stddev: 1.5, best_finish: 2, worst_finish: 8,
    races_finished: 7, races_started: 8, dnfs: 1, points_total: 132, points_per_race: 16.5, points_stddev: 7.2
  },
  {
    driver_name: "George Russell", abbreviation: "RUS", team_name: "Mercedes", team_color: "27f4d2", position: 6,
    lap_time_stddev: 156, lap_time_avg: 90823, fastest_lap: 90512, slowest_lap: 91289,
    avg_finish_position: 5.5, position_stddev: 1.2, best_finish: 3, worst_finish: 7,
    races_finished: 8, races_started: 8, dnfs: 0, points_total: 118, points_per_race: 14.8, points_stddev: 4.9
  },
  {
    driver_name: "Max Verstappen", abbreviation: "VER", team_name: "Red Bull Racing", team_color: "3671c6", position: 7,
    lap_time_stddev: 234, lap_time_avg: 90956, fastest_lap: 90578, slowest_lap: 92123,
    avg_finish_position: 7.2, position_stddev: 2.8, best_finish: 4, worst_finish: 12,
    races_finished: 6, races_started: 8, dnfs: 2, points_total: 87, points_per_race: 10.9, points_stddev: 12.3
  },
  {
    driver_name: "Fernando Alonso", abbreviation: "ALO", team_name: "Aston Martin", team_color: "0072ff", position: 8,
    lap_time_stddev: 198, lap_time_avg: 90912, fastest_lap: 90601, slowest_lap: 91678,
    avg_finish_position: 7.8, position_stddev: 2.1, best_finish: 4, worst_finish: 11,
    races_finished: 7, races_started: 8, dnfs: 1, points_total: 82, points_per_race: 10.3, points_stddev: 8.7
  },
  {
    driver_name: "Lance Stroll", abbreviation: "STR", team_name: "Aston Martin", team_color: "0072ff", position: 9,
    lap_time_stddev: 278, lap_time_avg: 91089, fastest_lap: 90678, slowest_lap: 92567,
    avg_finish_position: 9.4, position_stddev: 3.2, best_finish: 5, worst_finish: 15,
    races_finished: 5, races_started: 8, dnfs: 3, points_total: 54, points_per_race: 6.8, points_stddev: 15.6
  },
  {
    driver_name: "Isack Hadjar", abbreviation: "HAD", team_name: "Red Bull Racing", team_color: "3671c6", position: 10,
    lap_time_stddev: 245, lap_time_avg: 91023, fastest_lap: 90623, slowest_lap: 92345,
    avg_finish_position: 10.1, position_stddev: 2.9, best_finish: 6, worst_finish: 14,
    races_finished: 6, races_started: 8, dnfs: 2, points_total: 48, points_per_race: 6.0, points_stddev: 11.2
  },
];

export function Consistency() {
  const [metrics, setMetrics] = useState<ConsistencyMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<"live" | "mock">("mock");
  const [sortBy, setSortBy] = useState<"lap" | "position" | "finish">("lap");
  const [viewMode, setViewMode] = useState<"lap" | "position" | "points">("lap");

  useEffect(() => {
    async function fetchConsistencyData() {
      setError(null);
      try {
        // Try Ergast for race results
        const response = await fetch(
          "https://api.jolpi.ca/ergast/f1/2026/results.json?limit=100",
          { signal: AbortSignal.timeout(8000) }
        );

        if (response.ok) {
          const data = await response.json();
          const races = data.MRData?.RaceTable?.Races || [];
          
          if (races.length > 0) {
            // Process results to calculate consistency metrics
            // This is a simplified version - real implementation would be more complex
            // For now, use mock data to ensure we have good consistency metrics
          }
        }
      } catch (err) {
        console.log("Could not fetch from Ergast, using mock data");
      }

      // Use mock data for consistency metrics
      setMetrics(mockConsistencyData);
      setDataSource("mock");
      setLoading(false);
    }

    fetchConsistencyData();
  }, []);

  // Calculate consistency scores
  const getConsistencyScore = (metric: ConsistencyMetric): number => {
    // Lower is better for all stddev metrics
    // Lap time stddev: max around 300ms
    // Position stddev: max around 5
    const lapScore = Math.max(0, 100 - (metric.lap_time_stddev / 3));
    const posScore = Math.max(0, 100 - (metric.position_stddev * 20));
    const finishScore = metric.dnfs === 0 ? 100 : Math.max(0, 100 - (metric.dnfs * 25));
    return Math.round((lapScore + posScore + finishScore) / 3);
  };

  const getConsistencyColor = (score: number): string => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    if (score >= 50) return "text-orange-500";
    return "text-red-500";
  };

  const sortedMetrics = [...metrics].sort((a, b) => {
    switch (sortBy) {
      case "position":
        return a.position_stddev - b.position_stddev;
      case "finish":
        return (a.dnfs / a.races_started) - (b.dnfs / b.races_started);
      default:
        return a.lap_time_stddev - b.lap_time_stddev;
    }
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-500" />
          <h2 className="text-lg font-semibold">Consistency Metrics</h2>
        </div>
        <div className="flex items-center gap-2">
          {dataSource === "mock" && (
            <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-500">
              Demo Data
            </span>
          )}
          <button
            onClick={() => {
              setMetrics([]);
              setLoading(true);
              setTimeout(() => {
                setMetrics(mockConsistencyData);
                setLoading(false);
              }, 500);
            }}
            className="p-2 rounded-md border hover:bg-muted/50"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2 p-1 bg-muted/30 rounded-lg w-fit">
        <button
          onClick={() => setViewMode("lap")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            viewMode === "lap" ? "bg-card shadow" : "hover:bg-muted/50"
          }`}
        >
          Lap Times
        </button>
        <button
          onClick={() => setViewMode("position")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            viewMode === "position" ? "bg-card shadow" : "hover:bg-muted/50"
          }`}
        >
          Positions
        </button>
        <button
          onClick={() => setViewMode("points")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            viewMode === "points" ? "bg-card shadow" : "hover:bg-muted/50"
          }`}
        >
          Points
        </button>
      </div>

      {/* Sort Control */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          aria-label="Sort consistency metrics by"
          className="px-2 py-1 rounded border bg-background text-sm"
        >
          <option value="lap">Lap Time Std Dev</option>
          <option value="position">Position Std Dev</option>
          <option value="finish">Finish Rate</option>
        </select>
      </div>

      {/* Lap Time Consistency View */}
      {viewMode === "lap" && (
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground mb-2">
            Standard deviation of lap times (ms) — Lower is more consistent
          </div>
          {sortedMetrics.map((metric) => {
            const widthPercent = Math.min(100, (metric.lap_time_stddev / 300) * 100);
            const score = getConsistencyScore(metric);
            
            return (
              <div key={metric.abbreviation} className="p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-8 rounded"
                      style={{ backgroundColor: `#${metric.team_color}` }}
                    />
                    <div>
                      <div className="font-medium">{metric.abbreviation}</div>
                      <div className="text-xs text-muted-foreground">{metric.team_name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">{metric.lap_time_stddev}</div>
                      <div className="text-xs text-muted-foreground">ms std dev</div>
                    </div>
                    <div className={`text-lg font-bold ${getConsistencyColor(score)}`}>
                      {score}
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      score >= 85 ? "bg-green-500" : score >= 70 ? "bg-yellow-500" : score >= 50 ? "bg-orange-500" : "bg-red-500"
                    }`}
                    style={{ width: `${100 - widthPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Fastest: {metric.fastest_lap}ms</span>
                  <span>Avg: {metric.lap_time_avg}ms</span>
                  <span>Slowest: {metric.slowest_lap}ms</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Position Consistency View */}
      {viewMode === "position" && (
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground mb-2">
            Position consistency throughout races — Lower std dev means more consistent finishing positions
          </div>
          {sortedMetrics.map((metric) => {
            const widthPercent = Math.min(100, (metric.position_stddev / 5) * 100);
            const score = getConsistencyScore(metric);
            const finishRate = Math.round((metric.races_finished / metric.races_started) * 100);
            
            return (
              <div key={metric.abbreviation} className="p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-8 rounded"
                      style={{ backgroundColor: `#${metric.team_color}` }}
                    />
                    <div>
                      <div className="font-medium">{metric.abbreviation}</div>
                      <div className="text-xs text-muted-foreground">{metric.team_name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">±{metric.position_stddev.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">pos std dev</div>
                    </div>
                    <div className={`text-lg font-bold ${getConsistencyColor(score)}`}>
                      {score}
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      score >= 85 ? "bg-green-500" : score >= 70 ? "bg-yellow-500" : score >= 50 ? "bg-orange-500" : "bg-red-500"
                    }`}
                    style={{ width: `${100 - widthPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Best: P{metric.best_finish}</span>
                  <span>Avg: P{metric.avg_finish_position.toFixed(1)}</span>
                  <span>Worst: P{metric.worst_finish}</span>
                  <span className={finishRate < 100 ? "text-amber-500" : ""}>
                    {finishRate}% finish rate ({metric.dnfs} DNFs)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Points Consistency View */}
      {viewMode === "points" && (
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground mb-2">
            Points scoring consistency — Points per race with variation
          </div>
          {sortedMetrics.map((metric) => {
            const widthPercent = Math.min(100, (metric.points_stddev / 20) * 100);
            const score = getConsistencyScore(metric);
            
            return (
              <div key={metric.abbreviation} className="p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-8 rounded"
                      style={{ backgroundColor: `#${metric.team_color}` }}
                    />
                    <div>
                      <div className="font-medium">{metric.abbreviation}</div>
                      <div className="text-xs text-muted-foreground">{metric.team_name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">{metric.points_total}</div>
                      <div className="text-xs text-muted-foreground">total pts</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{metric.points_per_race.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">pts/race</div>
                    </div>
                    <div className={`text-lg font-bold ${getConsistencyColor(score)}`}>
                      {score}
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      score >= 85 ? "bg-green-500" : score >= 70 ? "bg-yellow-500" : score >= 50 ? "bg-orange-500" : "bg-red-500"
                    }`}
                    style={{ width: `${100 - widthPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Avg: {metric.points_per_race.toFixed(1)} pts/race</span>
                  <span>Std Dev: ±{metric.points_stddev.toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="p-3 rounded-lg border bg-card">
        <div className="text-sm font-medium mb-2">Consistency Score</div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-muted-foreground">85+ Excellent</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-muted-foreground">70-84 Good</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-muted-foreground">50-69 Average</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-muted-foreground">&lt;50 Poor</span>
          </div>
        </div>
      </div>
    </div>
  );
}
