"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import { TrendingUp, Calendar } from "lucide-react";

interface SeasonPoint {
  driver_name: string;
  team_color: string;
  rounds: number[];
  points_by_round: { round: number; points: number }[];
  total_points: number;
}

const mockSeasonData: SeasonPoint[] = [
  { driver_name: "VER", team_color: "3671c6", rounds: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], 
    points_by_round: [{round:1,points:25},{round:2,points:18},{round:3,points:25},{round:4,points:26},{round:5,points:25},{round:6,points:19},{round:7,points:26},{round:8,points:25},{round:9,points:18},{round:10,points:25},{round:11,points:15},{round:12,points:25},{round:13,points:26},{round:14,points:25},{round:15,points:19},{round:16,points:26},{round:17,points:18},{round:18,points:25},{round:19,points:25},{round:20,points:15},{round:21,points:26},{round:22,points:25},{round:23,points:19},{round:24,points:26}], total_points: 437 },
  { driver_name: "NOR", team_color: "ff8000", rounds: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], 
    points_by_round: [{round:1,points:18},{round:2,points:15},{round:3,points:19},{round:4,points:18},{round:5,points:15},{round:6,points:25},{round:7,points:18},{round:8,points:19},{round:9,points:26},{round:10,points:18},{round:11,points:18},{round:12,points:18},{round:13,points:19},{round:14,points:18},{round:15,points:25},{round:16,points:18},{round:17,points:26},{round:18,points:15},{round:19,points:19},{round:20,points:25},{round:21,points:18},{round:22,points:19},{round:23,points:25},{round:24,points:18}], total_points: 374 },
  { driver_name: "LEC", team_color: "e8002d", rounds: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], 
    points_by_round: [{round:1,points:15},{round:2,points:25},{round:3,points:15},{round:4,points:15},{round:5,points:18},{round:6,points:18},{round:7,points:15},{round:8,points:18},{round:9,points:15},{round:10,points:19},{round:11,points:26},{round:12,points:19},{round:13,points:18},{round:14,points:15},{round:15,points:18},{round:16,points:19},{round:17,points:15},{round:18,points:18},{round:19,points:18},{round:20,points:19},{round:21,points:15},{round:22,points:18},{round:23,points:18},{round:24,points:19}], total_points: 356 },
  { driver_name: "PER", team_color: "3671c6", rounds: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], 
    points_by_round: [{round:1,points:12},{round:2,points:12},{round:3,points:12},{round:4,points:15},{round:5,points:12},{round:6,points:12},{round:7,points:12},{round:8,points:12},{round:9,points:12},{round:10,points:12},{round:11,points:12},{round:12,points:12},{round:13,points:12},{round:14,points:12},{round:15,points:12},{round:16,points:12},{round:17,points:12},{round:18,points:12},{round:19,points:12},{round:20,points:12},{round:21,points:12},{round:22,points:12},{round:23,points:12},{round:24,points:12}], total_points: 291 },
  { driver_name: "HAM", team_color: "27f4d2", rounds: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], 
    points_by_round: [{round:1,points:10},{round:2,points:8},{round:3,points:10},{round:4,points:6},{round:5,points:10},{round:6,points:8},{round:7,points:10},{round:8,points:8},{round:9,points:10},{round:10,points:6},{round:11,points:8},{round:12,points:10},{round:13,points:6},{round:14,points:10},{round:15,points:8},{round:16,points:6},{round:17,points:10},{round:18,points:8},{round:19,points:6},{round:20,points:10},{round:21,points:8},{round:22,points:6},{round:23,points:8},{round:24,points:10}], total_points: 223 },
];

export function SeasonStats() {
  const [seasonData, setSeasonData] = useState<SeasonPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>(["VER", "NOR", "LEC"]);
  const [viewMode, setViewMode] = useState<"cumulative" | "per_round">("cumulative");

  useEffect(() => {
    // Simulate fetching season data
    setTimeout(() => {
      setSeasonData(mockSeasonData);
      setLoading(false);
    }, 500);
  }, []);

  const toggleDriver = (driverName: string) => {
    setSelectedDrivers(prev => 
      prev.includes(driverName) 
        ? prev.filter(d => d !== driverName)
        : [...prev, driverName]
    );
  };

  const getChartData = () => {
    const rounds = Array.from(new Set(seasonData.flatMap(d => d.rounds))).sort((a, b) => a - b);
    
    return rounds.map(round => {
      const dataPoint: Record<string, any> = { round };
      
      seasonData.forEach(driver => {
        const roundData = driver.points_by_round.find(p => p.round === round);
        const prevTotal = driver.points_by_round
          .filter(p => p.round < round)
          .reduce((sum, p) => sum + p.points, 0);
        
        if (viewMode === "cumulative") {
          dataPoint[driver.driver_name] = roundData ? prevTotal + roundData.points : prevTotal;
        } else {
          dataPoint[driver.driver_name] = roundData?.points || 0;
        }
      });
      
      return dataPoint;
    });
  };

  const colors = ["#3671c6", "#ff8000", "#e8002d", "#27f4d2", "#229971"];

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
        <TrendingUp className="w-5 h-5 text-green-500" />
        <h2 className="text-lg font-semibold">Season Stats</h2>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("cumulative")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              viewMode === "cumulative" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            Cumulative
          </button>
          <button
            onClick={() => setViewMode("per_round")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              viewMode === "per_round" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            Per Round
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {seasonData.map((driver) => (
            <button
              key={driver.driver_name}
              onClick={() => toggleDriver(driver.driver_name)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition-opacity ${
                selectedDrivers.includes(driver.driver_name) ? "" : "opacity-40"
              }`}
              style={{ backgroundColor: `#${driver.team_color}20`, borderColor: `#${driver.team_color}` }}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: `#${driver.team_color}` }}
              />
              {driver.driver_name}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-lg border bg-card p-4">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={getChartData()}>
            <XAxis 
              dataKey="round" 
              label={{ value: "Round", position: "bottom" }}
              tickFormatter={(value) => `R${value}`}
            />
            <YAxis 
              label={{ value: viewMode === "cumulative" ? "Total Points" : "Points", angle: -90, position: "left" }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              labelFormatter={(value) => `Round ${value}`}
            />
            <Legend />
            {seasonData
              .filter(d => selectedDrivers.includes(d.driver_name))
              .map((driver, index) => (
                <Line 
                  key={driver.driver_name}
                  type="monotone"
                  dataKey={driver.driver_name}
                  stroke={`#${driver.team_color}`}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Standings table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium">Pos</th>
              <th className="text-left p-3 font-medium">Driver</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Team</th>
              <th className="text-right p-3 font-medium">Points</th>
            </tr>
          </thead>
          <tbody>
            {seasonData
              .sort((a, b) => b.total_points - a.total_points)
              .map((driver, index) => (
                <tr key={driver.driver_name} className="border-t hover:bg-muted/50">
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
                        style={{ backgroundColor: `#${driver.team_color}` }}
                      />
                      <span className="font-medium">{driver.driver_name}</span>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">
                    {driver.driver_name === "VER" || driver.driver_name === "PER" ? "Red Bull Racing" :
                     driver.driver_name === "NOR" || driver.driver_name === "LEC" ? "McLaren" : "Ferrari"}
                  </td>
                  <td className="p-3 text-right font-bold">{driver.total_points}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
