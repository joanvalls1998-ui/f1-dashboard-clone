'use client';

import { useEffect, useState } from 'react';

import { ConstructorStandingsVisual } from '@/components/TeamCard';
import { RaceCalendarVisual } from '@/components/CircuitCard';
import { 
  Trophy, 
  Users, 
  Calendar, 
  TrendingUp,
  Activity,
  Flag,
  Target
} from 'lucide-react';

// Real 2026 data
const driverStandings2026 = [
  { position: 1, abbreviation: 'ANT', fullName: 'Kimi Antonelli', team: 'Mercedes', points: 68 },
  { position: 2, abbreviation: 'RUS', fullName: 'George Russell', team: 'Mercedes', points: 55 },
  { position: 3, abbreviation: 'LEC', fullName: 'Charles Leclerc', team: 'Ferrari', points: 42 },
  { position: 4, abbreviation: 'HAM', fullName: 'Lewis Hamilton', team: 'Ferrari', points: 35 },
  { position: 5, abbreviation: 'NOR', fullName: 'Lando Norris', team: 'McLaren', points: 20 },
  { position: 6, abbreviation: 'PIA', fullName: 'Oscar Piastri', team: 'McLaren', points: 18 },
  { position: 7, abbreviation: 'BEA', fullName: 'Oliver Bearman', team: 'Haas F1 Team', points: 16 },
  { position: 8, abbreviation: 'GAS', fullName: 'Pierre Gasly', team: 'Alpine', points: 15 },
  { position: 9, abbreviation: 'VER', fullName: 'Max Verstappen', team: 'Red Bull Racing', points: 12 },
  { position: 10, abbreviation: 'LAW', fullName: 'Liam Lawson', team: 'Racing Bulls', points: 8 },
  { position: 11, abbreviation: 'LIN', fullName: 'Arvid Lindblad', team: 'Racing Bulls', points: 4 },
  { position: 12, abbreviation: 'HAD', fullName: 'Isack Hadjar', team: 'Red Bull Racing', points: 4 },
  { position: 13, abbreviation: 'BOR', fullName: 'Gabriel Bortoleto', team: 'Audi', points: 2 },
  { position: 14, abbreviation: 'SAI', fullName: 'Carlos Sainz', team: 'Williams', points: 2 },
  { position: 15, abbreviation: 'OCO', fullName: 'Esteban Ocon', team: 'Haas F1 Team', points: 1 },
  { position: 16, abbreviation: 'COL', fullName: 'Franco Colapinto', team: 'Alpine', points: 1 },
  { position: 17, abbreviation: 'ALB', fullName: 'Alexander Albon', team: 'Williams', points: 0 },
  { position: 18, abbreviation: 'PER', fullName: 'Sergio Perez', team: 'Cadillac', points: 0 },
  { position: 19, abbreviation: 'STR', fullName: 'Lance Stroll', team: 'Aston Martin', points: 0 },
  { position: 20, abbreviation: 'ALO', fullName: 'Fernando Alonso', team: 'Aston Martin', points: 0 },
];

const constructorStandings2026 = [
  { position: 1, name: 'Mercedes', points: 123, wins: 3, drivers: ['Kimi Antonelli', 'George Russell'], color: '#27F4D2' },
  { position: 2, name: 'Ferrari', points: 77, wins: 0, drivers: ['Charles Leclerc', 'Lewis Hamilton'], color: '#E8002D' },
  { position: 3, name: 'McLaren', points: 38, wins: 0, drivers: ['Lando Norris', 'Oscar Piastri'], color: '#FF8000' },
  { position: 4, name: 'Haas F1 Team', points: 17, wins: 0, drivers: ['Oliver Bearman', 'Esteban Ocon'], color: '#F0F0F0' },
  { position: 5, name: 'Alpine', points: 16, wins: 0, drivers: ['Pierre Gasly', 'Franco Colapinto'], color: '#FF87BC' },
  { position: 6, name: 'Red Bull Racing', points: 16, wins: 0, drivers: ['Max Verstappen', 'Isack Hadjar'], color: '#3671C6' },
  { position: 7, name: 'Racing Bulls', points: 12, wins: 0, drivers: ['Liam Lawson', 'Arvid Lindblad'], color: '#3671C6' },
  { position: 8, name: 'Audi', points: 2, wins: 0, drivers: ['Gabriel Bortoleto'], color: '#CC0000' },
  { position: 9, name: 'Williams', points: 2, wins: 0, drivers: ['Carlos Sainz', 'Alexander Albon'], color: '#64C4FF' },
  { position: 10, name: 'Aston Martin', points: 0, wins: 0, drivers: ['Lance Stroll', 'Fernando Alonso'], color: '#229971' },
  { position: 11, name: 'Cadillac', points: 0, wins: 0, drivers: ['Sergio Perez'], color: '#C20000' },
];

