"use client";

import { useEffect, useState } from "react";
import { Activity, Clock } from "lucide-react";

interface LapTime {
  driver: string;
  abbreviation: string;
  team: string;
  lap: number;
  time: string;
  position: number;
}

interface DriverPace {
  driver: string;
  abbreviation: string;
  team: string;
  avgLapTime: string;
  fastestLap: string;
  fastestLapNum: number;
  totalLaps: number;
  laps: { lap: number; time: string; position: number }[];
}

const mockPace: DriverPace[] = [
  {
    driver: "Oscar Piastri",
    abbreviation: "PIA",
    team: "McLaren",
    avgLapTime: "1:29.234",
    fastestLap: "1:28.103",
    fastestLapNum: 42,
    totalLaps: 52,
    laps: [
      { lap: 1, time: "1:35.268", position: 1 },
      { lap: 2, time: "1:30.456", position: 1 },
      { lap: 3, time: "1:29.876", position: 1 },
      { lap: 10, time: "1:29.234", position: 1 },
      { lap: 20, time: "1:29.456", position: 1 },
      { lap: 30, time: "1:29.123", position: 1 },
      { lap: 40, time: "1:28.901", position: 1 },
      { lap: 42, time: "1:28.103", position: 1 },
      { lap: 50, time: "1:29.234", position: 1 },
    ],
  },
  {
    driver: "Andrea Kimi Antonelli",
    abbreviation: "ANT",
    team: "Mercedes",
    avgLapTime: "1:29.567",
    fastestLap: "1:28.234",
    fastestLapNum: 38,
    totalLaps: 52,
    laps: [
      { lap: 1, time: "1:36.360", position: 3 },
      { lap: 2, time: "1:30.678", position: 3 },
      { lap: 3, time: "1:30.123", position: 2 },
      { lap: 10, time: "1:29.890", position: 2 },
      { lap: 20, time: "1:29.567", position: 2 },
      { lap: 30, time: "1:29.345", position: 2 },
      { lap: 38, time: "1:28.234", position: 2 },
      { lap: 50, time: "1:29.678", position: 2 },
    ],
  },
  {
    driver: "Charles Leclerc",
    abbreviation: "LEC",
    team: "Ferrari",
    avgLapTime: "1:29.789",
    fastestLap: "1:28.456",
    fastestLapNum: 45,
    totalLaps: 52,
    laps: [
      { lap: 1, time: "1:37.206", position: 5 },
      { lap: 2, time: "1:31.234", position: 4 },
      { lap: 3, time: "1:30.567", position: 4 },
      { lap: 10, time: "1:30.123", position: 3 },
      { lap: 20, time: "1:29.890", position: 3 },
      { lap: 30, time: "1:29.678", position: 3 },
      { lap: 45, time: "1:28.456", position: 3 },
      { lap: 50, time: "1:30.234", position: 3 },
    ],
  },
  {
    driver: "George Russell",
    abbreviation: "RUS",
    team: "Mercedes",
    avgLapTime: "1:29.890",
    fastestLap: "1:28.678",
    fastestLapNum: 35,
    totalLaps: 52,
    laps: [
      { lap: 1, time: "1:36.890", position: 6 },
      { lap: 2, time: "1:31.456", position: 5 },
      { lap: 3, time: "1:30.890", position: 5 },
      { lap: 10, time: "1:30.234", position: 4 },
      { lap: 20, time: "1:30.012", position: 4 },
      { lap: 30, time: "1:29.890", position: 4 },
      { lap: 35, time: "1:28.678", position: 4 },
      { lap: 50, time: "1:30.456", position: 4 },
    ],
  },
  {
    driver: "Lando Norris",
    abbreviation: "NOR",
    team: "McLaren",
    avgLapTime: "1:30.123",
    fastestLap: "1:28.890",
    fastestLapNum: 48,
    totalLaps: 52,
    laps: [
      { lap: 1, time: "1:38.012", position: 8 },
      { lap: 2, time: "1:31.678", position: 7 },
      { lap: 3, time: "1:31.234", position: 7 },
      { lap: 10, time: "1:30.567", position: 6 },
      { lap: 20, time: "1:30.234", position: 5 },
      { lap: 30, time: "1:29.890", position: 5 },
      { lap: 48, time: "1:28.890", position: 5 },
      { lap: 50, time: "1:30.123", position: 5 },
    ],
  },
];

