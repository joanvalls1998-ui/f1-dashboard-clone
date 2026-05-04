'use client';

import { driverImages, teamColors, getDriverInitials } from '@/lib/f1-assets';
import Image from 'next/image';
import { Trophy } from 'lucide-react';

interface Driver {
  position: number;
  abbreviation: string;
  fullName: string;
  team: string;
  points: number;
  number?: string;
}

interface DriverCardProps {
  driver: Driver;
  showImage?: boolean;
  compact?: boolean;
}

export function DriverCard({ driver, showImage = true, compact = false }: DriverCardProps) {
  const teamColor = teamColors[driver.team] || '#666666';
  const driverImage = driverImages[driver.abbreviation];

  if (compact) {
    return (
      <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-[#111118] hover:bg-[#1A1A24] transition-colors border border-[var(--bg-overlay)]">
        <span
          className="w-6 text-center font-bold text-sm"
          style={{ fontFamily: 'var(--font-mono)', color: driver.position === 1 ? '#eab308' : driver.position <= 3 ? '#d4d4d8' : 'var(--text-secondary)' }}
        >
          {driver.position}
        </span>
        <div className="team-dot" style={{ backgroundColor: teamColor }} />
        {showImage && driverImage && (
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1A1A24] shrink-0">
            <Image src={driverImage} alt={driver.fullName} width={32} height={32} className="w-full h-full object-cover" unoptimized />
          </div>
        )}
        {!showImage || !driverImage ? (
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: teamColor + '33', color: teamColor }}>
            {driver.abbreviation}
          </div>
        ) : null}
        <div className="flex-1 min-w-0">
          <p className="text-[var(--text-primary)] text-sm font-medium truncate">{driver.fullName}</p>
        </div>
        <span className="stat-number text-sm">{driver.points} <span style={{ color: 'var(--text-muted)' }}>pts</span></span>
      </div>
    );
  }

  return (
    <div className="card card-interactive overflow-hidden">
      {/* Top colored bar */}
      <div className="h-1 -mx-5 -mt-5 mb-4 rounded-t-xl" style={{ backgroundColor: teamColor }} />

      <div className="flex items-start justify-between mb-3">
        <div
          className="text-3xl font-bold"
          style={{ fontFamily: 'var(--font-mono)', color: driver.position === 1 ? '#eab308' : driver.position <= 3 ? '#d4d4d8' : 'var(--text-secondary)' }}
        >
          P{driver.position}
        </div>
        <div className="text-right">
          <div className="stat-number text-2xl" style={{ color: teamColor }}>{driver.points}</div>
          <div className="stat-label">pts</div>
        </div>
      </div>

      {/* Driver Image & Info */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {showImage && driverImage ? (
            <div className="w-16 h-16 rounded-xl overflow-hidden" style={{ border: '2px solid ' + teamColor }}>
              <Image src={driverImage} alt={driver.fullName} width={64} height={64} className="w-full h-full object-cover" unoptimized />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-sm font-bold" style={{ backgroundColor: teamColor + '33', color: teamColor, fontFamily: 'var(--font-mono)' }}>
              {getDriverInitials(driver.fullName)}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: teamColor, fontFamily: 'var(--font-mono)' }}>
            {driver.position}
          </div>
        </div>

        {/* Driver Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[var(--text-primary)] font-bold text-base truncate" style={{ fontFamily: 'var(--font-heading)' }}>{driver.fullName}</h3>
          <p className="text-[var(--text-secondary)] text-sm">{driver.team}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="team-dot" style={{ backgroundColor: teamColor }} />
            <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{driver.abbreviation}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DriverStandingsVisualProps {
  drivers: Driver[];
  title?: string;
}

export function DriverStandingsVisual({ drivers, title = "Driver Standings" }: DriverStandingsVisualProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5" style={{ color: '#eab308' }} />
        <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{title}</h2>
      </div>

      {/* Compact list */}
      <div className="space-y-1">
        {drivers.map((driver, i) => (
          <div key={driver.position} className="animate-enter" style={{ animationDelay: `${i * 25}ms` }}>
            <DriverCard driver={driver} showImage={true} compact={true} />
          </div>
        ))}
      </div>
    </div>
  );
}
