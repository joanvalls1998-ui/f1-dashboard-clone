"use client";

import { useState, useEffect } from "react";
import { Clock, Search, Flag } from "lucide-react";
import { getTeamColor } from "@/lib/f1-assets";

interface DriverInterval {
  position: number;
  abbreviation: string;
  fullName: string;
  team: string;
  color: string;
  gap_to_leader: string;
  interval_to_ahead: string;
  time: string | null;
  status: string;
  laps: number;
}

export default function IntervalsPage() {
  const [intervals, setIntervals] = useState<DriverInterval[]>([]);
  const [raceInfo, setRaceInfo] = useState<{ raceName: string; location: string; date: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"position" | "interval">("position");

  useEffect(() => {
    async function fetchIntervals() {
      try {
        const response = await fetch("https://api.jolpi.ca/ergast/f1/current/last/results.json");
        const data = await response.json();

        if (!data.MRData.RaceTable.Races || data.MRData.RaceTable.Races.length === 0) {
          setLoading(false);
          return;
        }

        const race = data.MRData.RaceTable.Races[0];
        setRaceInfo({
          raceName: race.raceName,
          location: race.Circuit.Location.locality,
          date: race.date,
        });

        // Parse results and calculate gaps
        const results = race.Results as any[];

        // The winner's Time.time is the actual race time, others are gaps to leader

        const processed: DriverInterval[] = results.map((r, idx) => {
          const timeValue = r.Time?.time || null;
          let gap_to_leader = "--";
          let interval_to_ahead = "--";

          if (r.position === "1") {
            gap_to_leader = "LEADER";
          } else if (timeValue) {
            // Time.time for non-winners is already the gap to leader (e.g., "+13.722")
            gap_to_leader = timeValue;
          }

          // Calculate interval to driver ahead
          if (idx > 0 && timeValue) {
            const aheadResult = results[idx - 1];
            const aheadTime = aheadResult?.Time?.time;
            if (aheadTime && timeValue.startsWith("+") && aheadTime.startsWith("+")) {
              const currentGap = parseFloat(timeValue.replace("+", ""));
              const aheadGap = parseFloat(aheadTime.replace("+", ""));
              const interval = currentGap - aheadGap;
              interval_to_ahead = `+${interval.toFixed(3)}`;
            }
          }

          return {
            position: parseInt(r.position),
            abbreviation: r.Driver.code,
            fullName: `${r.Driver.givenName} ${r.Driver.familyName}`,
            team: r.Constructor.name,
            color: getTeamColor(r.Constructor.name),
            gap_to_leader,
            interval_to_ahead,
            time: timeValue,
            status: r.status,
            laps: parseInt(r.laps),
          };
        });

        setIntervals(processed);
      } catch (error) {
        console.error("Error fetching intervals:", error);
      }
      setLoading(false);
    }

    fetchIntervals();
  }, []);

  const filteredIntervals = intervals
    .filter(i => {
      if (!search) return true;
      return (
        i.fullName.toLowerCase().includes(search.toLowerCase()) ||
        i.team.toLowerCase().includes(search.toLowerCase()) ||
        i.abbreviation.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === "interval") {
        const aVal = a.gap_to_leader === "LEADER" ? -1 : parseFloat(a.gap_to_leader.replace("+", ""));
        const bVal = b.gap_to_leader === "LEADER" ? -1 : parseFloat(b.gap_to_leader.replace("+", ""));
        return aVal - bVal;
      }
      return a.position - b.position;
    });

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Intervals</h1>
          <p className="text-muted-foreground">Time gaps between drivers from the last race.</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Intervals</h1>
        <p className="text-muted-foreground">
          Time gaps between drivers from the last race
          {raceInfo && (
            <span className="ml-2">
              — {raceInfo.raceName.replace(" Grand Prix", " GP")} • {raceInfo.location}
            </span>
          )}
        </p>
      </div>

      {/* Race info banner */}
      {raceInfo && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card rounded-lg border p-3">
          <Flag className="w-4 h-4 text-green-500" />
          <span>
            {raceInfo.raceName.replace(" Grand Prix", " GP")} •{" "}
            {new Date(raceInfo.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      )}

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
              <th className="text-center p-3 font-medium">Laps</th>
              <th className="text-center p-3 font-medium">Status</th>
              <th className="text-center p-3 font-medium">Gap to Leader</th>
              <th className="text-center p-3 font-medium">Interval</th>
            </tr>
          </thead>
          <tbody>
            {filteredIntervals.map((interval, index) => (
              <tr key={interval.position} className="border-t hover:bg-muted/50">
                <td className="p-3">
                  <span
                    className={`font-bold text-lg ${
                      interval.position === 1
                        ? "text-yellow-500"
                        : interval.position === 2
                        ? "text-gray-400"
                        : interval.position === 3
                        ? "text-amber-600"
                        : ""
                    }`}
                  >
                    {interval.position}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-8 rounded-full"
                      style={{ backgroundColor: interval.color }}
                    />
                    <div>
                      <div className="font-medium">
                        {interval.abbreviation} {interval.fullName}
                      </div>
                      <div className="text-xs text-muted-foreground">{interval.team}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className="font-medium text-muted-foreground">{interval.laps}</span>
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      interval.status === "Finished"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {interval.status}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`font-bold font-mono ${
                      interval.gap_to_leader === "LEADER" ? "text-yellow-500" : "text-foreground"
                    }`}
                  >
                    {interval.gap_to_leader}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className="text-muted-foreground font-mono text-sm">
                    {interval.interval_to_ahead}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gap visualization */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-cyan-500" />
          <h3 className="text-sm font-medium">Gap to Leader (seconds)</h3>
        </div>
        <div className="space-y-2">
          {filteredIntervals.slice(0, 10).map((interval) => {
            const gap =
              interval.gap_to_leader === "LEADER" || interval.gap_to_leader === "--"
                ? 0
                : parseFloat(interval.gap_to_leader.replace("+", ""));
            const maxGap = Math.max(30, ...filteredIntervals.slice(0, 10).map(i => {
              const g = i.gap_to_leader === "LEADER" || i.gap_to_leader === "--"
                ? 0
                : parseFloat(i.gap_to_leader.replace("+", ""));
              return g;
            }));
            const widthPercent = maxGap > 0 ? (gap / maxGap) * 100 : 0;

            return (
              <div key={interval.position} className="flex items-center gap-2">
                <div className="w-12 text-xs font-medium truncate text-right">
                  {interval.position}. {interval.abbreviation}
                </div>
                <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                  <div
                    className="h-full rounded flex items-center justify-end pr-2 text-xs font-bold"
                    style={{
                      width: `${Math.max(widthPercent, interval.position === 1 ? 5 : 0)}%`,
                      backgroundColor: interval.color,
                      color: interval.color === "#ffffff" || interval.color === "#27F4D2" ? "#000" : "#fff",
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
