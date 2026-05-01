'use client';

import { driverImages, teamColors, teamCarImages, getDriverInitials } from '@/lib/f1-assets';
import Image from 'next/image';
import { Users, Car, Trophy } from 'lucide-react';

interface Driver {
  position: number;
  abbreviation: string;
  fullName: string;
  team: string;
  points: number;
}

interface Team {
  name: string;
  color: string;
  drivers: Driver[];
}

// All 20 drivers 2026
const allDrivers2026: Driver[] = [
  // Mercedes
  { position: 1, abbreviation: 'ANT', fullName: 'Kimi Antonelli', team: 'Mercedes', points: 68 },
  { position: 2, abbreviation: 'RUS', fullName: 'George Russell', team: 'Mercedes', points: 55 },
  // Ferrari
  { position: 3, abbreviation: 'LEC', fullName: 'Charles Leclerc', team: 'Ferrari', points: 42 },
  { position: 4, abbreviation: 'HAM', fullName: 'Lewis Hamilton', team: 'Ferrari', points: 35 },
  // McLaren
  { position: 5, abbreviation: 'NOR', fullName: 'Lando Norris', team: 'McLaren', points: 20 },
  { position: 6, abbreviation: 'PIA', fullName: 'Oscar Piastri', team: 'McLaren', points: 18 },
  // Haas
  { position: 7, abbreviation: 'BEA', fullName: 'Oliver Bearman', team: 'Haas F1 Team', points: 16 },
  { position: 15, abbreviation: 'OCO', fullName: 'Esteban Ocon', team: 'Haas F1 Team', points: 1 },
  // Alpine
  { position: 8, abbreviation: 'GAS', fullName: 'Pierre Gasly', team: 'Alpine', points: 15 },
  { position: 16, abbreviation: 'COL', fullName: 'Franco Colapinto', team: 'Alpine', points: 1 },
  // Red Bull Racing
  { position: 9, abbreviation: 'VER', fullName: 'Max Verstappen', team: 'Red Bull Racing', points: 12 },
  { position: 12, abbreviation: 'HAD', fullName: 'Isack Hadjar', team: 'Red Bull Racing', points: 4 },
  // Racing Bulls
  { position: 10, abbreviation: 'LAW', fullName: 'Liam Lawson', team: 'Racing Bulls', points: 8 },
  { position: 11, abbreviation: 'LIN', fullName: 'Arvid Lindblad', team: 'Racing Bulls', points: 4 },
  // Audi
  { position: 13, abbreviation: 'BOR', fullName: 'Gabriel Bortoleto', team: 'Audi', points: 2 },
  // Williams
  { position: 14, abbreviation: 'SAI', fullName: 'Carlos Sainz', team: 'Williams', points: 2 },
  { position: 17, abbreviation: 'ALB', fullName: 'Alexander Albon', team: 'Williams', points: 0 },
  // Aston Martin
  { position: 19, abbreviation: 'STR', fullName: 'Lance Stroll', team: 'Aston Martin', points: 0 },
  { position: 20, abbreviation: 'ALO', fullName: 'Fernando Alonso', team: 'Aston Martin', points: 0 },
  // Cadillac
  { position: 18, abbreviation: 'PER', fullName: 'Sergio Perez', team: 'Cadillac', points: 0 },
  // AlphaTauri (Yuki)
  { position: 0, abbreviation: 'TSU', fullName: 'Yuki Tsunoda', team: 'RB', points: 0 },
];

// Group by team
const teams2026: Team[] = [
  { name: 'Mercedes', color: '#27F4D2', drivers: allDrivers2026.filter(d => d.team === 'Mercedes') },
  { name: 'Ferrari', color: '#E8002D', drivers: allDrivers2026.filter(d => d.team === 'Ferrari') },
  { name: 'McLaren', color: '#FF8000', drivers: allDrivers2026.filter(d => d.team === 'McLaren') },
  { name: 'Red Bull Racing', color: '#3671C6', drivers: allDrivers2026.filter(d => d.team === 'Red Bull Racing') },
  { name: 'Racing Bulls', color: '#6B3FC6', drivers: allDrivers2026.filter(d => d.team === 'Racing Bulls') },
  { name: 'Haas F1 Team', color: '#F0F0F0', drivers: allDrivers2026.filter(d => d.team === 'Haas F1 Team') },
  { name: 'Alpine', color: '#FF87BC', drivers: allDrivers2026.filter(d => d.team === 'Alpine') },
  { name: 'Audi', color: '#CC0000', drivers: allDrivers2026.filter(d => d.team === 'Audi') },
  { name: 'Williams', color: '#64C4FF', drivers: allDrivers2026.filter(d => d.team === 'Williams') },
  { name: 'Aston Martin', color: '#229971', drivers: allDrivers2026.filter(d => d.team === 'Aston Martin') },
  { name: 'Cadillac', color: '#C20000', drivers: allDrivers2026.filter(d => d.team === 'Cadillac') },
  { name: 'RB', color: '#6B3FC6', drivers: allDrivers2026.filter(d => d.team === 'RB') },
];

