'use client';

import { useEffect, useState } from 'react';
import { DriverStandingsVisual } from './DriverCard';
import { driverImages, getTeamColor } from '@/lib/f1-assets';
import { fetchDriverStandings } from '@/lib/api';
import { Loader2, Trophy } from 'lucide-react';

interface DriverStanding {
  position: number;
  abbreviation: string;
  fullName: string;
  team: string;
  points: number;
  driverId: string;
  number: string;
  nationality: string;
}

export default function DriverStandings() {
  const [drivers, setDrivers] = useState<DriverStanding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchDriverStandings(2026);
        setDrivers(data);
      } catch (error) {
        console.error("Error loading driver standings:", error);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-red)' }} />
      </div>
    );
  }

  if (drivers.length === 0) {
    return (
      <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
        No driver standings data available
      </div>
    );
  }

  const podiumColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

  return (
    <div className="space-y-6">
      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 0, 2].map((idx) => {
          const driver = drivers[idx];
          if (!driver) return null;
          const color = getTeamColor(driver.team);
          const image = driverImages[driver.abbreviation as keyof typeof driverImages] || '';
          const posColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
          const posColor = posColors[idx];

          return (
            <div
              key={driver.position}
              className="card card-interactive overflow-hidden animate-enter"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Colored top bar */}
              <div className="h-1 -mx-5 -mt-5 mb-4 rounded-t-xl" style={{ backgroundColor: posColor }} />

              {/* Image */}
              <div className="relative h-24 overflow-hidden mb-3 rounded-lg">
                {image ? (
                  <img src={image} alt={driver.fullName} className="w-full h-full object-cover opacity-70" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', color: 'var(--text-muted)' }}>
                      {driver.abbreviation}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] to-transparent" />
                {/* Position badge */}
                <div
                  className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center font-black text-lg"
                  style={{ backgroundColor: posColor, color: idx === 1 ? '#333' : '#fff', fontFamily: 'var(--font-mono)' }}
                >
                  {driver.position}
                </div>
              </div>

              {/* Info */}
              <div className="flex items-center gap-2 mb-2">
                <div className="team-dot" style={{ backgroundColor: color }} />
                <span className="eyebrow">{driver.team}</span>
              </div>
              <h3 className="font-bold text-base mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                {driver.fullName}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="stat-number text-3xl" style={{ color }}>{driver.points}</span>
                <span className="stat-label">pts</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full table */}
      <DriverStandingsVisual drivers={drivers} />
    </div>
  );
}
