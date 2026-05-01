'use client';

import { useState, useEffect } from 'react';
import { Clock, MapPin, Flag, Target, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { circuitImages } from '@/lib/f1-assets';
import { performanceState } from '@/lib/rc-data/performance';
import { circuitProfiles } from '@/lib/rc-data/circuits';

// Types
interface Favorite {
  name: string;
  type: 'driver' | 'team';
  team?: string;
  colorClass: string;
}

interface WeekendContext {
  raceName: string;
  phase: 'previa' | 'sprint' | 'carrera';
  phaseLabel: string;
  round: number;
  focusDescription: string;
  isSprint: boolean;
  currentSession: Session | null;
  nextSession: Session | null;
  lastCompletedSession: Session | null;
  nextSessionCountdown: string;
  whatToWatch: string[];
}

interface Session {
  key: string;
  label: string;
  status: string;
  date?: string;
}

// Helper functions (converted from vanilla JS)
function rc10Take<T>(items: T[] | null | undefined, max: number = 2): T[] {
  return Array.isArray(items) ? items.slice(0, max) : [];
}

function escapeHtml(text: string | null | undefined): string {
  if (!text) return '';
  const div = typeof document !== 'undefined' ? document.createElement('div') : null;
  if (div) {
    div.textContent = text;
    return div.innerHTML;
  }
  return String(text);
}

function getWeekendPhaseTagClass(phase: string): string {
  switch (phase) {
    case 'Previa': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Sprint': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Carrera': return 'bg-green-500/20 text-green-400 border-green-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

function getSessionStatusLabel(status: string): string {
  switch (status) {
    case 'completed': return 'Completada';
    case 'in_progress': return 'En curso';
    case 'upcoming': return 'Próxima';
    default: return 'Pendiente';
  }
}

function getSessionImpactOnFavorite(sessionKey: string, favorite: Favorite | null): string {
  if (!favorite) return 'Sin favorito seleccionado';
  
  if (sessionKey.includes('qualy') || sessionKey.includes('sprint_qualy')) {
    return `Posición de salida para ${favorite.name}`;
  }
  if (sessionKey.includes('race') || sessionKey.includes('sprint_race')) {
    return `Resultado en carrera para ${favorite.name}`;
  }
  return 'Sesión de práctica';
}

function getTeamData(teamName: string): any {
  const team = performanceState.teams[teamName as keyof typeof performanceState.teams];
  return team || null;
}

// Get next race from Ergast API
async function fetchNextRace(): Promise<{ raceName: string; round: number; date: string; locality: string; country: string } | null> {
  try {
    const response = await fetch('https://api.jolpi.ca/ergast/f1/2026.json');
    const data = await response.json();

    const races: any[] = data.MRData.RaceTable.Races;
    const now = new Date();

    // Find next upcoming race
    for (const race of races) {
      const raceDate = new Date(race.date);
      if (raceDate >= now) {
        return {
          raceName: race.raceName.replace(' Grand Prix', ' GP'),
          round: parseInt(race.round),
          date: race.date,
          locality: race.Location?.locality || 'Unknown',
          country: race.Location?.country || 'Unknown'
        };
      }
    }

    // Default to Miami GP (round 6) for demo if all passed
    return {
      raceName: 'GP Miami',
      round: 6,
      date: '2026-05-01',
      locality: 'Miami',
      country: 'USA'
    };
  } catch (error) {
    console.error('Error fetching next race:', error);
    return null;
  }
}

// Get sessions for a race
async function fetchRaceSessions(round: number): Promise<Session[]> {
  try {
    const response = await fetch(`https://api.jolpi.ca/ergast/f1/2026/${round}/sessions.json`);
    const data = await response.json();
    
    const sessions: any[] = data.MRData.RaceTable.Races[0]?.Sessions || [];
    return sessions.map((s: any) => ({
      key: s.session_type || s.session_key,
      label: s.session_name || s.session_type,
      status: s.status || 'upcoming',
      date: s.date_start
    }));
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
}

// Local storage helpers
function getStoredFavorite(): Favorite | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('rc_favorite');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading favorite from localStorage:', e);
  }
  // Default to Fernando Alonso
  return {
    name: 'Fernando Alonso',
    type: 'driver',
    team: 'Aston Martin',
    colorClass: 'aston'
  };
}

// Countdown timer component
function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    function calculate() {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-1 text-lg font-mono">
      <span className="bg-[#1a1a1a] px-2 py-1 rounded text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
      <span className="text-gray-500">:</span>
      <span className="bg-[#1a1a1a] px-2 py-1 rounded text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
      <span className="text-gray-500">:</span>
      <span className="bg-[#1a1a1a] px-2 py-1 rounded text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
    </div>
  );
}

// Phase Summary Card
function PhaseSummaryCard({ context }: { context: WeekendContext }) {
  return (
    <div className="bg-[#171717] rounded-xl p-4 border border-[#333]">
      <div className="flex items-center gap-2 mb-3">
        <Flag className="w-4 h-4 text-blue-400" />
        <h3 className="text-white font-semibold">Resumen de fase</h3>
      </div>
      <div className="text-gray-300 text-sm mb-3">
        {escapeHtml(context.focusDescription || 'Sin resumen disponible.')}
      </div>
      <div className="flex gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getWeekendPhaseTagClass(context.phaseLabel)}`}>
          {escapeHtml(context.phaseLabel || 'Previa')}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-gray-500/20 text-gray-400 border-gray-500/30">
          {context.isSprint ? 'Sprint weekend' : 'Formato normal'}
        </span>
      </div>
    </div>
  );
}

// Hierarchy Card
function HierarchyCard({ context, favorite }: { context: WeekendContext; favorite: Favorite | null }) {
  const target = context.currentSession || context.nextSession || context.lastCompletedSession;

  if (!target) return null;

  return (
    <div className="bg-[#171717] rounded-xl p-4 border border-[#333]">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-purple-400" />
        <h3 className="text-white font-semibold">Jerarquía rápida</h3>
      </div>
      <div className="space-y-3">
        <div className="border-l-2 border-blue-500 pl-3">
          <div className="text-xs text-gray-400 font-medium">1) Sesión clave</div>
          <div className="text-sm text-white">{escapeHtml(target.label)} · {getSessionStatusLabel(target.status)}</div>
        </div>
        <div className="border-l-2 border-green-500 pl-3">
          <div className="text-xs text-gray-400 font-medium">2) Impacto favorito</div>
          <div className="text-sm text-white">{escapeHtml(getSessionImpactOnFavorite(target.key, favorite))}</div>
        </div>
        <div className="border-l-2 border-yellow-500 pl-3">
          <div className="text-xs text-gray-400 font-medium">3) Siguiente paso</div>
          <div className="text-sm text-white">{escapeHtml(context.nextSessionCountdown || 'Esperando nueva referencia')}</div>
        </div>
      </div>
    </div>
  );
}