interface DriverAvatarProps {
  driver: Driver;
  size?: 'sm' | 'md' | 'lg';
  showPoints?: boolean;
}

export function DriverAvatar({ driver, size = 'md', showPoints = false }: DriverAvatarProps) {
  const image = driverImages[driver.abbreviation];
  const color = teamColors[driver.team] || '#666';
  
  const sizes = {
    sm: { container: 'w-10 h-10', text: 'text-xs', ring: 'ring-2' },
    md: { container: 'w-16 h-16', text: 'text-sm', ring: 'ring-4' },
    lg: { container: 'w-24 h-24', text: 'text-lg', ring: 'ring-4' },
  };
  
  const s = sizes[size];
  
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`${s.container} rounded-xl overflow-hidden bg-[#333] ${s.ring} ring-offset-2 ring-offset-[#1a1a1a]`}
           style={{ borderColor: color }}>
        {image ? (
          <Image
            src={image}
            alt={driver.fullName}
            width={size === 'sm' ? 40 : size === 'md' ? 64 : 96}
            height={size === 'sm' ? 40 : size === 'md' ? 64 : 96}
            className="w-full h-full object-cover"
            unoptimized
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center font-bold text-white"
            style={{ backgroundColor: color + '33', color }}
          >
            {getDriverInitials(driver.fullName)}
          </div>
        )}
      </div>
      <span className={`${s.text} text-white font-medium text-center`}>
        {driver.fullName.split(' ').pop()}
      </span>
      {showPoints && (
        <span className="text-xs text-gray-500">{driver.points} pts</span>
      )}
    </div>
  );
}

interface TeamCardFullProps {
  team: Team;
}

export function TeamCardFull({ team }: TeamCardFullProps) {
  const carImage = teamCarImages[team.name];
  
  return (
    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden">
      {/* Header with team color */}
      <div className="h-2 w-full" style={{ backgroundColor: team.color }} />
      
      {/* Car image */}
      <div className="relative h-32 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] overflow-hidden">
        {carImage && (
          <Image
            src={carImage}
            alt={`${team.name} F1 car`}
            fill
            className="object-cover opacity-60"
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
        
        {/* Team badge */}
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg backdrop-blur-md"
             style={{ backgroundColor: team.color + '44' }}>
          <span className="text-white font-bold text-sm">{team.name}</span>
        </div>
      </div>
      
      {/* Drivers */}
      <div className="p-4">
        <div className="flex items-center justify-center gap-6">
          {team.drivers.map((driver) => (
            <DriverAvatar key={driver.abbreviation} driver={driver} size="md" showPoints />
          ))}
        </div>
      </div>
    </div>
  );
}

interface TeamGalleryProps {
  title?: string;
}

export function TeamGallery({ title = "Teams & Drivers 2026" }: TeamGalleryProps) {
  return (
    <div className="bg-[#171717] rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-[#E10600]" />
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      
      {/* Teams grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams2026.map((team) => (
          <TeamCardFull key={team.name} team={team} />
        ))}
      </div>
    </div>
  );
}

interface AllDriversGridProps {
  title?: string;
}

export function AllDriversGrid({ title = "All Drivers 2026" }: AllDriversGridProps) {
  return (
    <div className="bg-[#171717] rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-4">
        {allDrivers2026
          .sort((a, b) => a.position - b.position)
          .map((driver) => (
            <DriverAvatar key={driver.abbreviation} driver={driver} size="lg" showPoints />
          ))}
      </div>
    </div>
  );
}
