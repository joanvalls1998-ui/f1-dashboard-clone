"use client";

import { useEffect, useState } from "react";
import { Flag, Trophy, Clock } from "lucide-react";
import { driverImages, teamColors } from "@/lib/f1-assets";
import Image from "next/image";

interface QualifyingResult {
  position: number;
  driver: string;
  abbreviation: string;
  team: string;
  q1?: string;
  q2?: string;
  q3?: string;
  laps?: number;
}

const mockGrid: QualifyingResult[] = [
  { position: 1, driver: "Andrea Kimi Antonelli", abbreviation: "ANT", team: "Mercedes", q1: "1:30.035", q2: "1:29.048", q3: "1:28.778" },
  { position: 2, driver: "George Russell", abbreviation: "RUS", team: "Mercedes", q1: "1:29.967", q2: "1:29.686", q3: "1:29.076" },
  { position: 3, driver: "Oscar Piastri", abbreviation: "PIA", team: "McLaren", q1: "1:30.200", q2: "1:29.451", q3: "1:29.132" },
  { position: 4, driver: "Charles Leclerc", abbreviation: "LEC", team: "Ferrari", q1: "1:29.915", q2: "1:29.303", q3: "1:29.405" },
  { position: 5, driver: "Lando Norris", abbreviation: "NOR", team: "McLaren", q1: "1:30.401", q2: "1:29.795", q3: "1:29.409" },
  { position: 6, driver: "Lewis Hamilton", abbreviation: "HAM", team: "Ferrari", q1: "1:30.123", q2: "1:29.567", q3: "1:29.512" },
  { position: 7, driver: "Max Verstappen", abbreviation: "VER", team: "Red Bull Racing", q1: "1:30.678", q2: "1:29.890", q3: "1:29.678" },
  { position: 8, driver: "Pierre Gasly", abbreviation: "GAS", team: "Alpine", q1: "1:30.234", q2: "1:29.901", q3: "1:29.890" },
  { position: 9, driver: "Isack Hadjar", abbreviation: "HAD", team: "RB F1 Team", q1: "1:30.567", q2: "1:29.987", q3: "1:29.923" },
  { position: 10, driver: "Oliver Bearman", abbreviation: "BEA", team: "Haas F1 Team", q1: "1:30.890", q2: "1:30.123", q3: "1:30.012" },
  { position: 11, driver: "Liam Lawson", abbreviation: " LAW", team: "RB F1 Team", q1: "1:30.456", q2: "1:30.234", q3: "" },
  { position: 12, driver: "Fernando Alonso", abbreviation: "ALO", team: "Aston Martin", q1: "1:30.678", q2: "1:30.345", q3: "" },
  { position: 13, driver: "Nico Hülkenberg", abbreviation: "HUL", team: "Audi", q1: "1:30.890", q2: "1:30.456", q3: "" },
  { position: 14, driver: "Gabriel Bortoleto", abbreviation: "BOR", team: "Audi", q1: "1:31.012", q2: "1:30.567", q3: "" },
  { position: 15, driver: "Franco Colapinto", abbreviation: "COL", team: "Alpine", q1: "1:30.789", q2: "1:30.678", q3: "" },
  { position: 16, driver: "Alex Albon", abbreviation: "ALB", team: "Williams", q1: "1:31.123", q2: "", q3: "" },
  { position: 17, driver: "Lance Stroll", abbreviation: "STO", team: "Aston Martin", q1: "1:31.234", q2: "", q3: "" },
  { position: 18, driver: "Valtteri Bottas", abbreviation: "BOT", team: "Cadillac", q1: "1:31.345", q2: "", q3: "" },
  { position: 19, driver: "MartyHandler", abbreviation: "DOO", team: "Cadillac", q1: "1:31.456", q2: "", q3: "" },
  { position: 20, driver: "Yuki Tsunoda", abbreviation: "TSU", team: "Haas F1 Team", q1: "1:31.567", q2: "", q3: "" },
];

export default function StartingGridPage() {
  const [grid, setGrid] = useState<QualifyingResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGrid() {
      try {
        const res = await fetch("https://api.jolpi.ca/ergast/f1/2026/3/qualifying.json", { signal: AbortSignal.timeout(8000) });
        if (res.ok) {
          const data = await res.json();
          const race = data.MRData.RaceTable.Races?.[0];
          if (race?.QualifyingResults) {
            const mapped: QualifyingResult[] = race.QualifyingResults.map((r: any) => ({
              position: parseInt(r.position),
              driver: `${r.Driver.givenName} ${r.Driver.familyName}`,
              abbreviation: r.Driver.code,
              team: r.Constructor.name,
              q1: r.Q1,
              q2: r.Q2,
              q3: r.Q3,
            }));
            setGrid(mapped);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching grid:", error);
      }
      setGrid(mockGrid);
      setLoading(false);
    }

    fetchGrid();
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
        <Flag className="w-6 h-6 text-yellow-500" />
        <h1 className="text-2xl font-bold">Starting Grid</h1>
      </div>
      <p className="text-muted-foreground text-sm">Japanese Grand Prix 2026 — Qualifying Results</p>

      {/* Grid visualization */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl p-6 border">
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg font-bold">
            <Trophy className="w-5 h-5" />
            POLE POSITION
          </div>
        </div>

        {/* Grid rows */}
        <div className="space-y-2">
          {grid.map((driver) => (
            <div
              key={driver.position}
              className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                driver.position <= 3
                  ? driver.position === 1
                    ? "bg-yellow-500/10 border-yellow-500/50"
                    : driver.position === 2
                    ? "bg-gray-400/10 border-gray-400/50"
                    : "bg-amber-600/10 border-amber-600/50"
                  : "bg-card border-border hover:bg-muted/50"
              }`}
            >
              {/* Position */}
              <div className={`w-10 text-center font-bold text-lg ${
                driver.position === 1 ? "text-yellow-500" :
                driver.position === 2 ? "text-gray-400" :
                driver.position === 3 ? "text-amber-600" : "text-muted-foreground"
              }`}>
                {driver.position}
              </div>

              {/* Driver image */}
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                {driverImages[driver.abbreviation] && (
                  <Image
                    src={driverImages[driver.abbreviation]}
                    alt={driver.driver}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                )}
              </div>

              {/* Driver info */}
              <div className="flex-1">
                <div className="font-bold">{driver.driver}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-4 rounded-full" style={{ backgroundColor: teamColors[driver.team] || "#666" }} />
                  {driver.team}
                </div>
              </div>

              {/* Times */}
              <div className="hidden sm:flex gap-4 text-xs font-mono">
                {driver.q1 && <div className="text-muted-foreground">Q1: <span className="text-foreground">{driver.q1}</span></div>}
                {driver.q2 && <div className="text-muted-foreground">Q2: <span className="text-foreground">{driver.q2}</span></div>}
                {driver.q3 && <div className="text-cyan-400 font-bold">Q3: {driver.q3}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
