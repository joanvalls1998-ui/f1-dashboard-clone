'use client';

import { useEffect, useState } from 'react';
import { DriverStandingsVisual } from './DriverCard';
import { driverImages, teamColors } from '@/lib/f1-assets';

interface DriverStanding {
  position: number;
  abbreviation: string;
  fullName: string;
  team: string;
  points: number;
}

// Real 2026 data from FastF1 + Jolpica
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

export default function DriverStandings() {
  const [drivers, setDrivers] = useState<DriverStanding[]>(driverStandings2026);

  return (
    <div className="space-y-4">
      {/* Leader highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {drivers.slice(0, 3).map((driver) => {
          const color = teamColors[driver.team] || '#666';
          const image = driverImages[driver.abbreviation];
          return (
            <div key={driver.position} className="relative">
              <div 
                className="bg-[#1a1a1a] rounded-xl overflow-hidden"
                style={{ 
                  borderTop: `4px solid ${driver.position === 1 ? '#FFD700' : driver.position === 2 ? '#C0C0C0' : '#CD7F32'}`
                }}
              >
                {/* Image banner */}
                <div className="h-24 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] relative overflow-hidden">
                  {image && (
                    <img 
                      src={image} 
                      alt={driver.fullName}
                      className="w-full h-full object-cover opacity-60"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
                  {/* Position badge */}
                  <div className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-xl font-black"
                       style={{ 
                         backgroundColor: driver.position === 1 ? '#FFD700' : driver.position === 2 ? '#C0C0C0' : '#CD7F32',
                         color: driver.position === 2 ? '#333' : '#fff'
                       }}>
                    {driver.position}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{driver.team}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg">{driver.fullName}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-3xl font-black" style={{ color }}>
                      {driver.points}
                    </span>
                    <span className="text-xs text-gray-500 uppercase">pts</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full standings list */}
      <DriverStandingsVisual drivers={drivers} />
    </div>
  );
}
