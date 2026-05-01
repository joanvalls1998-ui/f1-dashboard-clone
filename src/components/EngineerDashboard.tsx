'use client';

import { useState, useEffect } from 'react';
import { Radio, Clock, Gauge, Activity, Zap, Fuel, CircleDot, Play, Pause, ChevronDown, Loader2 } from 'lucide-react';
import { drivers2026, teams2026, driverByName, teamByName } from '@/lib/rc-data/grid';

// Types
interface Driver {
  code: string;
  name: string;
  team: string;
  number: string;
}

interface Session {
  meeting_key: string;
  gp_label: string;
  session_type: string;
  session_label: string;
  lap_count: number;
  air_temp: number;
  track_temp: number;
}

interface LapEntry {
  lapNumber: number;
  lapTime: number | null;
  compound: string;
  stint: number;
  status: string;
  isBest: boolean;
  hasTelemetry: boolean;
  isPitIn: boolean;
  isPitOut: boolean;
}

interface TelemetryPoint {
  speed?: number;
  throttle?: number;
  brake?: number;
  ers?: number;
  fuel?: number;
  gforce?: number;
}

interface StintInfo {
  number: number;
  compound: string;
  lapStart: number;
  lapEnd: number;
  lapCount: number;
  avgLap: number | null;
  bestLap: number | null;
}

// Constants
const SESSION_TYPES = [
  { key: 'fp1', label: 'FP1' },
  { key: 'fp2', label: 'FP2' },
  { key: 'fp3', label: 'FP3' },
  { key: 'qualy', label: 'Qualy' },
  { key: 'sprint_qualy', label: 'Sprint Qualy' },
  { key: 'sprint_race', label: 'Sprint' },
  { key: 'race', label: 'Race' }
];

const COMPOUND_COLORS: Record<string, string> = {
  SOFT: '#ff3333',
  MEDIUM: '#ffff33',
  HARD: '#ffffff',
  INTER: '#33ff33',
  WET: '#3399ff'
};

