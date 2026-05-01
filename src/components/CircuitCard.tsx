'use client';

import { circuitImages, teamColors } from '@/lib/f1-assets';
import Image from 'next/image';
import { MapPin, Calendar, Flag } from 'lucide-react';

interface Race {
  round: number;
  name: string;
  country: string;
  city: string;
  date: string;
  circuit: string;
  winner?: string;
  winnerTeam?: string;
  status?: 'completed' | 'upcoming' | 'cancelled';
}

interface CircuitCardProps {
  race: Race;
  variant?: 'default' | 'compact' | 'featured';
}

export function CircuitCard({ race, variant = 'default' }: CircuitCardProps) {
  const circuitImage = circuitImages[race.country] || '';
  const winnerColor = race.winnerTeam ? teamColors[race.winnerTeam] : '#666';
  const isCancelled = race.status === 'cancelled';
  const isCompleted = race.status === 'completed';

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-[#1f1f1f] hover:bg-[#2a2a2a] transition-colors">
        <span className="w-6 text-center font-bold text-gray-500">{race.round}</span>
        {circuitImage && (
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#333] shrink-0">
            <Image
              src={circuitImage}
              alt={race.country}
              width={40}
              height={40}
              className="w-full h-full object-cover opacity-70"
              unoptimized
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isCancelled ? 'line-through text-gray-600' : 'text-white'}`}>
            {race.country}
          </p>
          <p className="text-xs text-gray-500">{race.city}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">{race.date}</p>
          {isCancelled && (
            <span className="text-xs text-red-500 font-medium">CANCELLED</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-[#1a1a1a] rounded-xl overflow-hidden group ${
      isCancelled ? 'opacity-60' : 'hover:ring-2 hover:ring-[#E10600] transition-all'
    }`}>
      {/* Circuit Image Background */}
      <div className="relative h-32 overflow-hidden">
        {circuitImage ? (
          <Image
            src={circuitImage}
            alt={race.circuit}
            fill
            className="object-cover opacity-30 group-hover:opacity-50 transition-opacity"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]" />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
        
        {/* Round badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded-md bg-[#E10600] text-white text-xs font-bold">
            R{race.round}
          </span>
        </div>
        
        {/* Status badge */}
        {isCancelled && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-4 py-2 rounded-lg bg-red-600/90 text-white text-sm font-bold uppercase tracking-wider">
              CANCELLED
            </span>
          </div>
        )}
        {isCompleted && race.winner && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm">
            <Flag className="w-3 h-3 text-yellow-500" />
            <span className="text-white text-xs font-medium">{race.winner}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-white font-bold text-lg">{race.country}</h3>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <MapPin className="w-3 h-3" />
              <span>{race.city}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-gray-300">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{race.date}</span>
            </div>
          </div>
        </div>
        
        {/* Circuit name */}
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">{race.circuit}</p>
        
        {/* Winner info */}
        {race.winner && !isCancelled && (
          <div className="flex items-center gap-2 pt-2 border-t border-[#333]">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: winnerColor }} />
            <span className="text-white text-sm">
              <span className="text-yellow-500 font-bold">Winner:</span> {race.winner}
            </span>
            <span className="text-gray-500 text-xs">({race.winnerTeam})</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface RaceCalendarVisualProps {
  races: Race[];
  title?: string;
}

export function RaceCalendarVisual({ races, title = "Calendario 2026" }: RaceCalendarVisualProps) {
  // Filter out cancelled races for counting
  const completedRaces = races.filter(r => r.status === 'completed');
  const upcomingRaces = races.filter(r => r.status === 'upcoming' && !r.name.includes('Cancelled'));
  
  return (
    <div className="bg-[#171717] rounded-xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>📅</span> {title}
        </h2>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-gray-400">{completedRaces.length} completadas</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-gray-400">{upcomingRaces.length} restantes</span>
          </span>
        </div>
      </div>

      {/* Circuit grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {races.map((race) => (
          <CircuitCard key={race.round} race={race} />
        ))}
      </div>
    </div>
  );
}
