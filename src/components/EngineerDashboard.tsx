'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Radio, Clock, Gauge, Activity, Zap, Fuel, CircleDot, Play, Pause, Loader2, ChevronDown, Car } from 'lucide-react';
import { drivers2026, teams2026 } from '@/lib/rc-data/grid';
import { TEAM_COLORS_BY_KEY } from '@/lib/team-colors';

// Types
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
const COMPOUND_COLORS: Record<string, string> = {
  SOFT: '#ff3333',
  MEDIUM: '#ffff33',
  HARD: '#ffffff',
  INTER: '#33ff33',
  WET: '#3399ff'
};

const SESSION_TYPES = [
  { key: 'fp1', label: 'FP1' },
  { key: 'fp2', label: 'FP2' },
  { key: 'fp3', label: 'FP3' },
  { key: 'qualifying', label: 'Qualy' },
  { key: 'sprint_shootout', label: 'Sprint Shoot' },
  { key: 'sprint', label: 'Sprint' },
  { key: 'race', label: 'Race' }
];

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

// Fetch last race info from Ergast
async function fetchLastRaceInfo(): Promise<{ meeting_key: string; gp_label: string; year: number; round: number } | null> {
  try {
    const res = await fetch('https://api.jolpi.ca/ergast/f1/current/last.json');
    if (!res.ok) return null;
    const data = await res.json();
    const race = data.MRData.RaceTable.Races[0];
    const season = parseInt(data.MRData.RaceTable.season);
    const round = parseInt(data.MRData.RaceTable.round);
    return {
      meeting_key: `${race.Circuit.circuitId}_${season}`,
      gp_label: race.raceName,
      year: season,
      round
    };
  } catch {
    return null;
  }
}

