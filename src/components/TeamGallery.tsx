'use client';

import { driverImages, teamColors, getDriverInitials } from '@/lib/f1-assets';
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

// All 22 drivers 2026 from Ergast API
const allDrivers2026: Driver[] = [
  // Mercedes (2 drivers)
  { position: 1, abbreviation: 'ANT', fullName: 'Kimi Antonelli', team: 'Mercedes', points: 68 },
  { position: 2, abbreviation: 'RUS', fullName: 'George Russell', team: 'Mercedes', points: 55 },
  // Ferrari (2 drivers)
  { position: 3, abbreviation: 'LEC', fullName: 'Charles Leclerc', team: 'Ferrari', points: 42 },
  { position: 4, abbreviation: 'HAM', fullName: 'Lewis Hamilton', team: 'Ferrari', points: 35 },
  // McLaren (2 drivers)
  { position: 5, abbreviation: 'NOR', fullName: 'Lando Norris', team: 'McLaren', points: 20 },
  { position: 21, abbreviation: 'PIA', fullName: 'Oscar Piastri', team: 'McLaren', points: 18 },
  // Haas (2 drivers)
  { position: 7, abbreviation: 'BEA', fullName: 'Oliver Bearman', team: 'Haas F1 Team', points: 16 },
  { position: 11, abbreviation: 'OCO', fullName: 'Esteban Ocon', team: 'Haas F1 Team', points: 1 },
  // Alpine (2 drivers)
  { position: 8, abbreviation: 'GAS', fullName: 'Pierre Gasly', team: 'Alpine', points: 15 },
  { position: 14, abbreviation: 'COL', fullName: 'Franco Colapinto', team: 'Alpine', points: 1 },
  // Red Bull (2 drivers)
  { position: 6, abbreviation: 'VER', fullName: 'Max Verstappen', team: 'Red Bull', points: 12 },
  { position: 20, abbreviation: 'HAD', fullName: 'Isack Hadjar', team: 'Red Bull', points: 4 },
  // RB F1 Team (2 drivers)
  { position: 10, abbreviation: 'LIN', fullName: 'Arvid Lindblad', team: 'RB F1 Team', points: 4 },
  { position: 13, abbreviation: 'LAW', fullName: 'Liam Lawson', team: 'RB F1 Team', points: 8 },
  // Audi (2 drivers)
  { position: 9, abbreviation: 'BOR', fullName: 'Gabriel Bortoleto', team: 'Audi', points: 2 },
  { position: 22, abbreviation: 'HUL', fullName: 'Nico Hülkenberg', team: 'Audi', points: 0 },
  // Williams (2 drivers)
  { position: 12, abbreviation: 'ALB', fullName: 'Alexander Albon', team: 'Williams', points: 0 },
  { position: 15, abbreviation: 'SAI', fullName: 'Carlos Sainz', team: 'Williams', points: 2 },
  // Aston Martin (2 drivers)
  { position: 17, abbreviation: 'STR', fullName: 'Lance Stroll', team: 'Aston Martin', points: 0 },
  { position: 18, abbreviation: 'ALO', fullName: 'Fernando Alonso', team: 'Aston Martin', points: 0 },
  // Cadillac (2 drivers)
  { position: 16, abbreviation: 'PER', fullName: 'Sergio Perez', team: 'Cadillac', points: 0 },
  { position: 19, abbreviation: 'BOT', fullName: 'Valtteri Bottas', team: 'Cadillac', points: 0 },
];

// Group by team - 2026 colors standardized
const teams2026: Team[] = [
  { name: 'Mercedes', color: '#27f4d2', drivers: allDrivers2026.filter(d => d.team === 'Mercedes') },
  { name: 'Ferrari', color: '#ff1800', drivers: allDrivers2026.filter(d => d.team === 'Ferrari') },
  { name: 'McLaren', color: '#ff8700', drivers: allDrivers2026.filter(d => d.team === 'McLaren') },
  { name: 'Red Bull Racing', color: '#3671c6', drivers: allDrivers2026.filter(d => d.team === 'Red Bull') },
  { name: 'RB F1 Team', color: '#203f94', drivers: allDrivers2026.filter(d => d.team === 'RB F1 Team') },
  { name: 'Haas F1 Team', color: '#b6babd', drivers: allDrivers2026.filter(d => d.team === 'Haas F1 Team') },
  { name: 'Alpine', color: '#ff87bc', drivers: allDrivers2026.filter(d => d.team === 'Alpine') },
  { name: 'Audi', color: '#c80029', drivers: allDrivers2026.filter(d => d.team === 'Audi') },
  { name: 'Williams', color: '#64c4ff', drivers: allDrivers2026.filter(d => d.team === 'Williams') },
  { name: 'Aston Martin', color: '#0072ff', drivers: allDrivers2026.filter(d => d.team === 'Aston Martin') },
  { name: 'Cadillac', color: '#c80029', drivers: allDrivers2026.filter(d => d.team === 'Cadillac') },
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
            className="w-full h-full flex items-center justify-center font-bold"
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
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{driver.points} pts</span>
      )}
    </div>
  );
}

interface TeamCardFullProps {
  team: Team;
}

export function TeamCardFull({ team }: TeamCardFullProps) {
  const carImage = ""; // Will be populated as we find car images
  
  return (
    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden">
      {/* Header with team color */}
      <div className="h-1 w-full" style={{ backgroundColor: team.color }} />
      
      {/* Car image placeholder */}
      <div className="relative h-32 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent z-10" />
        
        {/* Team badge */}
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg backdrop-blur-md z-20"
             style={{ backgroundColor: team.color + '44' }}>
          <span className="text-white font-bold text-sm">{team.name}</span>
        </div>
        
        {/* Drivers count */}
        <div className="absolute bottom-3 right-3 z-20">
          <span className="text-white text-xs font-medium">{team.drivers.length} drivers</span>
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
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5" style={{ color: 'var(--accent-red)' }} />
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{title}</h2>
      </div>

      {/* Teams grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams2026.map((team, i) => (
          <div key={team.name} className="animate-enter" style={{ animationDelay: `${i * 40}ms` }}>
            <TeamCardFull team={team} />
          </div>
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
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5" style={{ color: '#eab308' }} />
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{title}</h2>
        <span className="ml-auto eyebrow">22 drivers</span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-11 gap-4">
        {allDrivers2026
          .sort((a, b) => a.position - b.position)
          .map((driver, i) => (
            <div key={driver.abbreviation} className="animate-enter" style={{ animationDelay: `${i * 30}ms` }}>
              <DriverAvatar driver={driver} size="lg" showPoints />
            </div>
          ))}
      </div>
    </div>
  );
}
