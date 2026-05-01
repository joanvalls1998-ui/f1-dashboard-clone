'use client';

import { useState, useEffect } from 'react';
import { Star, TrendingUp, AlertTriangle, CheckCircle, ChevronDown, Loader2 } from 'lucide-react';
import { drivers2026, teams2026 } from '@/lib/rc-data/grid';
import { performanceState } from '@/lib/rc-data/performance';
import { circuitProfiles } from '@/lib/rc-data/circuits';

// Types
interface Favorite {
  name: string;
  type: 'driver' | 'team';
  team?: string;
  colorClass: string;
  image?: string;
}

interface WeekendContext {
  raceName: string;
  phase: 'previa' | 'sprint' | 'carrera';
  phaseLabel: string;
  round: number;
}

interface TeamMetrics {
  aero: number;
  traction: number;
  topSpeed: number;
  tyreManagement: number;
  qualyPace: number;
  racePace: number;
  reliability: number;
}

interface Signal {
  label: string;
  className: string;
  description: string;
}

interface Objective {
  minimum: string;
  realistic: string;
  high: string;
  risk: string;
  phase: string;
}

interface CompetitiveRead {
  objective: Objective;
  signal: Signal;
  status: string;
  need: string;
  danger: string;
  watch: string;
}

interface BestWorstArea {
  label: string;
  value: number;
}

interface AreaEdges {
  best: BestWorstArea;
  worst: BestWorstArea;
}

// Helper functions from favorito.js - ported to TypeScript
function rc10Take<T>(items: T[] | null | undefined, max: number = 2): T[] {
  return Array.isArray(items) ? items.slice(0, max) : [];
}

function rc10PickBestWorstArea(map: Record<string, number> | null | undefined, labels: Record<string, string> = {}): AreaEdges {
  const rows = Object.entries(map || {})
    .map(([key, value]): { key: string; value: number; label: string } => ({
      key,
      value: Number(value || 0),
      label: labels[key] || key
    }))
    .sort((a, b) => b.value - a.value);

  return {
    best: rows[0] || { label: '—', value: 0 },
    worst: rows[rows.length - 1] || { label: '—', value: 0 }
  };
}

function rc10GetTeamAreaEdges(teamData: TeamMetrics | null | undefined): AreaEdges {
  return rc10PickBestWorstArea(
    {
      aero: teamData?.aero ?? 0,
      traction: teamData?.traction ?? 0,
      topSpeed: teamData?.topSpeed ?? 0,
      tyreManagement: teamData?.tyreManagement ?? 0
    },
    {
      aero: 'Aero',
      traction: 'Tracción',
      topSpeed: 'Vel. punta',
      tyreManagement: 'Neumáticos'
    }
  );
}

function rc10GetSignalTagClass(signal: Signal | null): string {
  if (!signal) return 'general';
  if (signal.label === 'Favorable') return 'statement';
  if (signal.label === 'Difícil') return 'reliability';
  return 'market';
}

function rc10GetFavoriteCompetitiveRead(
  favorite: Favorite,
  raceName: string,
  context: WeekendContext | null,
  predictData: any
): CompetitiveRead {
  const objective = getFavoriteWeekendObjective(favorite, raceName, predictData, context);
  const signal = getWeekendSignal(favorite, raceName);
  const radar = getFavoriteWeekendRadar(favorite, raceName, context, predictData);
  const metrics = getFavoriteMetrics(favorite);

  const pointsProb = metrics?.pointsProbability || 50;
  const status =
    pointsProb >= 72 ? 'Zona de ataque' :
    pointsProb >= 56 ? 'Zona de pelea' :
    'Zona de supervivencia';

  const needItem = radar.find((item: any) => item.title === 'Qué necesita');
  const dangerItem = radar.find((item: any) => item.title === 'Qué le puede hundir');
  const watchItem = radar.find((item: any) => item.title === 'Qué mirar primero');

  return {
    objective,
    signal,
    status,
    need: needItem?.text || 'Necesita ejecutar limpio.',
    danger: dangerItem?.text || 'El margen es corto si pierde ritmo base.',
    watch: watchItem?.text || 'La primera señal útil llegará en la siguiente sesión.'
  };
}

