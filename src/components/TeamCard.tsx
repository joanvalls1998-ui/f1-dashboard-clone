'use client';

import { teamColors, teamLogos, countryFlags } from '@/lib/f1-assets';
import Image from 'next/image';
import { Users, Trophy, TrendingUp } from 'lucide-react';

interface Team {
  position: number;
  name: string;
  points: number;
  wins: number;
  drivers: string[];
  color?: string;
}

interface TeamCardProps {
  team: Team;
  variant?: 'default' | 'compact' | 'detailed';
}

export function TeamCard({ team, variant = 'default' }: TeamCardProps) {
  const color = team.color || teamColors[team.name] || '#666';
  const logo = teamLogos[team.name];

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-[#1f1f1f] hover:bg-[#2a2a2a] transition-colors">
        <span className={`w-6 text-center font-bold text-sm ${
          team.position === 1 ? 'text-yellow-500' :
          team.position <= 3 ? 'text-gray-300' : 'text-gray-400'
        }`}>
          {team.position}
        </span>
        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{team.name}</p>
          <p className="text-xs text-gray-500">{team.drivers.join(' • ')}</p>
        </div>
        <span className="text-white font-bold text-sm">{team.points} pts</span>
      </div>
    );
  }

  return (
    <div className="relative bg-[#1a1a1a] rounded-xl overflow-hidden group hover:ring-2 transition-all"
         style={{ '--team-color': color } as React.CSSProperties}>
      {/* Top colored bar with gradient */}
      <div className="h-1 w-full" style={{ 
        background: `linear-gradient(90deg, ${color} 0%, ${color}cc 50%, ${color}44 100%)`
      }} />
      
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Team logo placeholder */}
            <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                 style={{ backgroundColor: color + '22' }}>
              <span className="text-2xl font-black" style={{ color }}>{team.name.substring(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{team.name}</h3>
              <p className="text-gray-500 text-sm">{team.drivers.join(' & ')}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${
              team.position === 1 ? 'text-yellow-500' :
              team.position <= 3 ? 'text-gray-300' : 'text-white'
            }`}>
              P{team.position}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#252525] rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{team.points}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Puntos</div>
          </div>
          <div className="bg-[#252525] rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-yellow-500">{team.wins}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Victorias</div>
          </div>
          <div className="bg-[#252525] rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-blue-400">{color}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Color</div>
          </div>
        </div>

        {/* Drivers mini avatars */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-[#333]">
          {team.drivers.map((driver, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                   style={{ backgroundColor: color + '44', color }}>
                {driver.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-gray-300 text-sm">{driver.split(' ').pop()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ConstructorStandingsVisualProps {
  teams: Team[];
  title?: string;
}

export function ConstructorStandingsVisual({ teams, title = "Constructor Standings" }: ConstructorStandingsVisualProps) {
  const totalPoints = teams.reduce((sum, t) => sum + t.points, 0);
  const totalWins = teams.reduce((sum, t) => sum + t.wins, 0);

  return (
    <div className="bg-[#171717] rounded-xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🏭</span> {title}
        </h2>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-gray-400">
            <span className="font-bold text-white">{totalPoints}</span> pts totales
          </span>
          <span className="text-gray-400">
            <span className="font-bold text-yellow-500">{totalWins}</span> victorias
          </span>
        </div>
      </div>

      {/* Visual bars showing points distribution */}
      <div className="mb-6">
        <div className="flex h-8 rounded-full overflow-hidden">
          {teams.slice(0, 6).map((team) => {
            const width = (team.points / teams[0].points) * 100;
            return (
              <div
                key={team.position}
                className="h-full flex items-center justify-center text-xs font-bold text-white transition-all hover:brightness-110"
                style={{ 
                  width: `${width}%`,
                  backgroundColor: team.color || teamColors[team.name] || '#666',
                  minWidth: team.position <= 3 ? '3rem' : '1rem'
                }}
                title={`${team.name}: ${team.points} pts`}
              >
                {team.position <= 3 && width > 8 && `${team.points}`}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {teams.slice(0, 6).map((team) => (
            <span key={team.position} style={{ color: teamColors[team.name] || '#666' }}>
              {team.name.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>

      {/* Teams grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team) => (
          <TeamCard key={team.position} team={team} variant="detailed" />
        ))}
      </div>
    </div>
  );
}
