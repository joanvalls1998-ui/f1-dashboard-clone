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
      setGrid([]);
      setLoading(false);
    }

    fetchGrid();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="border-2 rounded-full h-8 w-8 animate-spin" style={{ borderColor: 'var(--bg-overlay)', borderTopColor: 'var(--accent-red)' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Flag className="w-6 h-6 text-yellow-500" />
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Starting Grid</h1>
      </div>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Japanese Grand Prix 2026 — Qualifying Results</p>

      {/* Grid visualization */}
      <div className="rounded-xl p-6 border" style={{ background: 'linear-gradient(to bottom, var(--bg-elevated), var(--bg-surface))' }}>
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
                driver.position === 2 ? "var(--text-muted)" :
                driver.position === 3 ? "text-amber-600" : ""
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
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <div
                    className="w-2 h-4 rounded-full"
                    style={{ backgroundColor: teamColors[driver.team] || "#666" }}
                    aria-hidden="true"
                  />
                  {driver.team}
                </div>
              </div>

              {/* Times */}
              <div className="hidden sm:flex gap-4 text-xs font-mono">
                {driver.q1 && <div style={{ color: 'var(--text-muted)' }}>Q1: <span style={{ color: 'var(--text-primary)' }}>{driver.q1}</span></div>}
                {driver.q2 && <div style={{ color: 'var(--text-muted)' }}>Q2: <span style={{ color: 'var(--text-primary)' }}>{driver.q2}</span></div>}
                {driver.q3 && <div className="text-cyan-400 font-bold">Q3: {driver.q3}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