const races2026 = [
  { round: 1, name: 'Australian GP', country: 'Australia', city: 'Melbourne', date: '16 Mar', circuit: 'Albert Park', winner: 'Russell', winnerTeam: 'Mercedes', status: 'completed' as const },
  { round: 2, name: 'Chinese GP', country: 'China', city: 'Shanghai', date: '23 Mar', circuit: 'Shanghai International', winner: 'Antonelli', winnerTeam: 'Mercedes', status: 'completed' as const },
  { round: 3, name: 'Japanese GP', country: 'Japan', city: 'Suzuka', date: '6 Apr', circuit: 'Suzuka Circuit', winner: 'Antonelli', winnerTeam: 'Mercedes', status: 'completed' as const },
  { round: 4, name: 'Bahrain GP', country: 'Bahrain', city: 'Sakhir', date: '13 Apr', circuit: 'Bahrain International', status: 'cancelled' as const },
  { round: 5, name: 'Saudi GP', country: 'Saudi Arabia', city: 'Jeddah', date: '20 Apr', circuit: 'Jeddah Corniche', status: 'cancelled' as const },
  { round: 6, name: 'Miami GP', country: 'Miami', city: 'Miami', date: '3 May', circuit: 'Hard Rock Stadium', status: 'upcoming' as const },
  { round: 7, name: 'Monaco GP', country: 'Monaco', city: 'Monaco', date: '10 May', circuit: 'Circuit de Monaco', status: 'upcoming' as const },
  { round: 8, name: 'Spanish GP', country: 'Spain', city: 'Barcelona', date: '24 May', circuit: 'Circuit de Barcelona-Catalunya', status: 'upcoming' as const },
  { round: 9, name: 'Canadian GP', country: 'Canada', city: 'Montreal', date: '7 Jun', circuit: 'Circuit Gilles Villeneuve', status: 'upcoming' as const },
  { round: 10, name: 'Austrian GP', country: 'Austria', city: 'Spielberg', date: '21 Jun', circuit: 'Red Bull Ring', status: 'upcoming' as const },
  { round: 11, name: 'British GP', country: 'Britain', city: 'Silverstone', date: '5 Jul', circuit: 'Silverstone Circuit', status: 'upcoming' as const },
  { round: 12, name: 'Belgian GP', country: 'Belgium', city: 'Spa', date: '19 Jul', circuit: 'Spa-Francorchamps', status: 'upcoming' as const },
  { round: 13, name: 'Dutch GP', country: 'Netherlands', city: 'Zandvoort', date: '2 Aug', circuit: 'Circuit Zandvoort', status: 'upcoming' as const },
  { round: 14, name: 'Italian GP', country: 'Italy', city: 'Monza', date: '30 Aug', circuit: 'Monza Circuit', status: 'upcoming' as const },
  { round: 15, name: 'Azerbaijan GP', country: 'Azerbaijan', city: 'Baku', date: '13 Sep', circuit: 'Baku City Circuit', status: 'upcoming' as const },
  { round: 16, name: 'Singapore GP', country: 'Singapore', city: 'Singapore', date: '20 Sep', circuit: 'Marina Bay Street', status: 'upcoming' as const },
  { round: 17, name: 'US GP', country: 'United States', city: 'Austin', date: '4 Oct', circuit: 'Circuit of the Americas', status: 'upcoming' as const },
  { round: 18, name: 'Mexican GP', country: 'Mexico', city: 'Mexico City', date: '25 Oct', circuit: 'Autodromo Hermanos Rodriguez', status: 'upcoming' as const },
  { round: 19, name: 'Brazilian GP', country: 'Brazil', city: 'Interlagos', date: '8 Nov', circuit: 'Interlagos', status: 'upcoming' as const },
  { round: 20, name: 'Las Vegas GP', country: 'Las Vegas', city: 'Las Vegas', date: '22 Nov', circuit: 'Las Vegas Street Circuit', status: 'upcoming' as const },
  { round: 21, name: 'Qatar GP', country: 'Qatar', city: 'Lusail', date: '29 Nov', circuit: 'Lusail International', status: 'upcoming' as const },
  { round: 22, name: 'Abu Dhabi GP', country: 'Abu Dhabi', city: 'Yas Marina', date: '6 Dec', circuit: 'Yas Marina Circuit', status: 'upcoming' as const },
];

// Quick stats
const quickStats = [
  { label: 'Races Completed', value: '3/22', icon: Flag, color: '#43B02A' },
  { label: 'Leading Driver', value: 'Antonelli', icon: Target, color: '#FFD700' },
  { label: 'Leading Team', value: 'Mercedes', icon: Trophy, color: '#27F4D2' },
  { label: 'Points Leaders', value: '123 pts', icon: TrendingUp, color: '#E8002D' },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'standings' | 'calendar'>('standings');

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
              <div className="flex items-end justify-center gap-4">
                {[
                  { idx: 1, driver: driverStandings2026[1] }, // P2
                  { idx: 0, driver: driverStandings2026[0] }, // P1
                  { idx: 2, driver: driverStandings2026[2] }, // P3
                ].map(({ idx, driver }) => {
                  const heights = ['h-40', 'h-48', 'h-36'];
                  const orders = ['order-2', 'order-1', 'order-3'];
                  const colors = ['#C0C0C0', '#FFD700', '#CD7F32'];
                  
                  return (
                    <div key={driver.position} className={`flex-1 max-w-[140px] ${heights[idx]}`}>
                      {/* Driver Image */}
                      <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 mb-2"
                           style={{ borderColor: colors[idx] }}>
                        <img 
                          src={`https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Kimi_Antonelli_at_the_2025_US_Grand_Prix_in_Austin%2C_TX_%28cropped%29.jpg/330px-Kimi_Antonelli_at_the_2025_US_Grand_Prix_in_Austin%2C_TX_%28cropped%29.jpg`}
                          alt={driver.fullName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
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
            </div>

            {/* Constructor Standings */}
            <ConstructorStandingsVisual teams={constructorStandings2026} />
          </div>
        ) : (
          <RaceCalendarVisual races={races2026} />
        )}
      </div>
    </div>
  );
}
