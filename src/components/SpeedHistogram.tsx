"use client";

import { useState, useEffect } from "react";
import { BarChart3, Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface SpeedHistogram {
  speed_range: string;
  count: number;
  color: string;
}

export function SpeedHistogram() {
  const [histogramData, setHistogramData] = useState<SpeedHistogram[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<string>("all");

  useEffect(() => {
    // Simulate fetching speed data
    setTimeout(() => {
      setHistogramData([]);
      setLoading(false);
    }, 500);
  }, []);

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
        <BarChart3 className="w-5 h-5 text-green-500" />
        <h2 className="text-lg font-semibold">Speed Distribution</h2>
      </div>

      {/* Driver selector */}
      <div className="flex gap-2">
        <select
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
          aria-label="Filter speed data by driver"
          className="px-3 py-2 rounded-md border bg-background text-sm"
        >
          <option value="all">All Drivers</option>
          <option value="VER">Max Verstappen</option>
          <option value="NOR">Lando Norris</option>
          <option value="LEC">Charles Leclerc</option>
        </select>
      </div>

      {/* Histogram chart */}
      <div className="rounded-lg border bg-card p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={histogramData}>
            <XAxis 
              dataKey="speed_range" 
              label={{ value: "Speed (km/h)", position: "bottom" }}
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              label={{ value: "Number of Occurrences", angle: -90, position: "insideLeft" }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              labelFormatter={(label) => `Speed: ${label} km/h`}
              formatter={(value: any) => [`${value} occurrences`, "Count"]}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {histogramData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border bg-card text-center">
          <div className="text-2xl font-bold text-green-500">285.3</div>
          <div className="text-sm text-muted-foreground">Average Speed</div>
        </div>
        <div className="p-4 rounded-lg border bg-card text-center">
          <div className="text-2xl font-bold text-yellow-500">326</div>
          <div className="text-sm text-muted-foreground">Top Speed</div>
        </div>
        <div className="p-4 rounded-lg border bg-card text-center">
          <div className="text-2xl font-bold text-blue-500">261</div>
          <div className="text-sm text-muted-foreground">Min Speed</div>
        </div>
      </div>

      {/* Speed zones */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-medium mb-3">Speed Zones</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "#33ff33" }}></div>
              <span className="text-sm">DRS Zone</span>
            </div>
            <span className="text-sm font-medium">290-326 km/h</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "#ffff33" }}></div>
              <span className="text-sm">Fast Corners</span>
            </div>
            <span className="text-sm font-medium">280-290 km/h</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "#ff6633" }}></div>
              <span className="text-sm">Slow Corners</span>
            </div>
            <span className="text-sm font-medium">150-200 km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