function rc10GetFavoriteSnapshot(
  favorite: Favorite,
  raceName: string,
  predictData: any,
  context: WeekendContext | null
) {
  const objective = getFavoriteWeekendObjective(favorite, raceName, predictData, context);
  const signal = getWeekendSignal(favorite, raceName);
  const teamName = favorite.type === 'driver' ? (favorite.team || favorite.name) : favorite.name;
  const teamData = getTeamData(teamName);

  const role = favorite.type === 'driver' ? 'Piloto' : 'Equipo';
  const headerSub = favorite.type === 'driver'
    ? `${favorite.team || ''} · ${role}`
    : `${favorite.name} · ${role}`;

  return { objective, signal, teamData, headerSub };
}

// Mock data functions - these would be connected to real predict engine
function getFavoriteWeekendObjective(favorite: Favorite, raceName: string, predictData: any, context: WeekendContext | null): Objective {
  // Generate objectives based on favorite and race context
  const circuit = circuitProfiles[raceName as keyof typeof circuitProfiles];
  const teamName = favorite.type === 'driver' ? (favorite.team || favorite.name) : favorite.name;
  const teamPerf = performanceState.teams[teamName as keyof typeof performanceState.teams];

  const basePerformance = teamPerf ? (teamPerf.qualyPace + teamPerf.racePace) / 2 : 65;

  // Determine objectives based on team performance and circuit fit
  let minimum = 'Terminar en puntos';
  let realistic = 'Q3 y puntos';
  let high = 'Podio';

  if (basePerformance >= 85) {
    minimum = 'Terminar en puntos';
    realistic = 'Podio';
    high = 'Victoria';
  } else if (basePerformance >= 75) {
    minimum = 'Terminar en puntos';
    realistic = 'Q3 y top 6';
    high = 'Podio';
  } else if (basePerformance >= 65) {
    minimum = 'Terminar';
    realistic = 'Puntos';
    high = 'Top 8';
  } else {
    minimum = 'Terminar';
    realistic = 'Finalizar en zona de puntos';
    high = 'Puntos';
  }

  const risk = getPrimaryRisk(favorite, raceName, circuit);

  return {
    minimum,
    realistic,
    high,
    risk,
    phase: context?.phaseLabel || 'Previa'
  };
}

function getPrimaryRisk(favorite: Favorite, raceName: string, circuit: any): string {
  if (!circuit) return 'Fiabilidad';

  const teamName = favorite.type === 'driver' ? (favorite.team || favorite.name) : favorite.name;
  const teamPerf = performanceState.teams[teamName as keyof typeof performanceState.teams];

  if (!teamPerf) return 'Fiabilidad';

  // Find weakest area
  const areas: Record<string, number> = {
    'Aero': teamPerf.aero,
    'Tracción': teamPerf.traction,
    'Velocidad': teamPerf.topSpeed,
    'Neumáticos': teamPerf.tyreManagement
  };

  const weakest = Object.entries(areas).reduce((min, [key, val]) =>
    val < min[1] ? [key, val] : min
  , ['Fiabilidad', 100]);

  return weakest[0];
}

function getWeekendSignal(favorite: Favorite, raceName: string): Signal {
  // Calculate signal based on form and circuit fit
  const teamName = favorite.type === 'driver' ? (favorite.team || favorite.name) : favorite.name;
  const teamPerf = performanceState.teams[teamName as keyof typeof performanceState.teams];
  const circuit = circuitProfiles[raceName as keyof typeof circuitProfiles];

  if (!teamPerf || !circuit) {
    return { label: 'Estable', className: 'market', description: 'Sin datos suficientes para analizar.' };
  }

  const form = teamPerf.recentTrend || 0;
  const weights = circuit.weights;

  // Calculate circuit fit score
  const fitScore = (
    (teamPerf.aero * weights.aero) +
    (teamPerf.traction * weights.traction) +
    (teamPerf.topSpeed * weights.topSpeed) +
    (teamPerf.tyreManagement * weights.tyreManagement)
  ) / 100;

  // Determine signal
  if (form >= 3 && fitScore >= 75) {
    return {
      label: 'Favorable',
      className: 'statement',
      description: `Tendencia positiva y encaje favorable con las demandas del circuito.`
    };
  } else if (form <= -2 || fitScore < 55) {
    return {
      label: 'Difícil',
      className: 'reliability',
      description: `Reto complicado: tendencia a la baja o encaje pobre con lo que pide el circuito.`
    };
  } else {
    return {
      label: 'Estable',
      className: 'market',
      description: `Situación equilibrada. El resultado dependerá de la ejecución.`
    };
  }
}

