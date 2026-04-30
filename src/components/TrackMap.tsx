"use client";

import { useState, useEffect } from "react";
import { Map, MousePointer } from "lucide-react";

interface TrackPoint {
  x: number;
  y: number;
}

interface Sector {
  name: string;
  start_index: number;
  end_index: number;
  color: string;
}

const trackData: Record<string, { points: TrackPoint[]; sectors: Sector[]; name: string }> = {
  "monaco": {
    name: "Circuit de Monaco",
    points: [
      {x: 50, y: 20}, {x: 70, y: 20}, {x: 85, y: 30}, {x: 85, y: 50}, {x: 75, y: 65},
      {x: 60, y: 70}, {x: 45, y: 70}, {x: 30, y: 60}, {x: 25, y: 45}, {x: 30, y: 30},
      {x: 40, y: 25}, {x: 50, y: 20}
    ],
    sectors: [
      { name: "S1", start_index: 0, end_index: 3, color: "#ff3333" },
      { name: "S2", start_index: 3, end_index: 7, color: "#ffff33" },
      { name: "S3", start_index: 7, end_index: 11, color: "#33ff33" }
    ]
  },
  "silverstone": {
    name: "Silverstone Circuit",
    points: [
      {x: 20, y: 50}, {x: 35, y: 40}, {x: 50, y: 35}, {x: 65, y: 30}, {x: 80, y: 35},
      {x: 90, y: 50}, {x: 85, y: 65}, {x: 70, y: 70}, {x: 55, y: 75}, {x: 40, y: 70},
      {x: 25, y: 60}, {x: 20, y: 50}
    ],
    sectors: [
      { name: "S1", start_index: 0, end_index: 4, color: "#ff3333" },
      { name: "S2", start_index: 4, end_index: 7, color: "#ffff33" },
      { name: "S3", start_index: 7, end_index: 11, color: "#33ff33" }
    ]
  },
  "default": {
    name: "Generic Circuit",
    points: [
      {x: 20, y: 50}, {x: 35, y: 35}, {x: 50, y: 25}, {x: 70, y: 25}, {x: 85, y: 40},
      {x: 90, y: 60}, {x: 80, y: 75}, {x: 60, y: 80}, {x: 40, y: 75}, {x: 25, y: 65},
      {x: 20, y: 50}
    ],
    sectors: [
      { name: "S1", start_index: 0, end_index: 3, color: "#ff3333" },
      { name: "S2", start_index: 3, end_index: 7, color: "#ffff33" },
      { name: "S3", start_index: 7, end_index: 10, color: "#33ff33" }
    ]
  }
};

interface DriverPosition {
  driver_name: string;
  team_color: string;
  position: number;
  sector: string;
  progress: number;
}

const mockPositions: DriverPosition[] = [
  { driver_name: "VER", team_color: "3671c6", position: 1, sector: "S2", progress: 0.45 },
  { driver_name: "NOR", team_color: "ff8000", position: 2, sector: "S2", progress: 0.42 },
  { driver_name: "LEC", team_color: "e8002d", position: 3, sector: "S1", progress: 0.80 },
  { driver_name: "PER", team_color: "3671c6", position: 4, sector: "S3", progress: 0.30 },
  { driver_name: "HAM", team_color: "27f4d2", position: 5, sector: "S1", progress: 0.75 },
];