// What to Watch Card
function WhatToWatchCard({ items }: { items: string[] }) {
  const displayItems = items.length ? items.slice(0, 3) : ['Sin claves activas ahora mismo.'];

  return (
    <div className="bg-[#171717] rounded-xl p-4 border border-[#333]">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-red-400" />
        <h3 className="text-white font-semibold">Qué mirar</h3>
      </div>
      <div className="space-y-2">
        {displayItems.map((item: string, index: number) => (
          <div key={index} className="flex items-start gap-2 text-sm">
            <span className="text-gray-500 mt-0.5">•</span>
            <span className="text-gray-300">{escapeHtml(item)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Team Status Card
function TeamStatusCard({ favorite }: { favorite: Favorite | null }) {
  if (!favorite) return null;

  const teamName = favorite.type === 'driver' ? (favorite.team || favorite.name) : favorite.name;
  const team = getTeamData(teamName);

  if (!team) return null;

  return (
    <div className="bg-[#171717] rounded-xl p-4 border border-[#333]">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-4 h-4 text-cyan-400" />
        <h3 className="text-white font-semibold">Estado del equipo</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Carrera</div>
          <div className="text-xl font-bold text-white">{team.racePace}%</div>
          <div className="text-xs text-gray-500">Ritmo</div>
        </div>
        <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Qualy</div>
          <div className="text-xl font-bold text-white">{team.qualyPace}%</div>
          <div className="text-xs text-gray-500">1 vuelta</div>
        </div>
        <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Fiabilidad</div>
          <div className="text-xl font-bold text-white">{team.reliability}%</div>
          <div className="text-xs text-gray-500">Base</div>
        </div>
      </div>
    </div>
  );
}

// Main Component
export function HomeIntel() {
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState<Favorite | null>(null);
  const [context, setContext] = useState<WeekendContext | null>(null);
  const [nextRaceInfo, setNextRaceInfo] = useState<{
    raceName: string;
    round: number;
    locality: string;
    country: string;
    circuitImage: string;
    nextSessionTime: Date | null;
  } | null>(null);

  useEffect(() => {
    async function initialize() {
      try {
        // Get favorite
        const stored = getStoredFavorite();
        setFavorite(stored);

        // Fetch next race
        const nextRace = await fetchNextRace();
        
        if (nextRace) {
          // Get circuit image
          const circuitImage = circuitImages[nextRace.locality] || circuitImages[nextRace.country] || '';
          
          // Fetch sessions for this race
          const sessions = await fetchRaceSessions(nextRace.round);
          
          // Build context based on sessions and current time
          const now = new Date();
          
          // Default Miami GP context (FP1 ~53 min from now, since it's May 1 2026)
          // FP1 is at 10:00 local time on May 1
          const fp1Time = new Date('2026-05-01T14:00:00Z'); // 10:00 Miami = 14:00 UTC
          
          // Default context for Miami GP
          const defaultContext: WeekendContext = {
            raceName: nextRace.raceName,
            phase: 'previa',
            phaseLabel: 'Previa',
            round: nextRace.round,
            focusDescription: 'Preparación para el GP de Miami. Primera sesión de libres antes de la clasificación del sábado.',
            isSprint: false,
            currentSession: null,
            nextSession: {
              key: 'fp1',
              label: 'FP1',
              status: 'upcoming'
            },
            lastCompletedSession: null,
            nextSessionCountdown: fp1Time > now ? 'FP1 en' : 'Esperando sesión',
            whatToWatch: [
              'Rendimiento de Aston Martin en configuración de Miami',
              'Preparación de neumáticos para alta temperatura',
              'Análisis de líneas de escape en curva 17'
            ]
          };

          // Find current and next sessions
          let currentSession: Session | null = null;
          let nextSession: Session | null = null;
          let nextSessionCountdown = 'Sesión por confirmar';
          let nextSessionTime: Date | null = null;

          // Parse sessions if available
          if (sessions.length > 0) {
            for (const session of sessions) {
              if (session.date) {
                const sessionDate = new Date(session.date);
                if (sessionDate <= now && session.status !== 'completed') {
                  currentSession = session;
                } else if (sessionDate > now && !nextSession) {
                  nextSession = session;
                  nextSessionTime = sessionDate;
                  const diff = sessionDate.getTime() - now.getTime();
                  const hours = Math.floor(diff / (1000 * 60 * 60));
                  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                  nextSessionCountdown = `En ${hours}h ${minutes}m`;
                }
              }
            }
          }

          // If no next session found but we have FP1 time
          if (!nextSession && fp1Time > now) {
            const diff = fp1Time.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            nextSessionCountdown = `FP1 en ${hours}h ${minutes}m`;
            nextSessionTime = fp1Time;
          }

          setNextRaceInfo({
            raceName: nextRace.raceName,
            round: nextRace.round,
            locality: nextRace.locality,
            country: nextRace.country,
            circuitImage,
            nextSessionTime
          });

          setContext({
            ...defaultContext,
            currentSession,
            nextSession: nextSession || defaultContext.nextSession,
            nextSessionCountdown
          });
        }
      } catch (error) {
        console.error('Error initializing HomeIntel:', error);
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (!nextRaceInfo || !context) {
    return (
      <div className="text-gray-400 text-center py-8">
        No hay información del próximo GP disponible.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Next GP Hero Card */}
      <div className="bg-[#171717] rounded-xl overflow-hidden border border-[#333]">
        {nextRaceInfo.circuitImage && (
          <div className="h-40 overflow-hidden">
            <img
              src={nextRaceInfo.circuitImage}
              alt={`${nextRaceInfo.raceName} circuit`}
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171717] to-transparent" />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-400" />
              <span className="text-gray-400 text-sm">{nextRaceInfo.locality}, {nextRaceInfo.country}</span>
            </div>
            <span className="text-xs text-gray-500">Ronda {nextRaceInfo.round}</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-3">{nextRaceInfo.raceName}</h2>
          
          {/* Next Session Countdown */}
          {nextRaceInfo.nextSessionTime && (
            <div className="bg-[#1a1a1a] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-400 text-sm">FP1 · Mayo 1, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{context.nextSessionCountdown}</span>
                <CountdownTimer targetDate={nextRaceInfo.nextSessionTime} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Phase Summary Card */}
      <PhaseSummaryCard context={context} />

      {/* Hierarchy Card */}
      <HierarchyCard context={context} favorite={favorite} />

      {/* What to Watch Card */}
      <WhatToWatchCard items={context.whatToWatch} />

      {/* Team Status Card */}
      <TeamStatusCard favorite={favorite} />
    </div>
  );
}
