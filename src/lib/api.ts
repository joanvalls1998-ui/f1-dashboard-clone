// F1 Data API Service - Uses Jolpica (Ergast fork) and OpenF1
// With Zod validation and Next.js ISR (5 min revalidation)

import { getTeamColor } from './f1-assets';

const ERGAST_BASE = 'https://api.jolpi.ca/ergast/f1';
const OPENF1_BASE = 'https://api.openf1.org/v1';

// Fetch options with ISR caching (5 minutes for most data)
const cacheOptions = { next: { revalidate: 300 } } as any;
const cache1h = { next: { revalidate: 3600 } } as any;
const cacheNoStore = { cache: 'no-store' as any };

export interface Driver {
  position: number;
  abbreviation: string;
  fullName: string;
  team: string;
  points: number;
  driverId: string;
  number: string;
  nationality: string;
}

export interface Constructor {
  position: number;
  name: string;
  points: number;
  wins: number;
  drivers: string[];
  color: string;
}

export interface Race {
  round: number;
  name: string;
  country: string;
  city: string;
  date: string;
  circuit: string;
  winner?: string;
  winnerTeam?: string;
  status: 'completed' | 'upcoming' | 'cancelled';
  sessionKey?: number;
  lat?: number;
  lng?: number;
}

export interface Session {
  session_key: number;
  session_type: string;
  session_name: string;
  date_start: string;
  date_end: string;
  circuit_short_name: string;
  country_name: string;
  location: string;
  is_cancelled: boolean;
}

export interface RaceResult {
  position: string;
  abbreviation: string;
  fullName: string;
  team: string;
  points: number;
  status: string;
  laps?: string;
  time?: string | null;
  fastestLap: boolean;
}

// ── Helper: safe fetch ──────────────────────────────────────────

async function safeFetch<T = any>(
  url: string,
  opts?: any
): Promise<{ data: T | null; error: string | null }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, { ...opts, signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      return { data: null, error: `HTTP ${res.status}: ${res.statusText}` };
    }

    const raw = await res.json();
    return { data: raw, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Unknown fetch error' };
  }
}

// ── Driver Standings ─────────────────────────────────────────────

export async function fetchDriverStandings(year: number = 2026): Promise<Driver[]> {
  const url = `${ERGAST_BASE}/${year}/driverstandings.json`;
  const { data, error } = await safeFetch(url, cacheOptions);
  if (error || !data) {
    console.error('Error fetching driver standings:', error);
    return [];
  }

  const list = data.MRData?.StandingsTable?.StandingsLists?.[0];
  if (!list?.DriverStandings) return [];

  return list.DriverStandings.map((item: any) => ({
    position: parseInt(item.position),
    abbreviation: item.Driver?.code || '',
    fullName: `${item.Driver?.givenName || ''} ${item.Driver?.familyName || ''}`,
    team: item.Constructors?.[0]?.name || 'Unknown',
    points: parseInt(item.points) || 0,
    driverId: item.Driver?.driverId || '',
    number: item.Driver?.permanentNumber || item.Driver?.code || '',
    nationality: item.Driver?.nationality || '',
  }));
}

// ── Constructor Standings ──────────────────────────────────────

export async function fetchConstructorStandings(year: number = 2026): Promise<Constructor[]> {
  const url = `${ERGAST_BASE}/${year}/constructorstandings.json`;
  const { data, error } = await safeFetch(url, cacheOptions);
  if (error || !data) {
    console.error('Error fetching constructor standings:', error);
    return [];
  }

  const list = data.MRData?.StandingsTable?.StandingsLists?.[0];
  if (!list?.ConstructorStandings) return [];

  return list.ConstructorStandings.map((item: any) => ({
    position: parseInt(item.position),
    name: item.Constructor?.name || 'Unknown',
    points: parseInt(item.points) || 0,
    wins: parseInt(item.wins) || 0,
    drivers: [],
    color: getTeamColor(item.Constructor?.name || ''),
  }));
}

// ── Race Calendar ──────────────────────────────────────────────

