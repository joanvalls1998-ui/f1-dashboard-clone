'use client';

import { Trophy, XCircle } from 'lucide-react';
import Image from 'next/image';

interface DriverResult {
  position: number;
  abbreviation: string;
  fullName: string;
  team: string;
  points: number;
  status: string;
}

const japanGP2026Results: DriverResult[] = [
  { position: 1, abbreviation: 'ANT', fullName: 'Kimi Antonelli', team: 'Mercedes', points: 25, status: 'Finished' },
  { position: 2, abbreviation: 'PIA', fullName: 'Oscar Piastri', team: 'McLaren', points: 18, status: 'Finished' },
  { position: 3, abbreviation: 'LEC', fullName: 'Charles Leclerc', team: 'Ferrari', points: 15, status: 'Finished' },
  { position: 4, abbreviation: 'RUS', fullName: 'George Russell', team: 'Mercedes', points: 12, status: 'Finished' },
  { position: 5, abbreviation: 'NOR', fullName: 'Lando Norris', team: 'McLaren', points: 10, status: 'Finished' },
  { position: 6, abbreviation: 'HAM', fullName: 'Lewis Hamilton', team: 'Ferrari', points: 8, status: 'Finished' },
  { position: 7, abbreviation: 'GAS', fullName: 'Pierre Gasly', team: 'Alpine', points: 6, status: 'Finished' },
  { position: 8, abbreviation: 'VER', fullName: 'Max Verstappen', team: 'Red Bull Racing', points: 4, status: 'Finished' },
  { position: 9, abbreviation: 'LAW', fullName: 'Liam Lawson', team: 'Racing Bulls', points: 2, status: 'Finished' },
  { position: 10, abbreviation: 'OCO', fullName: 'Esteban Ocon', team: 'Haas F1 Team', points: 1, status: 'Finished' },
];

export default function LastRace() {
  const winner = japanGP2026Results[0];

  return (
    <div className="bg-[#171717] rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold text-white">Última Carrera</h2>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-400 text-sm">Japanese Grand Prix 2026</p>
        <div className="flex items-center gap-3 mt-1">
          <div className="text-3xl font-bold text-white">P1</div>
          <div>
            <p className="text-white font-medium">{winner.fullName}</p>
            <p className="text-gray-400 text-sm">{winner.team}</p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {japanGP2026Results.slice(0, 10).map((driver) => (
          <div
            key={driver.abbreviation}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#1f1f1f] hover:bg-[#2a2a2a] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className={`w-8 text-center font-bold ${
                driver.position === 1 ? 'text-yellow-500' :
                driver.position === 2 ? 'text-gray-300' :
                driver.position === 3 ? 'text-amber-600' :
                'text-gray-400'
              }`}>
                {driver.position}
              </span>
              <div>
                <p className="text-white text-sm font-medium">{driver.fullName}</p>
                <p className="text-gray-500 text-xs">{driver.team}</p>
              </div>
            </div>
            <span className={`text-sm ${
              driver.status === 'Finished' ? 'text-green-400' : 'text-red-400'
            }`}>
              {driver.points} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
