'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Activity, Gauge, Timer, Flag, Award } from 'lucide-react';

// Simple bar chart component
interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  maxValue?: number;
  title?: string;
  unit?: string;
}

export function BarChart({ data, maxValue, title, unit = '' }: BarChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value));
  
  return (
    <div className="var(--bg-elevated) rounded-xl p-4">
      {title && <h3 className="var(--text-primary) font-semibold mb-3 flex items-center gap-2">{title}</h3>}
      <div className="space-y-2">
        {data.map((item, idx) => {
          const percentage = (item.value / max) * 100;
          return (
            <div key={idx} className="flex items-center gap-3">
              <span className="w-24 text-xs var(--text-muted) truncate">{item.label}</span>
              <div className="flex-1 h-6 var(--bg-overlay) rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full flex items-center justify-end px-2 transition-all duration-500"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: item.color || '#E10600'
                  }}
                >
                  {percentage > 15 && (
                    <span className="text-xs font-bold var(--text-primary)">{item.value}{unit}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Progress rings for statistics
interface ProgressRingProps {
  value: number;
  max: number;
  label: string;
  color?: string;
  size?: number;
}

export function ProgressRing({ value, max, label, color = '#E10600', size = 80 }: ProgressRingProps) {
  const percentage = (value / max) * 100;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            className="text-[#2a2a2a]"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="transition-all duration-1000 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke={color}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold var(--text-primary)">{value}</span>
        </div>
      </div>
      <span className="text-xs var(--text-muted) mt-1 text-center">{label}</span>
    </div>
  );
}

// Stats card with icon
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
  color?: string;
}

export function StatCard({ icon, label, value, sublabel, color = '#E10600' }: StatCardProps) {
  return (
    <div className="var(--bg-elevated) rounded-xl p-4 flex items-center gap-4">
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: color + '22' }}
      >
        <div style={{ color }}>{icon}</div>
      </div>
      <div>
        <p className="text-2xl font-bold var(--text-primary)">{value}</p>
        <p className="text-sm var(--text-muted)">{label}</p>
        {sublabel && <p className="text-xs var(--text-muted)">{sublabel}</p>}
      </div>
    </div>
  );
}

// Animated counter
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
}

export function AnimatedCounter({ value, duration = 1000, suffix = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);
  
  return <span>{count}{suffix}</span>;
}

// Gap chart (for intervals)
interface GapChartProps {
  gaps: { driver: string; gap: string; interval?: boolean }[];
}