export async function fetchRaceCalendar(year: number = 2026): Promise<Race[]> {
  const url = `${ERGAST_BASE}/${year}.json`;
  const { data, error } = await safeFetch(url, cache1h);
  if (error || !data) {
    console.error('Error fetching race calendar:', error);
    return [];
  }

  const races = data.MRData?.RaceTable?.Races;
  if (!races) return [];

  const now = new Date();
  return races.map((race: any) => {
    const raceDate = new Date(race.date);
    return {
      round: parseInt(race.round),
      name: race.raceName?.replace(' Grand Prix', ' GP') || '',
      country: race.Circuit?.Location?.country || '',
      city: race.Circuit?.Location?.locality || '',
      circuit: race.Circuit?.circuitName || '',
      date: raceDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: raceDate < now ? ('completed' as const) : ('upcoming' as const),
      lat: parseFloat(race.Circuit?.Location?.lat) || undefined,
      lng: parseFloat(race.Circuit?.Location?.long) || undefined,
    };
  });
}

// ── Latest Race Results ─────────────────────────────────────────

export async function fetchLatestRaceResults(): Promise<RaceResult[]> {
  const url = `${ERGAST_BASE}/current/last/results.json`;
  const { data, error } = await safeFetch(url, cacheOptions);
  if (error || !data) {
    console.error('Error fetching latest race results:', error);
    return [];
  }

  const races = data.MRData?.RaceTable?.Races;
  if (!races || races.length === 0) return [];

  const race = races[0];
  return race.Results?.map((result: any) => ({
    position: result.position,
    abbreviation: result.Driver?.code || '',
    fullName: `${result.Driver?.givenName || ''} ${result.Driver?.familyName || ''}`,
    team: result.Constructor?.name || '',
    points: result.points === '0' ? 0 : parseInt(result.points) || 0,
    status: result.status,
    laps: result.laps,
    time: result.Time?.time || null,
    fastestLap: result.FastestLap?.rank === '1',
  })) || [];
}

// ── OpenF1 Sessions ─────────────────────────────────────────────

export async function fetchSessions(year: number = 2026): Promise<Session[]> {
  const { data, error } = await safeFetch(
    `${OPENF1_BASE}/sessions?year=${year}`,
    { next: { revalidate: 60 } } as any
  );
  if (error || !data) {
    console.error('Error fetching sessions:', error);
    return [];
  }
  return (Array.isArray(data) ? data : []).map((s: any) => ({
    session_key: s.session_key,
    session_type: s.session_type,
    session_name: s.session_name,
    date_start: s.date_start,
    date_end: s.date_end,
    circuit_short_name: s.circuit_short_name || '',
    country_name: s.country_name || '',
    location: s.location || '',
    is_cancelled: s.is_cancelled || false,
  }));
}

export async function getCurrentSession(): Promise<Session | null> {
  const now = new Date().toISOString();
  const { data, error } = await safeFetch(
    `${OPENF1_BASE}/sessions?date_start<=${encodeURIComponent(now)}&date_end>=${encodeURIComponent(now)}&is_cancelled=false`,
    { next: { revalidate: 10 } } as any
  );
  if (error || !data) return null;
  const arr = Array.isArray(data) ? data : [];
  if (arr.length === 0) return null;
  const s = arr[0];
  return {
    session_key: s.session_key,
    session_type: s.session_type,
    session_name: s.session_name,
    date_start: s.date_start,
    date_end: s.date_end,
    circuit_short_name: s.circuit_short_name || '',
    country_name: s.country_name || '',
    location: s.location || '',
    is_cancelled: s.is_cancelled || false,
  };
}

export async function getUpcomingSessions(limit: number = 5): Promise<Session[]> {
  const now = new Date().toISOString();
  const { data, error } = await safeFetch(
    `${OPENF1_BASE}/sessions?date_start>=${encodeURIComponent(now)}&is_cancelled=false&limit=${limit}`,
    { next: { revalidate: 60 } } as any
  );
  if (error || !data) return [];
  return (Array.isArray(data) ? data : []).map((s: any) => ({
    session_key: s.session_key,
    session_type: s.session_type,
    session_name: s.session_name,
    date_start: s.date_start,
    date_end: s.date_end,
    circuit_short_name: s.circuit_short_name || '',
    country_name: s.country_name || '',
    location: s.location || '',
    is_cancelled: s.is_cancelled || false,
  }));
}

// ── Live Data (OpenF1) — no caching ─────────────────────────────