// Helper functions
function formatLapTime(ms: number | null): string {
  if (ms === null || ms === undefined) return '—';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  const centis = Math.floor((ms % 1000) / 10);
  if (minutes > 0) {
    return `${minutes}:${remainder.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
  }
  return `${remainder}.${centis.toString().padStart(2, '0')}`;
}

function formatSpeed(kmh: number | null): string {
  if (kmh === null || kmh === undefined) return '—';
  return `${Math.round(kmh)}`;
}

function parseLapTime(timeStr: string | null): number | null {
  if (!timeStr) return null;
  // Format: "1:32.451" or "32.451"
  const parts = timeStr.split(':');
  if (parts.length === 2) {
    const mins = parseInt(parts[0], 10);
    const secs = parseFloat(parts[1]);
    return mins * 60000 + secs * 1000;
  }
  return parseFloat(parts[0]) * 1000;
}

// Mock data for development
function getMockSession(): Session {
  return {
    meeting_key: 'australian_gp_2026',
    gp_label: 'Australian Grand Prix 2026',
    session_type: 'fp3',
    session_label: 'FP3 · Practice 3',
    lap_count: 21,
    air_temp: 22,
    track_temp: 35
  };
}

function getMockDriver(): Driver {
  return {
    code: 'PIA',
    name: 'Oscar Piastri',
    team: 'McLaren',
    number: '81'
  };
}

function getMockLaps(): LapEntry[] {
  return [
    { lapNumber: 1, lapTime: 92451, compound: 'SOFT', stint: 1, status: 'valid', isBest: false, hasTelemetry: true, isPitIn: false, isPitOut: false },
    { lapNumber: 2, lapTime: 91882, compound: 'SOFT', stint: 1, status: 'valid', isBest: false, hasTelemetry: true, isPitIn: false, isPitOut: false },
    { lapNumber: 3, lapTime: 91234, compound: 'SOFT', stint: 1, status: 'valid', isBest: true, hasTelemetry: true, isPitIn: false, isPitOut: false },
    { lapNumber: 4, lapTime: 98112, compound: 'SOFT', stint: 1, status: 'valid', isBest: false, hasTelemetry: true, isPitIn: false, isPitOut: false },
    { lapNumber: 5, lapTime: 97891, compound: 'MEDIUM', stint: 2, status: 'valid', isBest: false, hasTelemetry: true, isPitIn: false, isPitOut: false },
    { lapNumber: 6, lapTime: 97654, compound: 'MEDIUM', stint: 2, status: 'valid', isBest: false, hasTelemetry: true, isPitIn: false, isPitOut: false },
    { lapNumber: 7, lapTime: 97521, compound: 'MEDIUM', stint: 2, status: 'valid', isBest: false, hasTelemetry: true, isPitIn: false, isPitOut: false },
    { lapNumber: 8, lapTime: 97389, compound: 'MEDIUM', stint: 2, status: 'valid', isBest: false, hasTelemetry: true, isPitIn: false, isPitOut: false },
    { lapNumber: 9, lapTime: null, compound: 'MEDIUM', stint: 2, status: 'pit', isBest: false, hasTelemetry: false, isPitIn: true, isPitOut: false },
    { lapNumber: 10, lapTime: 91234, compound: 'HARD', stint: 3, status: 'valid', isBest: false, hasTelemetry: true, isPitIn: false, isPitOut: true },
    { lapNumber: 11, lapTime: 90876, compound: 'HARD', stint: 3, status: 'valid', isBest: false, hasTelemetry: true, isPitIn: false, isPitOut: false },
    { lapNumber: 12, lapTime: 90543, compound: 'HARD', stint: 3, status: 'valid', isBest: false, hasTelemetry: true, isPitIn: false, isPitOut: false }
  ];
}

function getMockStints(): StintInfo[] {
  return [
    { number: 1, compound: 'SOFT', lapStart: 1, lapEnd: 4, lapCount: 4, avgLap: 90919.5, bestLap: 91234 },
    { number: 2, compound: 'MEDIUM', lapStart: 5, lapEnd: 9, lapCount: 5, avgLap: 97693.4, bestLap: 97389 },
    { number: 3, compound: 'HARD', lapStart: 10, lapEnd: 12, lapCount: 3, avgLap: 90884.3, bestLap: 90543 }
  ];
}

function getMockTelemetry(): TelemetryPoint {
  return {
    speed: 311,
    throttle: 89,
    brake: 11,
    ers: 2.3,
    fuel: 78,
    gforce: 4.8
  };
}

// Component: Session Header
function SessionHeader({ session, driver }: { session: Session; driver: Driver }) {
  const teamData = teamByName[driver.team];
  const teamColor = teamData?.colorClass || 'gray';

  return (
    <div className="mb-4">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Session</div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-white">{session.gp_label}</div>
          <div className="text-sm text-gray-400">{session.session_label}</div>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{session.lap_count}</div>
            <div className="text-xs text-gray-500">Laps</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">{session.air_temp}°</div>
            <div className="text-xs text-gray-500">Air</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">{session.track_temp}°</div>
            <div className="text-xs text-gray-500">Track</div>
          </div>
        </div>
      </div>
      {/* Driver chip */}
      <div className="flex items-center gap-2 mt-3">
        <div className="flex items-center gap-1.5 bg-[#1a1a1a] rounded-full px-3 py-1 border border-[#333]">
          <div className={`w-2 h-2 rounded-full bg-${teamColor}`} />
          <span className="text-sm font-medium text-white">{driver.code}</span>
          <span className="text-xs text-gray-400">{driver.team}</span>
        </div>
      </div>
    </div>
  );
}

// Component: Track View
function TrackView({ 
  laps, 
  stints, 
  currentLap, 
  isPlaying, 
  onTogglePlay,
  speed,
  lapTime 
}: { 
  laps: LapEntry[];
  stints: StintInfo[];
  currentLap: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  speed: number | null;
  lapTime: number | null;
}) {
  const progress = laps.length > 0 ? (currentLap / laps[laps.length - 1].lapNumber) * 100 : 0;

  return (
    <div className="mb-4">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
        Track View · Telemetry playback
      </div>
      <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0d0d14] rounded-xl border border-[#222] p-4">
        {/* Track header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-400">LIVE</span>
          </div>
          <div className="text-sm text-gray-300">
            LAP <span className="font-bold text-white">{currentLap}</span> / {laps[laps.length - 1]?.lapNumber || '—'}
          </div>
        </div>

        {/* Track SVG (simplified Melbourne layout) */}
        <div className="relative h-32 mb-4">
          <svg viewBox="0 0 800 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Track outline */}
            <path
              d="M 100 150 C 50 150, 20 100, 50 50 C 80 0, 200 0, 300 20 C 400 40, 500 30, 600 50 C 700 70, 750 100, 720 140 C 690 180, 600 180, 500 160 C 400 140, 300 150, 200 150"
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="24"
              strokeLinecap="round"
            />
            {/* Track racing line */}
            <path
              d="M 100 150 C 50 150, 20 100, 50 50 C 80 0, 200 0, 300 20 C 400 40, 500 30, 600 50 C 700 70, 750 100, 720 140 C 690 180, 600 180, 500 160 C 400 140, 300 150, 200 150"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Start/finish line */}
            <line x1="100" y1="145" x2="100" y2="165" stroke="#fff" strokeWidth="3" />
            {/* Sector markers */}
            <circle cx="50" cy="50" r="4" fill="#ff6b35" opacity="0.6" />
            <circle cx="300" cy="20" r="4" fill="#ff6b35" opacity="0.6" />
            <circle cx="720" cy="140" r="4" fill="#ff6b35" opacity="0.6" />
            {/* Car position indicator */}
            <circle 
              cx={100 + (progress / 100) * 620} 
              cy={150 - Math.sin((progress / 100) * Math.PI * 2) * 80} 
              r="8" 
              fill="#00ff94"
              className="drop-shadow-[0_0_8px_rgba(0,255,148,0.8)]"
            />
          </svg>
        </div>

        {/* Playback bar */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-white hover:bg-[#252525] transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>
          <div className="flex-1">
            <div className="relative h-1 bg-[#1f1f1f] rounded-full">
              <div 
                className="absolute h-full bg-[#00ff94] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
              <div 
                className="absolute w-3 h-3 bg-white rounded-full -top-1 shadow-lg"
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            </div>
          </div>
          <div className="flex gap-1">
            {['0.5×', '1×', '2×'].map((speed) => (
              <button
                key={speed}
                className={`px-2 py-0.5 text-xs rounded ${
                  speed === '1×' 
                    ? 'bg-[#00ff94] text-black font-medium' 
                    : 'bg-[#1a1a1a] text-gray-400 border border-[#333]'
                }`}
              >
                {speed}
              </button>
            ))}
          </div>
        </div>

        {/* Current lap info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#141414] rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Lap Time</div>
            <div className="text-xl font-mono font-bold text-white">
              {formatLapTime(lapTime)}
              <span className="text-xs text-gray-400 ml-1">s</span>
            </div>
          </div>
          <div className="bg-[#141414] rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Speed</div>
            <div className="text-xl font-mono font-bold text-white">
              {speed || '—'}
              <span className="text-xs text-gray-400 ml-1">km/h</span>
            </div>
          </div>
        </div>

        {/* Stints bar */}
        <div className="mt-4">
          <div className="flex gap-1">
            {stints.map((stint) => (
              <div
                key={stint.number}
                className={`flex-1 rounded px-2 py-1 text-center text-xs ${
                  stint.compound === 'SOFT' ? 'bg-[#ff3333]/20 border border-[#ff3333]/30' :
                  stint.compound === 'MEDIUM' ? 'bg-[#ffff33]/20 border border-[#ffff33]/30' :
                  'bg-white/10 border border-white/20'
                }`}
              >
                <span className="text-gray-300">
                  {stint.compound === 'SOFT' ? 'S' : stint.compound === 'MEDIUM' ? 'M' : 'H'}
                  {stint.number} · {stint.lapCount}laps
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component: Lap Selector
function LapSelector({ 
  laps, 
  selectedLap, 
  onSelectLap 
}: { 
  laps: LapEntry[]; 
  selectedLap: number;
  onSelectLap: (lap: number) => void;
}) {
  return (
    <div className="mb-4">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Lap selector</div>
      <div className="flex flex-wrap gap-2">
        {laps.map((lap) => (
          <button
            key={lap.lapNumber}
            onClick={() => onSelectLap(lap.lapNumber)}
            className={`flex flex-col items-center px-3 py-1.5 rounded-lg border transition-all ${
              selectedLap === lap.lapNumber
                ? 'bg-[#00ff94]/10 border-[#00ff94]/50 text-white'
                : lap.isPitIn || lap.isPitOut
                ? 'bg-[#1a1a1a] border-[#333] text-gray-500'
                : 'bg-[#1a1a1a] border-[#333] text-gray-300 hover:border-[#444]'
            }`}
          >
            <span className="text-xs font-medium">L{lap.lapNumber}</span>
            <span className={`text-xs font-mono ${
              lap.isBest ? 'text-[#00ff94]' : 'text-gray-400'
            }`}>
              {lap.isPitIn || lap.isPitOut ? '—' : formatLapTime(lap.lapTime)}
            </span>
            <div 
              className="w-2 h-2 rounded-full mt-0.5"
              style={{ 
                backgroundColor: lap.isPitIn || lap.isPitOut 
                  ? '#666' 
                  : COMPOUND_COLORS[lap.compound] || '#666'
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// Component: Metric Tile
function MetricTile({
  label,
  value,
  unit,
  delta,
  highlight = false
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  highlight?: boolean;
}) {
  const isPositive = delta?.startsWith('▲');
  const isNegative = delta?.startsWith('▼');

  return (
    <div className={`rounded-lg p-3 ${highlight ? 'bg-[#00ff94]/10 border border-[#00ff94]/30' : 'bg-[#141414]'}`}>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className={`text-xl font-mono font-bold ${highlight ? 'text-[#00ff94]' : 'text-white'}`}>
          {value}
        </span>
        {unit && <span className="text-xs text-gray-400">{unit}</span>}
      </div>
      {delta && (
        <div className={`text-xs mt-1 ${
          isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-400'
        }`}>
          {delta}
        </div>
      )}
    </div>
  );
}

// Component: Key Metrics
function KeyMetrics({ telemetry, bestLapTime, selectedLapTime }: { 
  telemetry: TelemetryPoint;
  bestLapTime: number | null;
  selectedLapTime: number | null;
}) {
  const delta = selectedLapTime && bestLapTime 
    ? ((selectedLapTime - bestLapTime) / 1000).toFixed(3)
    : null;
  const isFaster = delta !== null && parseFloat(delta) < 0;

  return (
    <div className="mb-4">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
        Telemetry · Lap {selectedLapTime !== null ? formatLapTime(selectedLapTime) : '—'}
      </div>
      <div className="grid grid-cols-4 gap-2">
        <MetricTile
          label="Lap Time"
          value={selectedLapTime ? formatLapTime(selectedLapTime).replace('.', ':') : '—'}
          unit="s"
          delta={delta ? `${isFaster ? '▼' : '▲'} ${Math.abs(parseFloat(delta))} vs best` : undefined}
          highlight={!!delta && parseFloat(delta) < 0}
        />
        <MetricTile
          label="Top Speed"
          value={telemetry.speed ? Math.round(telemetry.speed) : '—'}
          unit="km/h"
          delta="— vs avg"
        />
        <MetricTile
          label="G-Force"
          value={telemetry.gforce ? telemetry.gforce.toFixed(1) : '—'}
          unit="G"
          delta="▼ 0.3 vs best"
        />
        <MetricTile
          label="Throttle"
          value={telemetry.throttle ?? '—'}
          unit="%"
          delta="— avg"
        />
        <MetricTile
          label="Brake"
          value={telemetry.brake ?? '—'}
          unit="%"
          delta="—"
        />
        <MetricTile
          label="ERS"
          value={telemetry.ers ? `+${telemetry.ers.toFixed(1)}` : '—'}
          unit="MJ/lap"
          delta="▲"
        />
        <MetricTile
          label="Fuel"
          value={telemetry.fuel ?? '—'}
          unit="kg"
          delta="P17"
        />
        <MetricTile
          label="Tyre Life"
          value="18"
          unit="laps"
          delta="Medium"
        />
      </div>
    </div>
  );
}

// Component: Circuit Calendar Preview
function CircuitCalendar() {
  const upcomingRaces = [
    { name: 'Australian GP', date: '16 Mar', featured: true },
    { name: 'Chinese GP', date: '23 Mar', featured: false },
    { name: 'Japanese GP', date: '6 Abr', featured: false },
    { name: 'Bahrain GP', date: '13 Abr', featured: false },
    { name: 'Miami GP', date: '4 May', featured: false },
    { name: 'Monaco GP', date: '25 May', featured: false }
  ];

  return (
    <div>
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Calendar 2026</div>
      <div className="grid grid-cols-3 gap-2">
        {upcomingRaces.map((race, index) => (
          <div 
            key={index}
            className={`rounded-lg p-2 ${
              race.featured 
                ? 'bg-gradient-to-br from-[#00ff94]/10 to-transparent border border-[#00ff94]/20' 
                : 'bg-[#141414] border border-[#222]'
            }`}
          >
            <div className="h-8 mb-1 opacity-60">
              {/* Simplified circuit SVG */}
              <svg viewBox="0 0 60 40" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <path 
                  d="M10 30 C5 25, 5 15, 15 10 C25 5, 45 5, 50 15 C55 25, 45 35, 30 35 C15 35, 12 32, 10 30"
                  fill="none"
                  stroke={race.featured ? '#00ff94' : '#444'}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className={`text-xs ${race.featured ? 'text-[#00ff94]' : 'text-gray-300'}`}>
              {race.name}
            </div>
            <div className="text-xs text-gray-500">{race.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Component
export function EngineerDashboard() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [laps, setLaps] = useState<LapEntry[]>([]);
  const [stints, setStints] = useState<StintInfo[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryPoint | null>(null);
  const [selectedLap, setSelectedLap] = useState<number>(1);
  const [currentLap, setCurrentLap] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Load mock data
    async function loadData() {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSession(getMockSession());
      setDriver(getMockDriver());
      setLaps(getMockLaps());
      setStints(getMockStints());
      setTelemetry(getMockTelemetry());
      setLoading(false);
    }

    loadData();
  }, []);

  // Playback simulation
  useEffect(() => {
    if (!isPlaying || laps.length === 0) return;

    const interval = setInterval(() => {
      setCurrentLap(prev => {
        const maxLap = laps[laps.length - 1]?.lapNumber || 1;
        if (prev >= maxLap) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, laps]);

  const selectedLapData = laps.find(l => l.lapNumber === selectedLap);
  const bestLap = laps.find(l => l.isBest);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (!session || !driver) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400">No session data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Session Header */}
      <SessionHeader session={session} driver={driver} />

      {/* Track View */}
      <TrackView
        laps={laps}
        stints={stints}
        currentLap={currentLap}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        speed={telemetry?.speed ?? null}
        lapTime={selectedLapData?.lapTime ?? null}
      />

      {/* Lap Selector */}
      <LapSelector
        laps={laps}
        selectedLap={selectedLap}
        onSelectLap={setSelectedLap}
      />

      {/* Key Metrics */}
      <KeyMetrics
        telemetry={telemetry || {}}
        bestLapTime={bestLap?.lapTime ?? null}
        selectedLapTime={selectedLapData?.lapTime ?? null}
      />

      {/* Circuit Calendar Preview */}
      <CircuitCalendar />
    </div>
  );
}

export default EngineerDashboard;