export default function RacePacePage() {
  const [paceData, setPaceData] = useState<DriverPace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPace() {
      try {
        const res = await fetch("https://api.jolpi.ca/ergast/f1/2026/3/laps.json", { signal: AbortSignal.timeout(8000) });
        if (res.ok) {
          const data = await res.json();
          const race = data.MRData.RaceTable.Races?.[0];
          if (race?.Laps) {
            // Aggregate lap times per driver
            const driverLaps: Record<string, { driver: string; time: string; position: number; lap: number }[]> = {};
            for (const lapData of race.Laps) {
              for (const t of lapData.Timings || []) {
                if (!driverLaps[t.driverId]) driverLaps[t.driverId] = [];
                driverLaps[t.driverId].push({
                  driver: t.driverId,
                  time: t.time,
                  position: parseInt(t.position),
                  lap: parseInt(lapData.number),
                });
              }
            }
            // Compute pace
            const pace: DriverPace[] = Object.entries(driverLaps).map(([driverId, laps]) => {
              const sortedLaps = laps.sort((a, b) => a.lap - b.lap);
              const fastest = sortedLaps.reduce((min, l) =>
                parseFloat(l.time.replace(":", "")) < parseFloat(min.time.replace(":", "")) ? l : min
              );
              return {
                driver: driverId,
                abbreviation: driverId.slice(0, 3).toUpperCase(),
                team: "Unknown",
                avgLapTime: "--",
                fastestLap: fastest.time,
                fastestLapNum: fastest.lap,
                totalLaps: sortedLaps.length,
                laps: sortedLaps,
              };
            });
            setPaceData(pace.slice(0, 10));
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching race pace:", error);
      }
      setPaceData(mockPace);
      setLoading(false);
    }

    fetchPace();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Activity className="w-6 h-6 text-cyan-500" />
        <h1 className="text-2xl font-bold">Race Pace Analysis</h1>
      </div>
      <p className="var(--text-muted) text-sm">Japanese Grand Prix 2026 — Lap by lap pace data</p>

      {/* Pace table */}
      <div className="bg-card rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-500" />
          Driver Pace Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Driver</th>
                <th className="text-center p-3 font-medium hidden sm:table-cell">Team</th>
                <th className="text-center p-3 font-medium">Total Laps</th>
                <th className="text-center p-3 font-medium">Fastest Lap</th>
                <th className="text-center p-3 font-medium hidden md:table-cell">FL Lap</th>
              </tr>
            </thead>
            <tbody>
              {paceData.map((driver, i) => (
                <tr key={i} className="border-b hover:bg-muted/50">
                  <td className="p-3">
                    <div className="font-medium">{driver.driver}</div>
                    <div className="text-xs var(--text-muted) sm:hidden">{driver.team}</div>
                  </td>
                  <td className="p-3 text-center hidden sm:table-cell">
                    <div className="text-sm">{driver.team}</div>
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-mono font-medium">{driver.totalLaps}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-mono font-bold text-green-400">{driver.fastestLap}</span>
                  </td>
                  <td className="p-3 text-center hidden md:table-cell">
                    <span className="text-sm var(--text-muted)">Lap {driver.fastestLapNum}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lap time charts */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Lap Time Evolution</h2>
        {paceData.slice(0, 3).map((driver) => (
          <div key={driver.abbreviation} className="bg-card rounded-xl p-4 border">
            <h3 className="font-medium mb-3">{driver.driver}</h3>
            <div className="flex items-end gap-1 h-24">
              {driver.laps.map((lap, i) => {
                const minutes = parseInt(lap.time.split(":")[0]);
                const seconds = parseFloat(lap.time.split(":")[1]);
                const totalSeconds = minutes * 60 + seconds;
                const minTime = 88 * 60; // 1:28
                const maxTime = 100 * 60; // 1:40
                const heightPercent = Math.max(5, Math.min(100, ((totalSeconds - minTime) / (maxTime - minTime)) * 100));
                return (
                  <div
                    key={i}
                    className="flex-1 bg-cyan-500 rounded-t transition-all hover:bg-cyan-400 relative group"
                    style={{ height: `${100 - heightPercent}%` }}
                    title={`Lap ${lap.lap}: ${lap.time}`}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-black/80 var(--text-primary) px-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                      {lap.time}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs var(--text-muted) mt-1">
              <span>Lap 1</span>
              <span>Lap {driver.laps[driver.laps.length - 1]?.lap}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