function getFavoriteWeekendRadar(favorite: Favorite, raceName: string, context: WeekendContext | null, predictData: any): Array<{title: string; text: string}> {
  const objective = getFavoriteWeekendObjective(favorite, raceName, predictData, context);
  const signal = getWeekendSignal(favorite, raceName);

  return [
    { title: 'Qué necesita', text: `Mantener la consistencia y ejecutar el plan de carrera.` },
    { title: 'Qué le puede hundir', text: `Errores de estrategia o problemas de fiabilidad.` },
    { title: 'Qué mirar primero', text: `La primera sesión de clasificación determinará el rango de objetivo.` }
  ];
}

function getFavoriteMetrics(favorite: Favorite): { pointsProbability: number } {
  const teamName = favorite.type === 'driver' ? (favorite.team || favorite.name) : favorite.name;
  const teamPerf = performanceState.teams[teamName as keyof typeof performanceState.teams];

  if (!teamPerf) return { pointsProbability: 40 };

  const base = (teamPerf.qualyPace + teamPerf.racePace) / 2;
  const adjusted = base + (teamPerf.recentTrend * 2);

  return { pointsProbability: Math.min(100, Math.max(0, adjusted)) };
}

function getTeamData(teamName: string): TeamMetrics | null {
  const team = performanceState.teams[teamName as keyof typeof performanceState.teams];
  if (!team) return null;

  return {
    aero: team.aero,
    traction: team.traction,
    topSpeed: team.topSpeed,
    tyreManagement: team.tyreManagement,
    qualyPace: team.qualyPace,
    racePace: team.racePace,
    reliability: team.reliability
  };
}

function getDriverData(driverName: string): any {
  return performanceState.drivers[driverName as keyof typeof performanceState.drivers];
}

// Get next race from Ergast API
async function fetchNextRace(): Promise<{ raceName: string; round: number; date: string } | null> {
  try {
    const response = await fetch('https://api.jolpi.ca/ergast/f1/2026.json');
    const data = await response.json();

    const races = data.MRData.RaceTable.Races;
    const now = new Date();

    // Find next upcoming race
    for (const race of races) {
      const raceDate = new Date(race.date);
      if (raceDate >= now) {
        return {
          raceName: race.raceName.replace(' Grand Prix', ' GP'),
          round: parseInt(race.round),
          date: race.date
        };
      }
    }

    // Default to next race if all passed (use first for demo)
    if (races && races.length > 0) {
      return {
        raceName: races[0].raceName.replace(' Grand Prix', ' GP'),
        round: 1,
        date: races[0].date
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching next race:', error);
    return null;
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

function setStoredFavorite(favorite: Favorite): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('rc_favorite', JSON.stringify(favorite));
  } catch (e) {
    console.error('Error saving favorite to localStorage:', e);
  }
}

// Signal badge component
function SignalBadge({ signal }: { signal: Signal }) {
  const colorClass = rc10GetSignalTagClass(signal);

  const colors: Record<string, string> = {
    statement: 'bg-green-500/20 text-green-400 border-green-500/30',
    reliability: 'bg-red-500/20 text-red-400 border-red-500/30',
    market: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    general: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[colorClass]}`}>
      {signal.label}
    </span>
  );
}

// Phase badge component
function PhaseBadge({ phase }: { phase: string }) {
  const phaseColors: Record<string, string> = {
    'Previa': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Sprint': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Carrera': 'bg-green-500/20 text-green-400 border-green-500/30'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${phaseColors[phase] || phaseColors['Previa']}`}>
      {phase}
    </span>
  );
}

