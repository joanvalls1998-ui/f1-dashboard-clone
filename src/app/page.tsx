"use client";

import { useEffect, useState } from "react";
import { driverImages, teamColors, getTeamColor } from "@/lib/f1-assets";
import { fetchDriverStandings, fetchConstructorStandings, fetchRaceCalendar } from "@/lib/api";
import { ConstructorStandingsVisual } from "@/components/TeamCard";
import { RaceCalendarVisual } from "@/components/CircuitCard";
import { TeamGallery, AllDriversGrid } from "@/components/TeamGallery";
import HeroSection from "@/components/HeroSection";
import DriverRadar from "@/components/DriverRadar";
import ExportCSV from "@/components/ExportCSV";
import {
  Trophy, Users, Calendar, TrendingUp, Activity, Flag, Target, Loader2
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'standings' | 'calendar' | 'teams' | 'compare'>('standings');
  const [drivers, setDrivers] = useState<any[]>([]);
  const [constructors, setConstructors] = useState<any[]>([]);
  const [races, setRaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [driversData, constructorsData, racesData] = await Promise.all([
          fetchDriverStandings(2026),
          fetchConstructorStandings(2026),
          fetchRaceCalendar(2026),
        ]);
        setDrivers(driversData);
        setConstructors(constructorsData.map((c: any) => ({
          ...c,
          drivers: driversData.filter((d: any) => d.team === c.name).map((d: any) => d.fullName)
        })));
        setRaces(racesData);
      } catch (e) {
        console.error("Error loading:", e);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />

      <div className="border-b border-[var(--bg-overlay)] mt-4 mb-6">
        <div className="flex gap-1 overflow-x-auto">
          {[
            { key: 'standings', label: 'Classificacions', icon: Trophy },
            { key: 'calendar', label: 'Calendari', icon: Calendar },
            { key: 'teams', label: 'Equips', icon: Users },
            { key: 'compare', label: 'Comparador', icon: Target },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`tab-item flex items-center gap-2 whitespace-nowrap ${activeTab === tab.key ? 'active' : ''}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[var(--accent-red)] animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'standings' && (
            <div className="space-y-6">
              {drivers.length > 0 && <div className="card"><Podium drivers={drivers} /></div>}
              {constructors.length > 0 && <ConstructorStandingsVisual teams={constructors} />}
            </div>
          )}
          {activeTab === 'calendar' && <RaceCalendarVisual races={races} />}
          {activeTab === 'teams' && (
            <div className="space-y-6">
              <AllDriversGrid />
              <TeamGallery />
            </div>
          )}
          {activeTab === 'compare' && <DriverRadar />}
        </div>
      )}

      {drivers.length > 0 && (
        <div className="mt-8">
          <ExportCSV
            data={drivers.map((d) => ({ Posició: d.position, Pilot: d.fullName, Equip: d.team, Punts: d.points }))}
            filename="classificacio-pilots-2026.csv"
            label="Exportar pilots CSV"
          />
        </div>
      )}
    </div>
  );
}

function Podium({ drivers }: { drivers: any[] }) {
  if (!drivers[0]) return null;
  const d = drivers;
  return (
    <div className="flex items-end justify-center gap-3 md:gap-6 py-6">
      {[d[1], d[0], d[2]].map((driver, i) => {
        if (!driver) return null;
        const h = i === 1 ? 32 : i === 0 ? 24 : 20;
        const sz = i === 1 ? 20 : i === 0 ? 16 : 14;
        const colors = ['#C0C0C0', '#FFD700', '#CD7F32'];
        const pos = ['P2', 'P1', 'P3'][i];
        return (
          <div key={pos} className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-4 overflow-hidden mb-2" style={{ borderColor: colors[i], width: sz === 20 ? 80 : sz === 16 ? 64 : 56, height: sz === 20 ? 80 : sz === 16 ? 64 : 56 }}>
              {driverImages[driver.abbreviation as keyof typeof driverImages] ? (
                <img src={driverImages[driver.abbreviation as keyof typeof driverImages]} alt={driver.abbreviation} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-xl font-bold">{driver.abbreviation}</div>
              )}
            </div>
            <p className="font-bold text-sm">{driver.fullName.split(" ").pop()}</p>
            <p className="text-xs text-zinc-500">{driver.points} pts</p>
            <div className="w-full rounded-t-lg flex items-center justify-center text-white font-black text-xl mt-2"
              style={{ height: h, backgroundColor: colors[i] }}
            >
              {pos}
            </div>
          </div>
        );
      })}
    </div>
  );
}
