"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface LapComparison {
  lap_number: number;
  ver_lap_time: number | null;
  nor_lap_time: number | null;
  lec_lap_time: number | null;
}

const mockComparisonData: LapComparison[] = [
  { lap_number: 1, ver_lap_time: 120.456, nor_lap_time: 120.678, lec_lap_time: 120.234 },
  { lap_number: 2, ver_lap_time: 95.123, nor_lap_time: 95.456, lec_lap_time: 95.234 },
  { lap_number: 3, ver_lap_time: 94.567, nor_lap_time: 94.789, lec_lap_time: 94.456 },
  { lap_number: 4, ver_lap_time: 93.890, nor_lap_time: 94.123, lec_lap_time: 93.789 },
  { lap_number: 5, ver_lap_time: 93.234, nor_lap_time: 93.456, lec_lap_time: 93.123 },
  { lap_number: 6, ver_lap_time: 92.890, nor_lap_time: 93.234, lec_lap_time: 92.890 },
  { lap_number: 7, ver_lap_time: 92.456, nor_lap_time: 92.789, lec_lap_time: 92.456 },
  { lap_number: 8, ver_lap_time: 92.123, nor_lap_time: 92.456, lec_lap_time: 92.234 },
  { lap_number: 9, ver_lap_time: 91.890, nor_lap_time: 92.123, lec_lap_time: 92.123 },
  { lap_number: 10, ver_lap_time: 91.567, nor_lap_time: 91.890, lec_lap_time: 92.123 },
];

const drivers = [
  { name: "VER", color: "3671c6", team: "Red Bull Racing" },
  { name: "NOR", color: "ff8000", team: "McLaren" },
  { name: "LEC", color: "e8002d", team: "Ferrari" },
  { name: "PER", color: "3671c6", team: "Red Bull Racing" },
  { name: "HAM", color: "27f4d2", team: "Mercedes" },
  { name: "ALO", color: "229971", team: "Aston Martin" },
  { name: "RUS", color: "27f4d2", team: "Mercedes" },
  { name: "PIA", color: "ff8000", team: "McLaren" },
];

export function DriverComparison() {
  const [comparisonData, setComparisonData] = useState<LapComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>(["VER", "NOR"]);
  const [referenceDriver, setReferenceDriver] = useState<string>("VER");

  useEffect(() => {
    // Simulate fetching comparison data
    setTimeout(() => {
      setComparisonData(mockComparisonData);
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
    return comparisonData.map(lap => {
      const dataPoint: Record<string, any> = { lap: `L${lap.lap_number}` };
      
      selectedDrivers.forEach(driverName => {
        const driver = drivers.find(d => d.name === driverName);
        if (driver) {
          const timeKey = `${driverName.toLowerCase()}_lap_time`;
          const time = (lap as any)[timeKey];
          dataPoint[driverName] = time;
        }
      });
      
      return dataPoint;
    });
  };

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
        <Search className="w-5 h-5 text-purple-500" />
        <h2 className="text-lg font-semibold">Driver Comparison</h2>
      </div>

      {/* Driver selector */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Select drivers to compare (max 4)</div>
        <div className="flex flex-wrap gap-2">
          {drivers.map((driver) => (
            <button
              key={driver.name}
              onClick={() => selectedDrivers.length < 4 && !selectedDrivers.includes(driver.name) && toggleDriver(driver.name)}
              disabled={selectedDrivers.includes(driver.name) || selectedDrivers.length >= 4}
              className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition-opacity ${
                selectedDrivers.includes(driver.name) 
                  ? "opacity-100" 
                  : "opacity-50 hover:opacity-100 cursor-pointer disabled:cursor-not-allowed"
              }`}
              style={{ 
                backgroundColor: selectedDrivers.includes(driver.name) ? `#${driver.color}` : `#${driver.color}20`,
                color: selectedDrivers.includes(driver.name) ? "#fff" : `#${driver.color}`
              }}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: `#${driver.color}` }}
              />
              {driver.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected drivers */}
      <div className="flex gap-2">
        {selectedDrivers.map(driverName => {
          const driver = drivers.find(d => d.name === driverName);
          return (
            <div
              key={driverName}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border"
              style={{ borderColor: `#${driver?.color}` }}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: `#${driver?.color}` }}
              />
              <span className="font-medium">{driverName}</span>
              <button
                onClick={() => toggleDriver(driverName)}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/* Comparison chart */}
      <div className="rounded-lg border bg-card p-4">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={getChartData()}>
            <XAxis dataKey="lap" />
            <YAxis 
              domain={["auto", "auto"]}
              label={{ value: "Lap Time (seconds)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              labelFormatter={(label) => `Lap ${label}`}
              formatter={(value: any) => [`${(value / 1000).toFixed(3)}s`, ""]}
            />
            <Legend />
            {selectedDrivers.map(driverName => {
              const driver = drivers.find(d => d.name === driverName);
              return (
                <Line 
                  key={driverName}
                  type="monotone"
                  dataKey={driverName}
                  stroke={`#${driver?.color}`}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  connectNulls
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Lap by lap comparison */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium">Lap</th>
              {selectedDrivers.map(driverName => {
                const driver = drivers.find(d => d.name === driverName);
                return (
                  <th key={driverName} className="text-center p-3 font-medium">
                    <div className="flex items-center justify-center gap-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: `#${driver?.color}` }}
                      />
                      {driverName}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((lap) => (
              <tr key={lap.lap_number} className="border-t hover:bg-muted/50">
                <td className="p-3 font-medium">Lap {lap.lap_number}</td>
                {selectedDrivers.map(driverName => {
                  const timeKey = `${driverName.toLowerCase()}_lap_time`;
                  const time = (lap as any)[timeKey];
                  return (
                    <td key={driverName} className="p-3 text-center font-mono">
                      {time ? `${(time / 1000).toFixed(3)}s` : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDrivers.length < 2 && (
        <div className="text-center py-4 text-muted-foreground">
          Select at least 2 drivers to compare.
        </div>
      )}
    </div>
  );
}
