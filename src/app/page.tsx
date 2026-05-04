'use client';

import { useEffect, useState } from 'react';
import { driverImages, teamColors, getDriverInitials, getTeamColor } from '@/lib/f1-assets';
import { fetchDriverStandings, fetchConstructorStandings, fetchRaceCalendar } from '@/lib/api';
import { ConstructorStandingsVisual } from '@/components/TeamCard';
import { RaceCalendarVisual } from '@/components/CircuitCard';
import { TeamGallery, AllDriversGrid } from '@/components/TeamGallery';
import {
  Trophy,
  Users,
  Calendar,
  TrendingUp,
  Activity,
  Flag,
  Target,
  Loader2
} from 'lucide-react';

interface Driver {
  position: number;
  abbreviation: string;
  fullName: string;
  team: string;
  points: number;
  driverId: string;
  number: string;
  nationality: string;
}

interface Constructor {
  position: number;
  name: string;
  points: number;
  wins: number;
  drivers: string[];
  color: string;
}

interface Race {
  round: number;
  name: string;
  country: string;
  city: string;
  date: string;
  circuit: string;
  winner?: string;
  winnerTeam?: string;
  status: 'completed' | 'upcoming' | 'cancelled';
}

// Quick stats — animated counters
const quickStatsData = [
  { label: 'Races Completed', value: '3/22', icon: Flag, color: '#43B02A' },
  { label: 'Leading Driver', value: 'ANT', icon: Target, color: '#FFD700' },
  { label: 'Leading Team', value: 'Mercedes', icon: Trophy, color: '#27F4D2' },
  { label: 'Points Leader', value: '68 pts', icon: TrendingUp, color: '#E10600' },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'standings' | 'calendar' | 'teams'>('standings');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [constructors, setConstructors] = useState<Constructor[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
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

        const constructorsWithDrivers = constructorsData.map(c => ({
          ...c,
          drivers: driversData
            .filter(d => d.team === c.name)
            .map(d => d.fullName)
        }));
        setConstructors(constructorsWithDrivers);
        setRaces(racesData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 15% 50%, #E10600 0%, transparent 45%),
                             radial-gradient(circle at 85% 50%, #3671C6 0%, transparent 45%)`,
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(var(--bg-overlay) 1px, transparent 1px),
                             linear-gradient(90deg, var(--bg-overlay) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative px-1 pt-4 pb-6">
          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="eyebrow">2026 Season</p>
              <h1
                className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                F1 Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--bg-overlay)]">
              <div className="live-dot" />
              <span className="text-xs font-medium text-[var(--status-live)]">Live Data</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickStatsData.map((stat, i) => (
              <div
                key={stat.label}
                className="card animate-enter"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: stat.color + '18' }}
                  >
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="stat-number" style={{ fontSize: '1.1rem' }}>{stat.value}</p>
                    <p className="stat-label">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-[var(--bg-overlay)] mt-2 mb-6">
        <div className="flex gap-1">
          {[
            { key: 'standings', label: 'Standings', icon: Trophy },
            { key: 'calendar', label: 'Calendar', icon: Calendar },
            { key: 'teams', label: 'Teams', icon: Users },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`tab-item flex items-center gap-2 ${activeTab === tab.key ? 'active' : ''}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[var(--accent-red)] animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'standings' && (
            <div className="space-y-6">
              {/* Podium */}
              {drivers.length > 0 && (
                <div className="card">
                  <div className="flex items-center gap-2 mb-6">
                    <Trophy className="w-5 h-5 text-[var(--accent-red)]" />
                    <h2
                      className="text-lg font-bold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Championship Leaders
                    </h2>
                  </div>
                  <div className="flex items-end justify-center gap-3 md:gap-6">
                    {/* P2 */}
                    {drivers[1] && (
                      <div className="flex-1 max-w-32 flex flex-col items-center animate-enter" style={{ animationDelay: '80ms' }}>
                        <div
                          className="w-16 h-16 rounded-full border-[3px] overflow-hidden mb-2"
                          style={{ borderColor: '#C0C0C0' }}
                        >
                          {getDriverImg(drivers[1].abbreviation)}
                        </div>
                        <p
                          className="text-sm font-semibold text-[var(--text-primary)] truncate max-w-full"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {drivers[1].fullName.split(' ').pop()}
                        </p>
                        <p className="stat-label">{drivers[1].points} pts</p>
                        <div
                          className="mt-auto w-full podium-block"
                          style={{ '--podium-color': '#C0C0C0' } as React.CSSProperties}
                        >
                          <p className="text-2xl font-extrabold" style={{ color: '#C0C0C0', fontFamily: "var(--font-mono)" }}>
                            P2
                          </p>
                        </div>
                      </div>
                    )}

                    {/* P1 */}
                    {drivers[0] && (
                      <div className="flex-1 max-w-36 flex flex-col items-center animate-enter" style={{ animationDelay: '0ms' }}>
                        <div
                          className="w-20 h-20 rounded-full border-[4px] overflow-hidden mb-2"
                          style={{ borderColor: '#FFD700' }}
                        >
                          {getDriverImg(drivers[0].abbreviation)}
                        </div>
                        <p
                          className="text-base font-bold text-[var(--text-primary)] truncate max-w-full"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {drivers[0].fullName.split(' ').pop()}
                        </p>
                        <p className="stat-label">{drivers[0].points} pts</p>
                        <div
                          className="mt-auto w-full podium-block"
                          style={{ '--podium-color': '#FFD700' } as React.CSSProperties}
                        >
                          <p className="text-3xl font-extrabold" style={{ color: '#FFD700', fontFamily: "var(--font-mono)" }}>
                            P1
                          </p>
                        </div>
                      </div>
                    )}

                    {/* P3 */}
                    {drivers[2] && (
                      <div className="flex-1 max-w-28 flex flex-col items-center animate-enter" style={{ animationDelay: '160ms' }}>
                        <div
                          className="w-14 h-14 rounded-full border-[3px] overflow-hidden mb-2"
                          style={{ borderColor: '#CD7F32' }}
                        >
                          {getDriverImg(drivers[2].abbreviation)}
                        </div>
                        <p
                          className="text-sm font-semibold text-[var(--text-primary)] truncate max-w-full"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {drivers[2].fullName.split(' ').pop()}
                        </p>
                        <p className="stat-label">{drivers[2].points} pts</p>
                        <div
                          className="mt-auto w-full podium-block"
                          style={{ '--podium-color': '#CD7F32' } as React.CSSProperties}
                        >
                          <p className="text-xl font-extrabold" style={{ color: '#CD7F32', fontFamily: "var(--font-mono)" }}>
                            P3
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Constructor Standings */}
              {constructors.length > 0 && (
                <ConstructorStandingsVisual teams={constructors} />
              )}
            </div>
          )}

          {activeTab === 'calendar' && (
            <RaceCalendarVisual races={races} />
          )}

          {activeTab === 'teams' && (
            <div className="space-y-6">
              <AllDriversGrid />
              <TeamGallery />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getDriverImg(abbreviation: string) {
  const imgUrl = driverImages[abbreviation as keyof typeof driverImages];
  if (imgUrl) {
    return (
      <img
        src={imgUrl}
        alt={abbreviation}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }
  return (
    <div
      className="w-full h-full bg-[var(--bg-elevated)] flex items-center justify-center"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <span className="text-[var(--text-secondary)] text-xs">{abbreviation}</span>
    </div>
  );
}