// Fetch sessions for a GP
async function fetchSessions(meetingKey: string, year: number): Promise<Session[]> {
  try {
    const res = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/circuits/${meetingKey.split('_')[0]}/races.json`);
    if (!res.ok) return [];
    const data = await res.json();
    const races = data.MRData.RaceTable.Races;
    if (!races || races.length === 0) return [];
    const race = races[0];
    const date = race.date;
    const sessions: Session[] = [
      {
        meeting_key: meetingKey,
        gp_label: race.raceName,
        session_type: 'fp1',
        session_label: 'FP1 · Free Practice 1',
        lap_count: 60,
        air_temp: 22,
        track_temp: 35
      },
      {
        meeting_key: meetingKey,
        gp_label: race.raceName,
        session_type: 'fp2',
        session_label: 'FP2 · Free Practice 2',
        lap_count: 60,
        air_temp: 21,
        track_temp: 33
      }
    ];
    void date;
    return sessions;
  } catch {
    return [];
  }
}

// Generate mock laps for selected driver
function generateMockLaps(driverName: string, sessionType: string): { laps: LapEntry[]; stints: StintInfo[] } {
  const baseTime = sessionType === 'qualifying' ? 78000 : 85000;
  const driverInitials = driverName.split(' ').map(n => n[0]).join('');
  const seed = driverInitials.charCodeAt(0) + driverInitials.charCodeAt(1);

  const compounds = ['SOFT', 'MEDIUM', 'HARD'];
  const stintLengths = sessionType === 'race'
    ? [8, 12, 15, 18]
    : [4, 6, 4];

  const laps: LapEntry[] = [];
  let lapNum = 1;
  let stintNum = 1;
  let stintCompound = 'MEDIUM';
  let stintStartLap = 1;

  const totalLaps = sessionType === 'race' ? 57 : sessionType.includes('sprint') ? 30 : 24;

  for (let i = 0; i < totalLaps; i++) {
    const variation = ((seed * (i + 1) * 7) % 3000) - 1500;
    const stintVariation = ((seed * stintNum * 3) % 2000) - 1000;
    const lapTime = baseTime + variation + stintVariation;
    const isPit = i === 4 || i === 10 || i === 18;

    if (isPit && stintNum < 4) {
      laps.push({
        lapNumber: lapNum,
        lapTime: null,
        compound: stintCompound,
        stint: stintNum,
        status: 'pit',
        isBest: false,
        hasTelemetry: false,
        isPitIn: true,
        isPitOut: false
      });
      const nextCompound = compounds[(stintNum) % compounds.length];
      laps.push({
        lapNumber: lapNum + 1,
        lapTime: null,
        compound: nextCompound,
        stint: stintNum + 1,
        status: 'pit',
        isBest: false,
        hasTelemetry: false,
        isPitIn: false,
        isPitOut: true
      });
      stintNum++;
      stintCompound = nextCompound;
      stintStartLap = lapNum + 1;
      lapNum += 2;
    } else {
      const isBest = i === 3 || i === 14;
      laps.push({
        lapNumber: lapNum,
        lapTime: Math.max(lapTime, baseTime - 3000),
        compound: stintCompound,
        stint: stintNum,
        status: 'valid',
        isBest,
        hasTelemetry: true,
        isPitIn: false,
        isPitOut: false
      });
      lapNum++;
    }
  }

  // Build stints
  const stints: StintInfo[] = [];
  let currentStintLaps: LapEntry[] = [];
  let currentStintNum = 1;
  let currentCompound = laps[0]?.compound || 'MEDIUM';

  for (const lap of laps) {
    if (lap.status === 'pit') continue;
    if (lap.stint !== currentStintNum || lap.compound !== currentCompound) {
      if (currentStintLaps.length > 0) {
        const times = currentStintLaps.map(l => l.lapTime).filter((t): t is number => t !== null);
        stints.push({
          number: currentStintNum,
          compound: currentCompound,
          lapStart: currentStintLaps[0].lapNumber,
          lapEnd: currentStintLaps[currentStintLaps.length - 1].lapNumber,
          lapCount: currentStintLaps.length,
          avgLap: times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : null,
          bestLap: Math.min(...times)
        });
      }
      currentStintNum = lap.stint;
      currentCompound = lap.compound;
      currentStintLaps = [];
    }
    currentStintLaps.push(lap);
  }
  if (currentStintLaps.length > 0) {
    const times = currentStintLaps.map(l => l.lapTime).filter((t): t is number => t !== null);
    stints.push({
      number: currentStintNum,
      compound: currentCompound,
      lapStart: currentStintLaps[0].lapNumber,
      lapEnd: currentStintLaps[currentStintLaps.length - 1].lapNumber,
      lapCount: currentStintLaps.length,
      avgLap: times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : null,
      bestLap: Math.min(...times)
    });
  }

  return { laps, stints };
}

// Generate mock telemetry
function generateMockTelemetry(lapTime: number | null): TelemetryPoint {
  const base = lapTime ? Math.max(lapTime, 75000) : 85000;
  return {
    speed: 280 + Math.floor((base / 1000) % 5) * 8 + Math.floor(Math.random() * 15),
    throttle: 65 + Math.floor(Math.random() * 30),
    brake: 5 + Math.floor(Math.random() * 20),
    ers: +(Math.random() * 4).toFixed(1),
    fuel: +(80 - Math.random() * 60).toFixed(1),
    gforce: +(3.5 + Math.random() * 2).toFixed(1)
  };
}

// Component: Session Header
function SessionHeader({ session, driverName, teamColor }: { session: Session; driverName: string; teamColor: string }) {
  return (
    <div className="mb-4">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Session</div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-white">{session.gp_label}</div>
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
      {/* Driver chip with inline color */}
      <div className="flex items-center gap-2 mt-3">
        <div
          className="flex items-center gap-1.5 bg-[#1a1a1a] rounded-full px-3 py-1 border border-[#333]"
          style={{ borderColor: `${teamColor}40` }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: teamColor }}
          />
          <span className="text-sm font-medium text-white">{driverName}</span>
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
  playbackSpeed,
  onTogglePlay,
  onSpeedChange,
  speed,
  lapTime
}: {
  laps: LapEntry[];
  stints: StintInfo[];
  currentLap: number;
  isPlaying: boolean;
  playbackSpeed: number;
  onTogglePlay: () => void;
  onSpeedChange: (s: number) => void;
  speed: number | null;
  lapTime: number | null;
}) {
  const progress = laps.length > 0 ? (currentLap / laps[laps.length - 1].lapNumber) * 100 : 0;
  const SPEEDS = [0.5, 1, 2];

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

        {/* Track SVG (abstract representation) */}
        <div className="relative h-24 mb-4">
          <svg viewBox="0 0 800 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <path
              d="M 80 120 C 30 120, 20 70, 60 40 C 100 10, 220 10, 320 30 C 420 50, 520 30, 640 50 C 740 68, 770 100, 740 130 C 710 155, 600 155, 480 135 C 360 115, 240 130, 160 130"
              fill="none"
              stroke="#1e1e1e"
              strokeWidth="24"
              strokeLinecap="round"
            />
            <path
              d="M 80 120 C 30 120, 20 70, 60 40 C 100 10, 220 10, 320 30 C 420 50, 520 30, 640 50 C 740 68, 770 100, 740 130 C 710 155, 600 155, 480 135 C 360 115, 240 130, 160 130"
              fill="none"
              stroke="#0a0a0a"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Start/finish */}
            <line x1="80" y1="115" x2="80" y2="135" stroke="#fff" strokeWidth="3" />
            {/* Sector markers */}
            <circle cx="60" cy="40" r="4" fill="#ff6b35" opacity="0.7" />
            <circle cx="320" cy="30" r="4" fill="#ff6b35" opacity="0.7" />
            <circle cx="740" cy="130" r="4" fill="#ff6b35" opacity="0.7" />
            {/* Car position */}
            <circle
              cx={80 + (progress / 100) * 660}
              cy={120 - Math.sin((progress / 100) * Math.PI * 1.5) * 70}
              r="8"
              fill="#00ff94"
              style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,148,0.8))' }}
            />
          </svg>
        </div>

        {/* Playback bar */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-white hover:bg-[#252525] transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <div className="flex-1">
            <div className="relative h-1.5 bg-[#1f1f1f] rounded-full">
              <div
                className="absolute h-full bg-[#00ff94] rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute w-3 h-3 bg-white rounded-full -top-0.75 shadow-lg"
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            </div>
          </div>
          <div className="flex gap-1">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-0.5 text-xs rounded transition-colors ${
                  playbackSpeed === s
                    ? 'bg-[#00ff94] text-black font-medium'
                    : 'bg-[#1a1a1a] text-gray-400 border border-[#333] hover:border-[#444]'
                }`}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>

        {/* Current lap info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#141414] rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Lap Time</div>
            <div className="text-xl font-mono font-bold text-white">
              {formatLapTime(lapTime)}
            </div>
          </div>
          <div className="bg-[#141414] rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Top Speed</div>
            <div className="text-xl font-mono font-bold text-white">
              {speed ?? '—'}
              <span className="text-xs text-gray-400 ml-1">km/h</span>
            </div>
          </div>
        </div>

        {/* Stints bar */}
        {stints.length > 0 && (
          <div className="mt-4">
            <div className="flex gap-1">
              {stints.map((stint) => (
                <div
                  key={stint.number}
                  className="flex-1 rounded px-2 py-1 text-center text-xs"
                  style={{
                    backgroundColor: stint.compound === 'SOFT' ? 'rgba(255,51,51,0.15)' :
                      stint.compound === 'MEDIUM' ? 'rgba(255,255,51,0.15)' : 'rgba(255,255,255,0.1)',
                    border: `1px solid ${COMPOUND_COLORS[stint.compound] || '#666'}40`
                  }}
                >
                  <span className="text-gray-300">
                    {stint.compound === 'SOFT' ? 'S' : stint.compound === 'MEDIUM' ? 'M' : 'H'}
                    {stint.number} · {stint.lapCount}laps
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Component: Lap Selector
function LapSelector({
  laps,
  selectedLap,
  currentLap,
  onSelectLap
}: {
  laps: LapEntry[];
  selectedLap: number;
  currentLap: number;
  onSelectLap: (lap: number) => void;
}) {
  return (
    <div className="mb-4">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Lap selector</div>
      <div className="flex flex-wrap gap-1.5">
        {laps.map((lap) => {
          const isCurrent = lap.lapNumber === currentLap;
          const isSelected = lap.lapNumber === selectedLap;
          return (
            <button
              key={lap.lapNumber}
              onClick={() => onSelectLap(lap.lapNumber)}
              className={`flex flex-col items-center px-2 py-1 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-[#00ff94]/10 border-[#00ff94]/50 text-white'
                  : isCurrent
                  ? 'bg-[#00ff94]/5 border-[#00ff94]/30 text-white'
                  : lap.isPitIn || lap.isPitOut
                  ? 'bg-[#1a1a1a] border-[#333] text-gray-500'
                  : 'bg-[#1a1a1a] border-[#333] text-gray-300 hover:border-[#444]'
              }`}
            >
              <span className={`text-xs font-medium ${isCurrent ? 'text-[#00ff94]' : ''}`}>
                L{lap.lapNumber}
              </span>
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
          );
        })}
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
    <div
      className={`rounded-lg p-3 ${highlight ? 'bg-[#00ff94]/10 border border-[#00ff94]/30' : 'bg-[#141414]'}`}
    >
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
function KeyMetrics({
  telemetry,
  bestLapTime,
  selectedLapTime,
  position
}: {
  telemetry: TelemetryPoint;
  bestLapTime: number | null;
  selectedLapTime: number | null;
  position: number;
}) {
  const delta = selectedLapTime && bestLapTime
    ? ((selectedLapTime - bestLapTime) / 1000).toFixed(3)
    : null;
  const isFaster = delta !== null && parseFloat(delta) < 0;

  return (
    <div className="mb-4">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
        Telemetry · {selectedLapTime ? formatLapTime(selectedLapTime) : '—'}
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
        />
        <MetricTile
          label="G-Force"
          value={telemetry.gforce ? telemetry.gforce.toFixed(1) : '—'}
          unit="G"
        />
        <MetricTile
          label="Throttle"
          value={telemetry.throttle ?? '—'}
          unit="%"
        />
        <MetricTile
          label="Brake"
          value={telemetry.brake ?? '—'}
          unit="%"
        />
        <MetricTile
          label="ERS"
          value={telemetry.ers ? `+${telemetry.ers.toFixed(1)}` : '—'}
          unit="MJ/lap"
        />
        <MetricTile
          label="Fuel"
          value={telemetry.fuel ? telemetry.fuel.toFixed(1) : '—'}
          unit="kg"
        />
        <MetricTile
          label="Position"
          value={`P${position}`}
        />
      </div>
    </div>
  );
}

// Main Component
export function EngineerDashboard() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [selectedDriverName, setSelectedDriverName] = useState<string>('Oscar Piastri');
  const [selectedSessionType, setSelectedSessionType] = useState<string>('fp2');
  const [laps, setLaps] = useState<LapEntry[]>([]);
  const [stints, setStints] = useState<StintInfo[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryPoint | null>(null);
  const [selectedLap, setSelectedLap] = useState<number>(1);
  const [currentLap, setCurrentLap] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showDriverPicker, setShowDriverPicker] = useState(false);
  const [position, setPosition] = useState<number>(8);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Get driver and team color
  const driver = drivers2026.find(d => d.name === selectedDriverName);
  const teamColor = driver ? TEAM_COLORS_BY_KEY[driver.colorClass] || '#888' : '#888';

  // Load data when driver or session type changes
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));

      const raceInfo = await fetchLastRaceInfo();
      const meetingKey = raceInfo?.meeting_key || 'albert_park_2026';
      const gpLabel = raceInfo?.gp_label || 'Australian Grand Prix 2026';

      const sessionTypes: Record<string, { label: string; lap_count: number }> = {
        fp1: { label: 'FP1 · Free Practice 1', lap_count: 60 },
        fp2: { label: 'FP2 · Free Practice 2', lap_count: 60 },
        fp3: { label: 'FP3 · Free Practice 3', lap_count: 60 },
        qualifying: { label: 'Qualifying', lap_count: 24 },
        sprint: { label: 'Sprint Race', lap_count: 30 },
        sprint_shootout: { label: 'Sprint Shootout', lap_count: 20 },
        race: { label: 'Race', lap_count: 57 }
      };
      const st = sessionTypes[selectedSessionType] || sessionTypes.fp2;

      setSession({
        meeting_key: meetingKey,
        gp_label: gpLabel,
        session_type: selectedSessionType,
        session_label: st.label,
        lap_count: st.lap_count,
        air_temp: 22,
        track_temp: 35
      });

      const { laps: newLaps, stints: newStints } = generateMockLaps(selectedDriverName, selectedSessionType);
      setLaps(newLaps);
      setStints(newStints);
      setTelemetry(generateMockTelemetry(newLaps[0]?.lapTime || null));
      setSelectedLap(1);
      setCurrentLap(1);
      setIsPlaying(false);
      setPosition(Math.floor(Math.random() * 18) + 1);
      setLoading(false);
    }
    loadData();
  }, [selectedDriverName, selectedSessionType]);

  // Playback simulation
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isPlaying && laps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentLap(prev => {
          const maxLap = laps[laps.length - 1]?.lapNumber || 1;
          if (prev >= maxLap) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
        setSelectedLap(prev => {
          const maxLap = laps[laps.length - 1]?.lapNumber || 1;
          return prev >= maxLap ? prev : prev + 1;
        });
      }, 2000 / playbackSpeed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, laps]);

  // Update telemetry when selected lap changes
  useEffect(() => {
    const lapData = laps.find(l => l.lapNumber === selectedLap);
    if (lapData && lapData.status !== 'pit') {
      setTelemetry(generateMockTelemetry(lapData.lapTime));
    }
  }, [selectedLap, laps]);

  const selectedLapData = laps.find(l => l.lapNumber === selectedLap);
  const bestLap = laps.find(l => l.isBest);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400">No session data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Selectors row */}
      <div className="flex gap-3 mb-4">
        {/* Driver selector */}
        <div className="relative">
          <button
            onClick={() => setShowDriverPicker(!showDriverPicker)}
            className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white hover:border-[#444] transition-colors"
          >
            <Car className="w-4 h-4" style={{ color: teamColor }} />
            <span className="text-sm font-medium">{selectedDriverName}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {showDriverPicker && (
            <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-50 w-64 max-h-80 overflow-y-auto">
              {drivers2026.map(d => {
                const tc = TEAM_COLORS_BY_KEY[d.colorClass] || '#888';
                return (
                  <button
                    key={d.name}
                    onClick={() => {
                      setSelectedDriverName(d.name);
                      setShowDriverPicker(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[#252525] transition-colors ${
                      d.name === selectedDriverName ? 'bg-[#252525]' : ''
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: tc }} />
                    <span className="text-sm text-white">{d.name}</span>
                    <span className="text-xs text-gray-500 ml-auto">{d.team}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Session type selector */}
        <div className="flex bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden">
          {SESSION_TYPES.map(st => (
            <button
              key={st.key}
              onClick={() => setSelectedSessionType(st.key)}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                selectedSessionType === st.key
                  ? 'bg-[#00ff94] text-black'
                  : 'text-gray-400 hover:text-white hover:bg-[#252525]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Session Header */}
      <SessionHeader session={session} driverName={selectedDriverName} teamColor={teamColor} />

      {/* Track View */}
      <TrackView
        laps={laps}
        stints={stints}
        currentLap={currentLap}
        isPlaying={isPlaying}
        playbackSpeed={playbackSpeed}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onSpeedChange={setPlaybackSpeed}
        speed={telemetry?.speed ?? null}
        lapTime={selectedLapData?.lapTime ?? null}
      />

      {/* Lap Selector */}
      <LapSelector
        laps={laps}
        selectedLap={selectedLap}
        currentLap={currentLap}
        onSelectLap={setSelectedLap}
      />

      {/* Key Metrics */}
      <KeyMetrics
        telemetry={telemetry || {}}
        bestLapTime={bestLap?.lapTime ?? null}
        selectedLapTime={selectedLapData?.lapTime ?? null}
        position={position}
      />
    </div>
  );
}

export default EngineerDashboard;