export function TrackMap() {
  const [selectedTrack, setSelectedTrack] = useState<string>("default");
  const [driverPositions, setDriverPositions] = useState<DriverPosition[]>([]);
  const [hoveredDriver, setHoveredDriver] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching track data
    setTimeout(() => {
      setDriverPositions(mockPositions);
      setLoading(false);
    }, 500);
  }, []);

  const track = trackData[selectedTrack] || trackData["default"];

  const getPositionOnTrack = (progress: number, sectorIndex: number, sectorProgress: number): { x: number; y: number } => {
    const points = track.points;
    const totalPoints = points.length - 1;
    const adjustedProgress = (progress * totalPoints);
    const currentIndex = Math.floor(adjustedProgress);
    const nextIndex = (currentIndex + 1) % points.length;
    const t = adjustedProgress - currentIndex;
    
    const current = points[currentIndex];
    const next = points[nextIndex];
    
    return {
      x: current.x + (next.x - current.x) * t,
      y: current.y + (next.y - current.y) * t
    };
  };

  const getSectorColor = (sectorName: string): string => {
    const sector = track.sectors.find(s => s.name === sectorName);
    return sector?.color || "#666666";
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold">Track Map</h2>
        </div>

        <select
          value={selectedTrack}
          onChange={(e) => setSelectedTrack(e.target.value)}
          className="px-3 py-2 rounded-md border bg-background text-sm"
        >
          <option value="default">Generic Circuit</option>
          <option value="monaco">Monaco</option>
          <option value="silverstone">Silverstone</option>
        </select>
      </div>

      {/* Track visualization */}
      <div className="rounded-lg border bg-card p-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold">{track.name}</h3>
        </div>

        <div className="relative aspect-[2/1] bg-muted/30 rounded-lg overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Track outline */}
            <path
              d={`M ${track.points.map(p => `${p.x} ${p.y}`).join(" L ")} Z`}
              fill="none"
              stroke="#333"
              strokeWidth="3"
              className="track-path"
            />

            {/* Sectors */}
            {track.sectors.map((sector, index) => {
              const sectorPoints = track.points.slice(sector.start_index, sector.end_index + 1);
              return (
                <path
                  key={sector.name}
                  d={`M ${sectorPoints.map(p => `${p.x} ${p.y}`).join(" L ")}`}
                  fill="none"
                  stroke={sector.color}
                  strokeWidth="8"
                  strokeOpacity="0.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}

            {/* Driver positions */}
            {driverPositions.map((driver) => {
              const pos = getPositionOnTrack(driver.progress, 0, 0);
              return (
                <g key={driver.driver_name}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={hoveredDriver === driver.driver_name ? 4 : 3}
                    fill={`#${driver.team_color}`}
                    stroke={driver.position === 1 ? "#ffd700" : "#fff"}
                    strokeWidth={driver.position === 1 ? 1.5 : 0.75}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredDriver(driver.driver_name)}
                    onMouseLeave={() => setHoveredDriver(null)}
                  />
                  {hoveredDriver === driver.driver_name && (
                    <g>
                      <rect
                        x={pos.x + 5}
                        y={pos.y - 12}
                        width={25}
                        height={12}
                        fill={`#${driver.team_color}`}
                        rx={2}
                      />
                      <text
                        x={pos.x + 17.5}
                        y={pos.y - 4}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={5}
                        fontWeight="bold"
                      >
                        {driver.driver_name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Sector legend */}
          <div className="absolute bottom-2 right-2 bg-background/90 rounded p-2 text-xs">
            <div className="font-medium mb-1">Sectors</div>
            {track.sectors.map((sector) => (
              <div key={sector.name} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: sector.color }}
                />
                <span>{sector.name}</span>
              </div>
            ))}
          </div>

          {/* Start/Finish line */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2">
            <div className="bg-white text-black px-2 py-0.5 text-xs font-bold rounded">
              START/FINISH
            </div>
          </div>
        </div>
      </div>

      {/* Driver positions list */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium">Pos</th>
              <th className="text-left p-3 font-medium">Driver</th>
              <th className="text-center p-3 font-medium">Sector</th>
              <th className="text-center p-3 font-medium">Progress</th>
            </tr>
          </thead>
          <tbody>
            {driverPositions
              .sort((a, b) => a.position - b.position)
              .map((driver) => (
                <tr 
                  key={driver.driver_name} 
                  className="border-t hover:bg-muted/50 cursor-pointer"
                  onMouseEnter={() => setHoveredDriver(driver.driver_name)}
                  onMouseLeave={() => setHoveredDriver(null)}
                >
                  <td className="p-3">
                    <span className={`font-bold ${
                      driver.position === 1 ? "text-yellow-500" :
                      driver.position === 2 ? "text-gray-400" :
                      driver.position === 3 ? "text-amber-600" : ""
                    }`}>
                      {driver.position}
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
                  <td className="p-3 text-center">
                    <span 
                      className="px-2 py-1 rounded text-xs font-bold"
                      style={{ backgroundColor: getSectorColor(driver.sector), color: "#fff" }}
                    >
                      {driver.sector}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-full rounded-full"
                        style={{ 
                          width: `${driver.progress * 100}%`,
                          backgroundColor: `#${driver.team_color}`
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
