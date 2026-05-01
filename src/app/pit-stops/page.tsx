"use client";

import { useEffect, useState } from "react";
import { Clock, Wrench } from "lucide-react";

interface PitStop {
  driver: string;
  abbreviation: string;
  team: string;
  lap: number;
  stop: number;
  time: string;
  duration: string;
}

const mockPitStops: PitStop[] = [
  { driver: "Oscar Piastri", abbreviation: "PIA", team: "McLaren", lap: 16, stop: 1, time: "14:39:31", duration: "23.316" },
  { driver: "Oliver Bearman", abbreviation: "BEA", team: "Haas F1 Team", lap: 16, stop: 1, time: "14:39:59", duration: "25.081" },
  { driver: "Charles Leclerc", abbreviation: "LEC", team: "Ferrari", lap: 17, stop: 1, time: "14:41:04", duration: "22.992" },
  { driver: "George Russell", abbreviation: "RUS", team: "Mercedes", lap: 17, stop: 1, time: "14:41:25", duration: "23.445" },
  { driver: "Lando Norris", abbreviation: "NOR", team: "McLaren", lap: 18, stop: 1, time: "14:42:18", duration: "24.123" },
  { driver: "Andrea Kimi Antonelli", abbreviation: "ANT", team: "Mercedes", lap: 18, stop: 1, time: "14:42:45", duration: "22.876" },
  { driver: "Lewis Hamilton", abbreviation: "HAM", team: "Ferrari", lap: 19, stop: 1, time: "14:44:02", duration: "23.678" },
  { driver: "Max Verstappen", abbreviation: "VER", team: "Red Bull Racing", lap: 19, stop: 1, time: "14:44:30", duration: "24.567" },
  { driver: "Pierre Gasly", abbreviation: "GAS", team: "Alpine", lap: 20, stop: 1, time: "14:45:55", duration: "23.901" },
  { driver: "Isack Hadjar", abbreviation: "HAD", team: "RB F1 Team", lap: 20, stop: 1, time: "14:46:22", duration: "25.234" },
  { driver: "Liam Lawson", abbreviation: " LAW", team: "RB F1 Team", lap: 21, stop: 1, time: "14:48:10", duration: "24.456" },
  { driver: "Fernando Alonso", abbreviation: "ALO", team: "Aston Martin", lap: 21, stop: 1, time: "14:48:38", duration: "26.123" },
];

export default function PitStopsPage() {
  const [pitStops, setPitStops] = useState<PitStop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPitStops() {
      try {
        const res = await fetch("https://api.jolpi.ca/ergast/f1/2026/3/pitstops.json", { signal: AbortSignal.timeout(8000) });
        if (res.ok) {
          const data = await res.json();
          const race = data.MRData.RaceTable.Races?.[0];
          if (race?.PitStops) {
            const mapped: PitStop[] = race.PitStops.map((s: any) => ({
              driver: s.driverId,
              abbreviation: s.driverId.slice(0, 3).toUpperCase(),
              team: "Unknown",
              lap: parseInt(s.lap),
              stop: parseInt(s.stop),
              time: s.time,
              duration: s.duration,
            }));
            // Sort by lap then stop
            mapped.sort((a, b) => a.lap - b.lap || a.stop - b.stop);
            setPitStops(mapped);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching pit stops:", error);
      }
      setPitStops(mockPitStops);
      setLoading(false);
    }

    fetchPitStops();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
      </div>
    );
  }

  // Sort by duration (fastest first)
  const sortedByTime = [...pitStops].sort((a, b) => parseFloat(a.duration) - parseFloat(b.duration));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Wrench className="w-6 h-6 text-orange-500" />
        <h1 className="text-2xl font-bold">Pit Stop Analysis</h1>
      </div>
      <p className="text-muted-foreground text-sm">Japanese Grand Prix 2026 — {pitStops.length} pit stops recorded</p>

      {/* Pit stops by lap */}
      <div className="bg-card rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-500" />
          Pit Stop Timeline
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Lap</th>
                <th className="text-left p-3 font-medium">Driver</th>
                <th className="text-center p-3 font-medium">Stop</th>
                <th className="text-right p-3 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              {pitStops.map((stop, i) => (
                <tr key={i} className="border-b hover:bg-muted/50">
                  <td className="p-3">
                    <span className="font-mono font-medium">{stop.lap}</span>
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{stop.driver}</div>
                    <div className="text-xs text-muted-foreground">{stop.team}</div>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 bg-muted rounded text-xs font-medium">#{stop.stop}</span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="font-mono font-bold text-orange-400">{stop.duration}s</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fastest pit stops */}
      <div className="bg-card rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4">Fastest Pit Stops</h2>
        <div className="space-y-2">
          {sortedByTime.slice(0, 5).map((stop, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i === 0 ? "bg-yellow-500 text-black" :
                i === 1 ? "bg-gray-400 text-black" :
                i === 2 ? "bg-amber-600 text-white" :
                "bg-muted"
              }`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="font-medium">{stop.driver}</div>
                <div className="text-xs text-muted-foreground">Lap {stop.lap} — {stop.team}</div>
              </div>
              <div className="font-mono text-xl font-bold text-green-400">
                {stop.duration}s
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
