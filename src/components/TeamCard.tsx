'use client';

import { teamColors, teamLogos } from '@/lib/f1-assets';
import { Users, Trophy } from 'lucide-react';

interface Driver {
  fullName: string;
  abbreviation?: string;
}

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
      <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] transition-colors border border-[var(--bg-overlay)]">
        <span
          className="w-6 text-center font-bold text-sm font-mono"
          style={{
            color: team.position === 1 ? '#eab308' : team.position <= 3 ? '#d4d4d8' : 'var(--text-secondary)',
          }}
        >
          {team.position}
        </span>
        <div className="team-dot" style={{ backgroundColor: color }} />
        <div className="flex-1 min-w-0">
          <p className="text-[var(--text-primary)] text-sm font-semibold truncate">{team.name}</p>
          <p className="text-[var(--text-muted)] text-xs">{team.drivers.join(' • ')}</p>
        </div>
        <span className="stat-number text-sm">{team.points}</span>
      </div>
    );
  }

  return (
    <div
      className="card card-interactive overflow-hidden"
    >
      {/* Top colored bar */}
      <div
        className="h-1 w-full -mx-5 -mt-5 mb-4 rounded-t-xl"
        style={{
          background: `linear-gradient(90deg, ${color} 0%, ${color}cc 50%, ${color}44 100%)`,
        }}
      />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Team logo */}
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: color + '1a' }}
          >
            {logo ? (
              <img src={logo} alt={team.name} className="w-8 h-8 object-contain" />
            ) : (
              <span
                className="text-2xl font-black"
                style={{ color, fontFamily: 'var(--font-heading)' }}
              >
                {team.name.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3
              className="text-[var(--text-primary)] font-bold text-lg"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {team.name}
            </h3>
            <p className="text-[var(--text-muted)] text-sm">{team.drivers.join(' & ')}</p>
          </div>
        </div>
        <div className="text-right">
          <div
            className="text-2xl font-bold"
            style={{
              fontFamily: 'var(--font-mono)',
              color: team.position === 1 ? '#eab308' : team.position <= 3 ? '#d4d4d8' : 'var(--text-primary)',
            }}
          >
            P{team.position}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[var(--bg-elevated)] rounded-lg p-3 text-center">
          <div className="stat-number">{team.points}</div>
          <div className="stat-label">Pts</div>
        </div>
        <div className="bg-[var(--bg-elevated)] rounded-lg p-3 text-center">
          <div className="stat-number" style={{ color: '#eab308' }}>{team.wins}</div>
          <div className="stat-label">Wins</div>
        </div>
        <div className="bg-[var(--bg-elevated)] rounded-lg p-3 text-center">
          <div className="team-dot mx-auto mb-1" style={{ backgroundColor: color, width: 16, height: 16 }} />
          <div className="stat-label">Team</div>
        </div>
      </div>

      {/* Drivers */}
      <div className="flex items-center justify-center gap-4 pt-4 border-t border-[var(--bg-overlay)]">
        {team.drivers.map((driver, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: color + '33', color }}
            >
              {driver.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <span className="text-[var(--text-secondary)] text-sm">{driver.split(' ').pop()}</span>
          </div>
        ))}
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
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-[var(--accent-red)] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </span>
          <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-[var(--text-muted)]">
            <span className="stat-number text-sm" style={{ color: 'var(--text-primary)' }}>{totalPoints}</span>
            {' '}pts
          </span>
          <span className="text-[var(--text-muted)]">
            <span className="stat-number text-sm" style={{ color: '#eab308' }}>{totalWins}</span>
            {' '}wins
          </span>
        </div>
      </div>

      {/* Visual bars */}
      {teams.length > 0 && (
        <div className="mb-6">
          <div className="flex h-8 rounded-full overflow-hidden">
            {teams.slice(0, 6).map((team) => {
              const width = (team.points / teams[0].points) * 100;
              const teamColor = team.color || teamColors[team.name] || '#666';
              return (
                <div
                  key={team.position}
                  className="h-full flex items-center justify-center text-xs font-bold text-white transition-all hover:brightness-110 first:rounded-l-full last:rounded-r-full"
                  style={{
                    width: `${width}%`,
                    backgroundColor: teamColor,
                    minWidth: team.position <= 3 ? '3rem' : '1.5rem',
                  }}
                  title={`${team.name}: ${team.points} pts`}
                >
                  {team.position <= 3 && width > 8 && `${team.points}`}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            {teams.slice(0, 6).map((team) => (
              <span key={team.position} style={{ color: teamColors[team.name] || '#666' }}>
                {team.name.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Teams grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team, i) => (
          <div key={team.position} className="animate-enter" style={{ animationDelay: `${i * 50}ms` }}>
            <TeamCard team={team} variant="detailed" />
          </div>
        ))}
      </div>
    </div>
  );
}
