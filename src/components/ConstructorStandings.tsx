'use client';

import { Trophy } from 'lucide-react';

interface ConstructorStanding {
  position: number;
  name: string;
  drivers: string;
  points: number;
}

const constructorStandings2026: ConstructorStanding[] = [
  { position: 1, name: 'Mercedes', drivers: 'Antonelli, Russell', points: 123 },
  { position: 2, name: 'Ferrari', drivers: 'Leclerc, Hamilton', points: 77 },
  { position: 3, name: 'McLaren', drivers: 'Norris, Piastri', points: 38 },
  { position: 4, name: 'Haas F1 Team', drivers: 'Bearman, Ocon', points: 17 },
  { position: 5, name: 'Alpine', drivers: 'Gasly, Colapinto', points: 16 },
  { position: 6, name: 'Red Bull Racing', drivers: 'Verstappen, Hadjar', points: 16 },
  { position: 7, name: 'Racing Bulls', drivers: 'Lawson, Lindblad', points: 12 },
  { position: 8, name: 'Audi', drivers: 'Bortoleto, Hulkenberg', points: 2 },
  { position: 9, name: 'Williams', drivers: 'Sainz, Albon', points: 2 },
  { position: 10, name: 'Aston Martin', drivers: 'Alonso, Stroll', points: 0 },
  { position: 11, name: 'Cadillac', drivers: 'Perez, Bottas', points: 0 },
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

export default function ConstructorStandings() {
  return (
    <div className="bg-[#171717] rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold text-white">Clasificación Constructores</h2>
      </div>
      
      <div className="space-y-1">
        {constructorStandings2026.map((team) => (
          <div
            key={team.position}
            className="flex items-center justify-between py-3 px-3 rounded-lg bg-[#1f1f1f] hover:bg-[#2a2a2a] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className={`w-8 text-center font-bold ${
                team.position === 1 ? 'text-yellow-500' :
                team.position <= 3 ? 'text-gray-300' :
                'text-gray-400'
              }`}>
                {team.position}
              </span>
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: teamColors[team.name] || '#666' }} />
              <div>
                <p className="text-white text-sm font-medium">{team.name}</p>
                <p className="text-gray-500 text-xs">{team.drivers}</p>
              </div>
            </div>
            <span className="text-white font-bold">{team.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
