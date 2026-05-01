'use client';

import { driverImages, teamColors, getDriverInitials } from '@/lib/f1-assets';
import Image from 'next/image';

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
      <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-[#1f1f1f] hover:bg-[#2a2a2a] transition-all">
        <span className={`w-6 text-center font-bold text-sm ${
          driver.position === 1 ? 'text-yellow-500' :
          driver.position <= 3 ? 'text-gray-300' : 'text-gray-400'
        }`}>
          {driver.position}
        </span>
        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: teamColor }} />
        {showImage && driverImage && (
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#333] shrink-0">
            <Image
              src={driverImage}
              alt={driver.fullName}
              width={32}
              height={32}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        )}
        {!showImage || !driverImage ? (
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ backgroundColor: teamColor + '33', color: teamColor }}
          >
            {driver.abbreviation}
          </div>
        ) : null}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{driver.fullName}</p>
        </div>
        <span className="text-white font-bold text-sm">{driver.points} pts</span>
      </div>
    );
  }

  return (
    <div className="relative bg-[#1a1a1a] rounded-xl overflow-hidden hover:ring-2 transition-all duration-300 group"
         style={{ '--team-color': teamColor } as React.CSSProperties}>
      {/* Top colored bar */}
      <div className="h-1 w-full" style={{ backgroundColor: teamColor }} />
      
      <div className="p-4">
        {/* Position & Points */}
        <div className="flex items-start justify-between mb-3">
          <div className={`text-3xl font-bold ${
            driver.position === 1 ? 'text-yellow-500' :
            driver.position <= 3 ? 'text-gray-300' : 'text-gray-500'
          }`}>
            P{driver.position}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{driver.points}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">pts</div>
          </div>
        </div>

        {/* Driver Image & Info */}
        <div className="flex items-center gap-4">
          {/* Photo or Placeholder */}
          <div className="relative">
            {showImage && driverImage ? (
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#333] ring-2 ring-offset-2 ring-offset-[#1a1a1a]"
                   style={{ borderColor: teamColor }}>
                <Image
                  src={driverImage}
                  alt={driver.fullName}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div 
                className="w-20 h-20 rounded-xl flex items-center justify-center text-xl font-bold"
                style={{ backgroundColor: teamColor + '33', color: teamColor }}
              >
                {getDriverInitials(driver.fullName)}
              </div>
            )}
            {/* Position badge */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-[#1a1a1a] border-2"
                 style={{ borderColor: teamColor }}>
              {driver.position}
            </div>
          </div>

          {/* Driver Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-lg truncate">{driver.fullName}</h3>
            <p className="text-gray-400 text-sm">{driver.team}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColor }} />
              <span className="text-xs text-gray-500 font-mono">{driver.abbreviation}</span>
            </div>
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
    <div className="bg-[#171717] rounded-xl p-4 sm:p-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-yellow-500">🏆</span> {title}
      </h2>
      
      {/* Top 3 Podium Highlight */}
      <div className="flex items-end justify-center gap-3 mb-6">
        {drivers.slice(0, 3).map((driver, idx) => {
          const heights = ['h-32', 'h-40', 'h-36']; // P2 taller, P1 más alto, P3
          const positions = ['order-2', 'order-1', 'order-3']; // P1 centro
          const teamColor = teamColors[driver.team] || '#666';
          const image = driverImages[driver.abbreviation];
          
          return (
            <div 
              key={driver.position}
              className={`flex-1 max-w-[120px] ${heights[idx]} flex flex-col items-center`}
            >
              {/* Image */}
              <div className="w-16 h-16 rounded-full overflow-hidden bg-[#333] ring-4 mb-2"
                   style={{ borderColor: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : '#CD7F32' }}>
                {image ? (
                  <Image src={image} alt={driver.fullName} width={64} height={64} 
                         className="w-full h-full object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-white bg-[#444]">
                    {driver.abbreviation}
                  </div>
                )}
              </div>
              {/* Name */}
              <p className="text-white text-sm font-medium text-center truncate w-full">
                {driver.fullName.split(' ').pop()}
              </p>
              {/* Points */}
              <p className="text-gray-400 text-xs">{driver.points} pts</p>
              {/* Podium stand */}
              <div className="mt-auto w-full bg-gradient-to-t from-[#2a2a2a] to-[#1a1a1a] rounded-t-lg flex items-center justify-center"
                   style={{ 
                     borderTop: `4px solid ${idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : '#CD7F32'}`
                   }}>
                <span className="text-2xl font-bold pb-1" 
                      style={{ color: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : '#CD7F32' }}>
                  {idx + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest of standings */}
      <div className="space-y-1">
        {drivers.slice(3).map((driver) => (
          <DriverCard key={driver.position} driver={driver} showImage={true} compact={true} />
        ))}
      </div>
    </div>
  );
}
