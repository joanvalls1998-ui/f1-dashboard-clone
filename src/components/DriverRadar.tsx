"use client";

import { useState, useMemo } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { driverImages, getTeamColor } from "@/lib/f1-assets";
import Image from "next/image";
import { Target, RotateCcw } from "lucide-react";

type DriverMetric = "Quali" | "Ritme" | "Consistència" | "Sortides" | "Meteo";

interface RadarData {
  metric: string;
  A: number;
  B: number;
}

// Mock stats for comparison — would ideally come from real data analysis
const driverStats: Record<string, Record<DriverMetric, number>> = {
  VER: { Quali: 92, Ritme: 95, Consistència: 94, Sortides: 88, Meteo: 93 },
  NOR: { Quali: 90, Ritme: 93, Consistència: 89, Sortides: 85, Meteo: 87 },
  LEC: { Quali: 93, Ritme: 91, Consistència: 86, Sortides: 90, Meteo: 89 },
  HAM: { Quali: 91, Ritme: 92, Consistència: 92, Sortides: 89, Meteo: 91 },
  RUS: { Quali: 89, Ritme: 90, Consistència: 88, Sortides: 87, Meteo: 86 },
  PIA: { Quali: 88, Ritme: 90, Consistència: 85, Sortides: 84, Meteo: 85 },
  SAI: { Quali: 88, Ritme: 89, Consistència: 90, Sortides: 86, Meteo: 88 },
  ALO: { Quali: 90, Ritme: 88, Consistència: 87, Sortides: 92, Meteo: 93 },
  GAS: { Quali: 85, Ritme: 86, Consistència: 84, Sortides: 83, Meteo: 84 },
  OCO: { Quali: 84, Ritme: 85, Consistència: 83, Sortides: 84, Meteo: 82 },
};

const drivers = [
  { abbr: "VER", name: "M. Verstappen" },
  { abbr: "NOR", name: "L. Norris" },
  { abbr: "LEC", name: "C. Leclerc" },
  { abbr: "HAM", name: "L. Hamilton" },
  { abbr: "RUS", name: "G. Russell" },
  { abbr: "PIA", name: "O. Piastri" },
  { abbr: "SAI", name: "C. Sainz" },
  { abbr: "ALO", name: "F. Alonso" },
  { abbr: "GAS", name: "P. Gasly" },
  { abbr: "OCO", name: "E. Ocon" },
];

export default function DriverRadar({ className }: { className?: string }) {
  const [selA, setSelA] = useState("VER");
  const [selB, setSelB] = useState("NOR");
  const [view, setView] = useState<"radar" | "bar">("radar");

  const data: RadarData[] = useMemo(() => {
    const metrics: DriverMetric[] = ["Quali", "Ritme", "Consistència", "Sortides", "Meteo"];
    return metrics.map((m) => ({
      metric: m,
      A: driverStats[selA]?.[m] || 80,
      B: driverStats[selB]?.[m] || 80,
    }));
  }, [selA, selB]);

  const colorA = getTeamColor("Red Bull Racing");
  const colorB = getTeamColor("McLaren");

  const diff = useMemo(() => {
    let sA = 0, sB = 0;
    data.forEach((d) => { sA += d.A; sB += d.B; });
    return { totalA: Math.round(sA / data.length), totalB: Math.round(sB / data.length) };
  }, [data]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Target className="w-5 h-5" style={{ color: "var(--accent-red)" }} />
        <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
          Comparador de Pilots
        </h2>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex gap-2">
          <select className="px-3 py-2 rounded-lg text-sm" style={{ background: "var(--bg-surface)", color: "var(--text-primary)", border: "1px solid var(--bg-overlay)" }} value={selA} onChange={(e) => setSelA(e.target.value)}>
            {drivers.map((d) => (
              <option key={d.abbr} value={d.abbr}>{d.name}</option>
            ))}
          </select>
          <span className="text-sm self-center" style={{ color: "var(--text-muted)" }}>vs</span>
          <select className="px-3 py-2 rounded-lg text-sm" style={{ background: "var(--bg-surface)", color: "var(--text-primary)", border: "1px solid var(--bg-overlay)" }} value={selB} onChange={(e) => setSelB(e.target.value)}>
            {drivers.map((d) => (
              <option key={d.abbr} value={d.abbr}>{d.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1" />
        <button
          onClick={() => setView(v => v === "radar" ? "bar" : "radar")}
          className="px-3 py-2 rounded-lg text-xs font-medium border transition-all"
          style={{ borderColor: "var(--bg-overlay)", color: "var(--text-secondary)" }}
        >
          <RotateCcw className="w-3 h-3 inline mr-1" />
          {view === "radar" ? "Barra" : "Radar"}
        </button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between text-xs mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colorA }} />
            <span className="font-medium" style={{ color: "var(--text-primary)" }}>{selA} — {diff.totalA}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colorB }} />
            <span className="font-medium" style={{ color: "var(--text-primary)" }}>{selB} — {diff.totalB}</span>
          </div>
        </div>

        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid gridType="polygon" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              />
              <PolarRadiusAxis
                domain={[60, 100]}
                tick={{ fill: "var(--text-muted)", fontSize: 10 }}
              />
              <Radar name={selA} dataKey="A" stroke={colorA} fill={colorA} fillOpacity={0.25} />
              <Radar name={selB} dataKey="B" stroke={colorB} fill={colorB} fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
