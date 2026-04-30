'use client';

import { Trophy } from 'lucide-react';

interface DriverStanding {
  position: number;
  abbreviation: string;
  fullName: string;
  team: string;
  points: number;
}

const driverStandings2026: DriverStanding[] = [
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

const teamColors: Record<string, string> = {
  'Mercedes': '#27F4D2',
  'Ferrari': '#E8002D',
  'McLaren': '#FF8000',
  'Red Bull Racing': '#3671C6',
  'Racing Bulls': '#3671C6',
  'Haas F1 Team': '#F0F0F0',
  'Alpine': '#FF87BC',
  'Audi': '#CC0000',
  'Williams': '#64C4FF',
  'Aston Martin': '#229971',
  'Cadillac': '#C20000',
};

export default function DriverStandings() {
  return (
    <div className="bg-[#171717] rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold text-white">Clasificación Pilotos</h2>
      </div>
      
      <div className="space-y-1">
        {driverStandings2026.map((driver) => (
          <div
            key={driver.position}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#1f1f1f] hover:bg-[#2a2a2a] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className={`w-8 text-center font-bold ${
                driver.position === 1 ? 'text-yellow-500' :
                driver.position <= 3 ? 'text-gray-300' :
                'text-gray-400'
              }`}>
                {driver.position}
              </span>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: teamColors[driver.team] || '#666' }} />
              <div>
                <p className="text-white text-sm font-medium">{driver.fullName}</p>
                <p className="text-gray-500 text-xs">{driver.team}</p>
              </div>
            </div>
            <span className="text-white font-bold">{driver.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
