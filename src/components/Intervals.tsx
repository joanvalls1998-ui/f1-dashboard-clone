"use client";

import { useState, useEffect } from "react";
import { Clock, Search } from "lucide-react";

interface IntervalData {
  driver_number: number;
  driver_name: string;
  team_name: string;
  team_color: string;
  position: number;
  gap_to_leader: string;
  interval_to_ahead: string;
  last_lap_time: string;
  current_lap: number;
}

function formatGap(gap: string | undefined): string {
  if (!gap || gap === '--' || gap === 'N/A') return '--';
  const cleaned = gap.replace(/^[+-]+/, '').replace(/[+-]+$/, '');
  if (cleaned === '0.000' || cleaned === '0' || cleaned === '0.0') return '—';
  const num = parseFloat(cleaned);
  if (isNaN(num) || num === 0) return '—';
  return `+${num.toFixed(3)}`;
}

export function Intervals() {
  const [intervals, setIntervals] = useState<IntervalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"position" | "interval">("position");

  useEffect(() => {
    async function fetchIntervals() {
      setLoading(true);
      try {
        // Try OpenF1 intervals endpoint for a current session
        const sessionsRes = await fetch(
          "https://api.openf1.org/v1/sessions?year=2026&session_type=Race",
          { signal: AbortSignal.timeout(8000) }
        );
        let sessionKey = "latest";
        if (sessionsRes.ok) {
          const sessions = await sessionsRes.json();
          const now = new Date();
          const completedRaces = (sessions || []).filter((s: any) =>
            new Date(s.date_end) < now && !s.is_cancelled
          );
          if (completedRaces.length > 0) {
            sessionKey = completedRaces[completedRaces.length - 1].session_key;
          }
        }

        const response = await fetch(
          `https://api.openf1.org/v1/intervals?session_key=${sessionKey}`,
          { signal: AbortSignal.timeout(8000) }
        );
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const transformed: IntervalData[] = data.map((d: any) => ({
              driver_number: d.driver_number,
              driver_name: d.driver_code || String(d.driver_number),
              team_name: d.team_name || "Unknown",
              team_color: d.team_colour || "666666",
              position: d.position || 0,
              gap_to_leader: formatGap(d.gap_to_leader),
              interval_to_ahead: formatGap(d.interval),
              last_lap_time: d.last_lap_time || "--:--.--",
              current_lap: d.current_lap || 0,
            })).sort((a: IntervalData, b: IntervalData) => a.position - b.position);
            setIntervals(transformed);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching intervals:", error);
      }
      // No mock fallback - show empty state
      setIntervals([]);
      setLoading(false);
    }

    fetchIntervals();
    const id = setInterval(fetchIntervals, 30000);
    return () => clearInterval(id);
  }, []);

  const filteredIntervals = intervals
    .filter(i => {
      if (!search) return true;
      return i.driver_name.toLowerCase().includes(search.toLowerCase()) ||
             i.team_name.toLowerCase().includes(search.toLowerCase()) ||
             i.driver_number.toString().includes(search);
    })
    .sort((a, b) => {
      if (sortBy === "interval") {
        const aGap = parseFloat(a.gap_to_leader.replace("+", "")) || 999;
        const bGap = parseFloat(b.gap_to_leader.replace("+", "")) || 999;
        return aGap - bGap;
      }
      return a.position - b.position;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-cyan-500" />
        <h2 className="text-lg font-semibold">Intervals & Timing</h2>
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

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 rounded-md border bg-background text-sm"
        >
          <option value="position">Sort by Position</option>
          <option value="interval">Sort by Gap</option>
        </select>
      </div>

      {/* Intervals table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium">Pos</th>
              <th className="text-left p-3 font-medium">Driver</th>
              <th className="text-center p-3 font-medium">Lap</th>
              <th className="text-center p-3 font-medium">Last Lap</th>
              <th className="text-center p-3 font-medium">Gap to Leader</th>
              <th className="text-center p-3 font-medium">Interval</th>
            </tr>
          </thead>
          <tbody>
            {filteredIntervals.map((interval) => (
              <tr key={interval.driver_number} className="border-t hover:bg-muted/50">
                <td className="p-3">
                  <span className={`font-bold text-lg ${
                    interval.position === 1 ? "text-yellow-500" :
                    interval.position === 2 ? "text-gray-400" :
                    interval.position === 3 ? "text-amber-600" : ""
                  }`}>
                    {interval.position}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-8 rounded-full"
                      style={{ backgroundColor: `#${interval.team_color}` }}
                    />
                    <div>
                      <div className="font-medium">#{interval.driver_number} {interval.driver_name}</div>
                      <div className="text-xs text-muted-foreground">{interval.team_name}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className="font-medium">{interval.current_lap}</span>
                </td>
                <td className="p-3 text-center">
                  <span className="font-mono text-sm">{interval.last_lap_time}</span>
                </td>
                <td className="p-3 text-center">
                  <span className={`font-bold ${
                    interval.gap_to_leader === "--" ? "text-yellow-500" : "text-foreground"
                  }`}>
                    {interval.gap_to_leader}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className="text-muted-foreground">{interval.interval_to_ahead}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gap visualization */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-medium mb-4">Gap to Leader (seconds)</h3>
        <div className="space-y-2">
          {filteredIntervals.slice(0, 10).map((interval) => {
            const gap = interval.gap_to_leader === "--" ? 0 :
              parseFloat(interval.gap_to_leader.replace("+", ""));
            const maxGap = 30;
            const widthPercent = Math.min((gap / maxGap) * 100, 100);

            return (
              <div key={interval.driver_number} className="flex items-center gap-2">
                <div className="w-16 text-xs font-medium truncate">
                  {interval.driver_name}
                </div>
                <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                  <div
                    className="h-full rounded flex items-center justify-end pr-2 text-xs font-bold"
                    style={{
                      width: `${Math.max(widthPercent, interval.position === 1 ? 5 : 0)}%`,
                      backgroundColor: `#${interval.team_color}`,
                      color: interval.team_color === "ffffff" || interval.team_color === "27f4d2" ? "#000" : "#fff"
                    }}
                  >
                    {gap > 0 ? interval.gap_to_leader : "LEADER"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredIntervals.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          No interval data available.
        </div>
      )}
    </div>
  );
}