// Metric bar component
function MetricBar({ label, value, accent = 'bg-blue-500' }: { label: string; value: number; accent?: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-medium">{value}%</span>
      </div>
      <div className="h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
        <div
          className={`h-full ${accent} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// Main component
export function FavoritoDashboard() {
  const [favorite, setFavorite] = useState<Favorite | null>(null);
  const [weekendContext, setWeekendContext] = useState<WeekendContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    async function initialize() {
      const stored = getStoredFavorite();
      setFavorite(stored);

      const nextRace = await fetchNextRace();
      if (nextRace) {
        setWeekendContext({
          raceName: nextRace.raceName,
          phase: 'previa',
          phaseLabel: 'Previa',
          round: nextRace.round
        });
      } else {
        setWeekendContext({
          raceName: 'GP de Miami',
          phase: 'previa',
          phaseLabel: 'Previa',
          round: 6
        });
      }

      setLoading(false);
    }

    initialize();
  }, []);

  const handleFavoriteChange = (newFavorite: Favorite) => {
    setStoredFavorite(newFavorite);
    setFavorite(newFavorite);
    setShowSelector(false);
  };

  if (loading || !favorite) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  const teamName = favorite.type === 'driver' ? (favorite.team || favorite.name) : favorite.name;
  const teamData = getTeamData(teamName);
  const edges = rc10GetTeamAreaEdges(teamData);
  const snapshot = rc10GetFavoriteSnapshot(favorite, weekendContext?.raceName || '', null, weekendContext);
  const read = rc10GetFavoriteCompetitiveRead(favorite, weekendContext?.raceName || '', weekendContext, null);

  // Get all available drivers for selector
  const availableDrivers = drivers2026.map(d => ({
    name: d.name,
    team: d.team,
    colorClass: d.colorClass,
    type: 'driver' as const
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            Favorito del Fin de Semana
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Análisis detallado de {favorite.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PhaseBadge phase={weekendContext?.phaseLabel || 'Previa'} />
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-gradient-to-br from-[#1f1f1f] to-[#171717] rounded-2xl overflow-hidden border border-[#2a2a2a]">
        <div className="h-2 bg-gradient-to-r from-yellow-500 to-orange-500" />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-3 h-3 rounded-full bg-[#229971]`} />
                <h2 className="text-xl font-bold text-white">{favorite.name}</h2>
                <SignalBadge signal={snapshot.signal} />
              </div>
              <p className="text-gray-400 text-sm">{snapshot.headerSub} · {weekendContext?.raceName}</p>
            </div>
            <button
              onClick={() => setShowSelector(!showSelector)}
              className="px-3 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg text-sm text-gray-300 flex items-center gap-2 transition-colors"
            >
              Cambiar <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Favorite Selector Dropdown */}
          {showSelector && (
            <div className="mb-4 bg-[#171717] rounded-xl border border-[#2a2a2a] overflow-hidden">
              <div className="p-2 max-h-64 overflow-y-auto">
                {availableDrivers.map((driver) => (
                  <button
                    key={driver.name}
                    onClick={() => handleFavoriteChange(driver)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#2a2a2a] transition-colors ${
                      favorite.name === driver.name ? 'bg-[#2a2a2a]' : ''
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full bg-[#${driver.colorClass === 'aston' ? '229971' : driver.colorClass === 'ferrari' ? 'E8002D' : '666666'}]`} />
                    <span className="text-white text-sm">{driver.name}</span>
                    <span className="text-gray-500 text-xs ml-auto">{driver.team}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-[#1a1a1a] rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Objetivo razonable</p>
              <p className="text-lg font-bold text-white">{snapshot.objective.realistic}</p>
              <p className="text-xs text-gray-500 mt-1">Meta principal del fin de semana</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Riesgo principal</p>
              <p className="text-lg font-bold text-white">{snapshot.objective.risk}</p>
              <p className="text-xs text-gray-500 mt-1">Factor que más condiciona el resultado</p>
            </div>
          </div>

          <p className="text-gray-400 text-sm mt-4">{snapshot.signal.description}</p>
        </div>
      </div>

      {/* Objective Card */}
      <div className="bg-[#171717] rounded-2xl p-6 border border-[#2a2a2a]">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-bold text-white">Plan competitivo</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#1a1a1a] rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Mínimo</p>
            <p className="text-xl font-bold text-white">{snapshot.objective.minimum}</p>
            <p className="text-xs text-gray-500 mt-2">No comprometer el fin de semana</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Razonable</p>
            <p className="text-xl font-bold text-yellow-400">{snapshot.objective.realistic}</p>
            <p className="text-xs text-gray-500 mt-2">Resultado objetivo real</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Techo</p>
            <p className="text-xl font-bold text-green-400">{snapshot.objective.high}</p>
            <p className="text-xs text-gray-500 mt-2">Escenario más alto</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
            Riesgo: {snapshot.objective.risk}
          </span>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
            Fase: {snapshot.objective.phase}
          </span>
        </div>
      </div>

      {/* Competitive Read Card */}
      <div className="bg-[#171717] rounded-2xl p-6 border border-[#2a2a2a]">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-bold text-white">Lectura competitiva</h3>
        </div>

        <div className="flex gap-2 mb-4">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
            {read.status}
          </span>
          <SignalBadge signal={read.signal} />
        </div>

        <div className="space-y-3">
          <div className="bg-[#1a1a1a] rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Dónde está realmente:</p>
            <p className="text-white text-sm">Objetivo base <strong>{read.objective.realistic}</strong>.</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Qué necesita:</p>
            <p className="text-white text-sm">{read.need}</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Qué le puede hundir:</p>
            <p className="text-white text-sm">{read.danger}</p>
          </div>
        </div>

        {/* Team Metrics */}
        {teamData && (
          <>
            <div className="mt-6">
              <p className="text-sm font-medium text-white mb-3">Métricas del equipo</p>
              <div className="grid grid-cols-2 gap-3">
                <MetricBar label="Aero" value={teamData.aero} accent="bg-blue-500" />
                <MetricBar label="Tracción" value={teamData.traction} accent="bg-green-500" />
                <MetricBar label="Vel. punta" value={teamData.topSpeed} accent="bg-purple-500" />
                <MetricBar label="Neumáticos" value={teamData.tyreManagement} accent="bg-yellow-500" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Fortaleza base</p>
                <p className="text-lg font-bold text-green-400">{edges.best.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{edges.best.value}%</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Debilidad principal</p>
                <p className="text-lg font-bold text-red-400">{edges.worst.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{edges.worst.value}%</p>
              </div>
            </div>
          </>
        )}

        {/* Additional Team Status Metrics */}
        {teamData && (
          <div className="mt-6">
            <p className="text-sm font-medium text-white mb-3">Estado competitivo</p>
            <div className="space-y-3">
              <MetricBar label="Ritmo carrera" value={teamData.racePace} accent="bg-[#229971]" />
              <MetricBar label="Qualy" value={teamData.qualyPace} accent="bg-[#229971]" />
              <MetricBar label="Fiabilidad" value={teamData.reliability} accent="bg-red-500" />
            </div>
          </div>
        )}
      </div>

      {/* Quick Look Rivals Card */}
      <div className="bg-[#171717] rounded-2xl p-6 border border-[#2a2a2a]">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-bold text-white">Rivales directos</h3>
        </div>

        <div className="space-y-2">
          {/* Show teammates and close competitors */}
          {drivers2026
            .filter(d => d.team === favorite.team && d.name !== favorite.name)
            .slice(0, 2)
            .map((driver) => (
              <div
                key={driver.name}
                className="flex items-center gap-3 py-2 px-3 bg-[#1a1a1a] rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-xs font-bold text-white">
                  {driver.shortCode}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{driver.name}</p>
                  <p className="text-gray-500 text-xs">{driver.team}</p>
                </div>
                <span className="text-xs text-gray-400">Compañero de equipo</span>
              </div>
            ))
          }
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Los rivales directos se definen por la ventana de objetivo del fin de semana.
        </p>
      </div>
    </div>
  );
}

export default FavoritoDashboard;