export function GapChart({ gaps }: GapChartProps) {
  return (
    <div className="var(--bg-elevated) rounded-xl p-4">
      <h3 className="var(--text-primary) font-semibold mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-red-500" />
        Intervalos
      </h3>
      <div className="space-y-1">
        {gaps.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-lg hover:var(--bg-overlay) transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-6 text-center font-mono var(--text-muted)">{idx + 1}</span>
              <span className="var(--text-primary) font-medium">{item.driver}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.interval && (
                <span className="text-xs var(--text-muted) var(--bg-overlay) px-2 py-0.5 rounded">INTERVAL</span>
              )}
              <span className={`font-mono font-bold ${
                item.gap === 'Leader' ? 'text-yellow-500' :
                item.gap.startsWith('+') ? 'text-green-400' : 'var(--text-secondary)'
              }`}>
                {item.gap}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tyre strategy visualization
interface TyreStint {
  driver: string;
  stints: { tyre: string; laps: number }[];
  totalLaps: number;
}

interface TyreStrategyChartProps {
  stints: TyreStint[];
}

const tyreColors: Record<string, string> = {
  SOFT: '#FF3333',
  MEDIUM: '#FFD700',
  HARD: '#FFFFFF',
  INTERMEDIATE: '#43B02A',
  WET: '#0067AD',
};

export function TyreStrategyChart({ stints }: TyreStrategyChartProps) {
  return (
    <div className="var(--bg-elevated) rounded-xl p-4">
      <h3 className="var(--text-primary) font-semibold mb-3 flex items-center gap-2">
        <Gauge className="w-4 h-4 text-blue-400" />
        Estrategia de Neumáticos
      </h3>
      <div className="space-y-3">
        {stints.map((stint, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="w-20 text-xs var(--text-muted) truncate">{stint.driver}</span>
            <div className="flex-1 flex gap-1">
              {stint.stints.map((s, sIdx) => (
                <div
                  key={sIdx}
                  className="h-8 rounded flex items-center justify-center text-xs font-bold"
                  style={{ 
                    width: `${(s.laps / stint.totalLaps) * 100}%`,
                    backgroundColor: tyreColors[s.tyre] || '#666',
                    color: s.tyre === 'HARD' || s.tyre === 'INTERMEDIATE' ? '#000' : '#fff'
                  }}
                  title={`${s.tyre}: ${s.laps} vueltas`}
                >
                  {s.laps}L
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t var(--border-color)">
        {Object.entries(tyreColors).map(([tyre, color]) => (
          <div key={tyre} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
            <span className="text-xs var(--text-muted)">{tyre}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Speed trace visualization
interface SpeedData {
  driver: string;
  speeds: number[];
  maxSpeed: number;
}

interface SpeedTraceChartProps {
  data: SpeedData[];
  maxSpeed?: number;
}

export function SpeedTraceChart({ data, maxSpeed: globalMax }: SpeedTraceChartProps) {
  const max = globalMax || Math.max(...data.flatMap(d => d.speeds));
  
  return (
    <div className="var(--bg-elevated) rounded-xl p-4">
      <h3 className="var(--text-primary) font-semibold mb-3 flex items-center gap-2">
        <Activity className="w-4 h-4 text-green-400" />
        Trace de Velocidad
      </h3>
      <div className="space-y-3">
        {data.map((driver, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-16 text-xs var(--text-muted) truncate">{driver.driver}</span>
            <div className="flex-1 h-6 var(--bg-overlay) rounded overflow-hidden relative">
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${(driver.maxSpeed / max) * 100}%`,
                  background: `linear-gradient(90deg, #43B02A 0%, #FFD700 50%, #FF3333 100%)`
                }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono var(--text-muted)">
                {driver.maxSpeed} km/h
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Season progress visualization
interface SeasonProgressProps {
  completed: number;
  total: number;
  nextRace?: string;
  nextDate?: string;
}

export function SeasonProgress({ completed, total, nextRace, nextDate }: SeasonProgressProps) {
  const percentage = (completed / total) * 100;
  
  return (
    <div className="var(--bg-elevated) rounded-xl p-4">
      <h3 className="var(--text-primary) font-semibold mb-3 flex items-center gap-2">
        <Flag className="w-4 h-4 text-red-500" />
        Progreso de Temporada
      </h3>
      
      {/* Progress bar */}
      <div className="relative h-4 var(--bg-overlay) rounded-full overflow-hidden mb-3">
        <div 
          className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold var(--text-primary) bg-black/50 px-2 py-0.5 rounded-full">
            {completed}/{total} carreras
          </span>
        </div>
      </div>
      
      {/* Next race info */}
      {nextRace && (
        <div className="flex items-center justify-between pt-3 border-t var(--border-color)">
          <div>
            <p className="text-xs var(--text-muted)">Próxima carrera</p>
            <p className="var(--text-primary) font-medium">{nextRace}</p>
          </div>
          <div className="text-right">
            <p className="text-xs var(--text-muted)">Fecha</p>
            <p className="var(--text-primary) font-medium">{nextDate}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Position change indicator
interface PositionChangeProps {
  current: number;
  previous: number;
  driver: string;
}

export function PositionChange({ current, previous, driver }: PositionChangeProps) {
  const change = previous - current;
  const isPositive = change > 0;
  const isNeutral = change === 0;
  
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg var(--bg-elevated)">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
        isPositive ? 'bg-green-500/20 text-green-400' :
        isNeutral ? 'bg-gray-500/20 var(--text-muted)' :
        'bg-red-500/20 text-red-400'
      }`}>
        {isPositive ? `+${change}` : isNeutral ? '—' : change}
      </div>
      <div className="flex-1">
        <p className="var(--text-primary) text-sm font-medium">{driver}</p>
        <p className="text-xs var(--text-muted)">P{previous} → P{current}</p>
      </div>
    </div>
  );
}

// Mini championship tile
interface ChampionshipTileProps {
  position: number;
  driver: string;
  team: string;
  points: number;
  pointsBehind?: number;
  color: string;
}

export function ChampionshipTile({ position, driver, team, points, pointsBehind, color }: ChampionshipTileProps) {
  return (
    <div className="var(--bg-elevated) rounded-xl p-3 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold ${
        position === 1 ? 'bg-yellow-500/20 text-yellow-500' :
        position <= 3 ? 'bg-gray-300/20 var(--text-secondary)' :
        'var(--bg-overlay) var(--text-muted)'
      }`}>
        {position}
      </div>
      <div className="flex-1 min-w-0">
        <p className="var(--text-primary) font-medium truncate">{driver}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <p className="text-xs var(--text-muted)">{team}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold var(--text-primary)">{points}</p>
        <p className="text-xs var(--text-muted)">pts</p>
      </div>
      {pointsBehind !== undefined && pointsBehind > 0 && (
        <div className="text-xs var(--text-muted)">-{pointsBehind}</div>
      )}
    </div>
  );
}