export async function fetchLiveCarData(sessionKey: number): Promise<any[]> {
  const { data, error } = await safeFetch(
    `${OPENF1_BASE}/car_data?session_key=${sessionKey}`,
    cacheNoStore
  );
  if (error || !data) return [];
  return Array.isArray(data) ? data : [];
}

export async function fetchLivePositions(sessionKey: number): Promise<any[]> {
  const { data, error } = await safeFetch(
    `${OPENF1_BASE}/position?session_key=${sessionKey}`,
    cacheNoStore
  );
  if (error || !data) return [];
  return Array.isArray(data) ? data : [];
}

export async function fetchLiveStints(sessionKey: number): Promise<any[]> {
  const { data, error } = await safeFetch(
    `${OPENF1_BASE}/stints?session_key=${sessionKey}`,
    cacheNoStore
  );
  if (error || !data) return [];
  return Array.isArray(data) ? data : [];
}

export async function fetchLivePitStops(sessionKey: number): Promise<any[]> {
  const { data, error } = await safeFetch(
    `${OPENF1_BASE}/pit?session_key=${sessionKey}`,
    cacheNoStore
  );
  if (error || !data) return [];
  return Array.isArray(data) ? data : [];
}

// ── Driver detail ────────────────────────────────────────────────

export async function fetchDriverDetails(driverId: string): Promise<any | null> {
  const url = `${ERGAST_BASE}/drivers/${driverId}.json`;
  const { data, error } = await safeFetch(url, cacheOptions);
  if (error || !data) return null;
  return data;
}

// ── Full season results ────────────────────────────────────────

export async function fetchSeasonResults(year: number = 2026): Promise<any[]> {
  const url = `${ERGAST_BASE}/${year}/results.json?limit=1000`;
  const { data, error } = await safeFetch(url, cache1h);
  if (error || !data) return [];
  const races = data?.MRData?.RaceTable?.Races;
  return Array.isArray(races) ? races : [];
}

// ── Qualifying results ────────────────────────────────────────

export async function fetchQualifyingResults(year: number = 2026, round: number = 1): Promise<any[]> {
  const url = `${ERGAST_BASE}/${year}/${round}/qualifying.json`;
  const { data, error } = await safeFetch(url, cacheOptions);
  if (error || !data) return [];
  const race = data?.MRData?.RaceTable?.Races?.[0];
  return race?.QualifyingResults || [];
}

// ── Lap times ─────────────────────────────────────────────────

export async function fetchLapTimes(year: number = 2026, round: number = 1, driverId: string): Promise<any[]> {
  const url = `${ERGAST_BASE}/${year}/${round}/drivers/${driverId}/laps.json?limit=1000`;
  const { data, error } = await safeFetch(url, cacheOptions);
  if (error || !data) return [];
  const race = data?.MRData?.RaceTable?.Races?.[0];
  return race?.Laps || [];
}

// ── Pit stops ──────────────────────────────────────────────────

export async function fetchPitStops(year: number = 2026, round: number = 1): Promise<any[]> {
  const url = `${ERGAST_BASE}/${year}/${round}/pitstops.json`;
  const { data, error } = await safeFetch(url, cacheOptions);
  if (error || !data) return [];
  const race = data?.MRData?.RaceTable?.Races?.[0];
  return race?.PitStops || [];
}

// ── Constructors list ──────────────────────────────────────────

export async function fetchConstructors(year: number = 2026): Promise<any[]> {
  const url = `${ERGAST_BASE}/${year}/constructors.json`;
  const { data, error } = await safeFetch(url, cache1h);
  if (error || !data) return [];
  return data?.MRData?.ConstructorTable?.Constructors || [];
}

// ── Circuits ───────────────────────────────────────────────────

export async function fetchCircuits(year: number = 2026): Promise<any[]> {
  const url = `${ERGAST_BASE}/${year}/circuits.json`;
  const { data, error } = await safeFetch(url, cache1h);
  if (error || !data) return [];
  return data?.MRData?.CircuitTable?.Circuits || [];
}

// ── Zod helpers (available for future use) ─────────────────────

export function validateApiResponse<T>(data: unknown, schema: any): T | null {
  try {
    return schema.parse(data) as T;
  } catch (err: any) {
    console.warn('API validation failed:', err?.issues?.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', '));
    return null;
  }
}
