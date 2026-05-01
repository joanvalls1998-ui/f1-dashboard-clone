'use client';

import { useEffect, useState } from 'react';

import { driverImages, teamColors, getDriverInitials } from '@/lib/f1-assets';
import { fetchDriverStandings, fetchConstructorStandings, fetchRaceCalendar, getTeamColor } from '@/lib/api';
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

// Quick stats
const quickStats = [
  { label: 'Races Completed', value: '3/22', icon: Flag, color: '#43B02A' },
  { label: 'Leading Driver', value: 'Antonelli', icon: Target, color: '#FFD700' },
  { label: 'Leading Team', value: 'Mercedes', icon: Trophy, color: '#27F4D2' },
  { label: 'Points Leaders', value: '123 pts', icon: TrendingUp, color: '#E8002D' },
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
        
        // Match drivers to constructors
        const constructorsWithDrivers = constructorsData.map(c => ({
          ...c,
          drivers: driversData
            .filter(d => d.team === c.name)
            .map(d => d.fullName)
        }));
        setConstructors(constructorsWithDrivers);
        
        // Update races with winners from Ergast if completed
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
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#1a1a1a] border-b border-[#333]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #E10600 0%, transparent 50%),
                             radial-gradient(circle at 80% 50%, #3671C6 0%, transparent 50%)`
          }} />
        </div>
        
        <div className="relative px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-500 text-sm uppercase tracking-wider">2026 Season</p>
              <h1 className="text-3xl font-black text-white">F1 Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400 text-sm font-medium">Live Data</span>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickStats.map((stat) => (
              <div key={stat.label} className="bg-[#1a1a1a]/80 backdrop-blur rounded-xl p-3 flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: stat.color + '22' }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-[#171717] border-b border-[#333]">
        <div className="flex px-6">
          <button
            onClick={() => setActiveTab('standings')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'standings'
                ? 'border-red-500 text-white'
                : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Standings
            </span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'calendar'
                ? 'border-red-500 text-white'
                : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Calendar
            </span>
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'teams'
                ? 'border-red-500 text-white'
                : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Teams
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'standings' ? (
          <div className="space-y-6">
            {/* Top 3 Podium */}
            <div className="bg-[#171717] rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">🏆</span> Championship Leaders
              </h2>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              ) : drivers.length > 0 ? (
                <div className="flex items-end justify-center gap-4">
                  {[
                    { idx: 1, driver: drivers[1] }, // P2
                    { idx: 0, driver: drivers[0] }, // P1
                    { idx: 2, driver: drivers[2] }, // P3
                  ].map(({ idx, driver }) => {
                    const heights = ['h-40', 'h-48', 'h-36'];
                    const colors = ['#C0C0C0', '#FFD700', '#CD7F32'];
                    const imageUrl = driverImages[driver.abbreviation as keyof typeof driverImages] || '';
                    
                    return (
                      <div key={driver.position} className={`flex-1 max-w-[140px] ${heights[idx]}`}>
                        {/* Driver Image */}
                        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 mb-2"
                             style={{ borderColor: colors[idx] }}>
                          {imageUrl ? (
                            <img 
                              src={imageUrl}
                              alt={driver.fullName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white text-xs">
                              {driver.abbreviation}
                            </div>
                          )}
                        </div>
                        <p className="text-white text-center font-bold text-sm truncate">
                          {driver.fullName.split(' ').pop()}
                        </p>
                        <p className="text-gray-400 text-center text-xs">{driver.points} pts</p>
                        {/* Podium block */}
                        <div className="mt-auto bg-gradient-to-t from-[#2a2a2a] to-[#1a1a1a] rounded-t-lg pt-2"
                             style={{ borderTop: `3px solid ${colors[idx]}` }}>
                          <p className="text-center text-2xl font-black" style={{ color: colors[idx] }}>
                            {driver.position}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No data available</p>
              )}
            </div>

            {/* Constructor Standings */}
            {constructors.length > 0 && (
              <ConstructorStandingsVisual teams={constructors} />
            )}
          </div>
        ) : (
          <RaceCalendarVisual races={races} />
        )}
        {activeTab === 'teams' && (
          <div className="space-y-6">
            <AllDriversGrid />
            <TeamGallery />
          </div>
        )}
      </div>
    </div>
  );
}
