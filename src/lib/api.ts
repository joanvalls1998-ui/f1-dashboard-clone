// F1 Data API Service - Uses Jolpica (Ergast fork) and OpenF1
// Base URLs: https://api.jolpi.ca/ergast/f1 | https://api.openf1.org/v1

import { getTeamColor } from './f1-assets';

const ERGAST_BASE = 'https://api.jolpi.ca/ergast/f1';
const OPENF1_BASE = 'https://api.openf1.org/v1';

// Driver mapping for 2026 season
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

// Fetch driver standings from Ergast
export async function fetchDriverStandings(year: number = 2026): Promise<Driver[]> {
  try {
    const response = await fetch(`${ERGAST_BASE}/${year}/driverstandings.json`);
    const data = await response.json();
    
    const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    
    return standings.map((item: any, index: number) => ({
      position: parseInt(item.position),
      abbreviation: item.Driver.code,
      fullName: `${item.Driver.givenName} ${item.Driver.familyName}`,
      team: item.Constructors[0].name,
      points: parseInt(item.points),
      driverId: item.Driver.driverId,
      number: item.Driver.permanentNumber || item.Driver.code,
      nationality: item.Driver.nationality,
    }));
  } catch (error) {
    console.error('Error fetching driver standings:', error);
    return [];
  }
}

// Fetch constructor standings from Ergast
export async function fetchConstructorStandings(year: number = 2026): Promise<Constructor[]> {
  try {
    const response = await fetch(`${ERGAST_BASE}/${year}/constructorstandings.json`);
    const data = await response.json();
    
    const standings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    
    return standings.map((item: any, index: number) => ({
      position: parseInt(item.position),
      name: item.Constructor.name,
      points: parseInt(item.points),
      wins: parseInt(item.wins),
      drivers: [], // Will be populated from driver standings
      color: getTeamColor(item.Constructor.name),
    }));
  } catch (error) {
    console.error('Error fetching constructor standings:', error);
    return [];
  }
}

// Fetch race calendar from Ergast
export async function fetchRaceCalendar(year: number = 2026): Promise<Race[]> {
  try {
    const response = await fetch(`${ERGAST_BASE}/${year}.json`);
    const data = await response.json();
    
    const races = data.MRData.RaceTable.Races;
    
    return races.map((race: any, index: number) => ({
      round: race.round,
      name: race.raceName.replace(' Grand Prix', ' GP'),
      country: race.Circuit.Location.country,
      city: race.Circuit.Location.locality,
      circuit: race.Circuit.circuitName,
      date: new Date(race.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: new Date(race.date) < new Date() ? 'completed' as const : 'upcoming' as const,
      lat: parseFloat(race.Circuit.Location.lat),
      lng: parseFloat(race.Circuit.Location.long),
    }));
  } catch (error) {
    console.error('Error fetching race calendar:', error);
    return [];
  }
}

// Fetch latest race results
export async function fetchLatestRaceResults(): Promise<any[]> {
  try {
    const response = await fetch(`${ERGAST_BASE}/current/last/results.json`);
    const data = await response.json();
    
    if (!data.MRData.RaceTable.Races || data.MRData.RaceTable.Races.length === 0) {
      return [];
    }
    
    const race = data.MRData.RaceTable.Races[0];
    return race.Results.map((result: any) => ({
      position: result.position,
      abbreviation: result.Driver.code,
      fullName: `${result.Driver.givenName} ${result.Driver.familyName}`,
      team: result.Constructor.name,
      points: result.points === '0' ? 0 : parseInt(result.points),
      status: result.status,
      laps: result.laps,
      time: result.Time?.time || null,
      fastestLap: result.FastestLap?.rank === '1',
    }));
  } catch (error) {
    console.error('Error fetching latest race results:', error);
    return [];
  }
}

// Fetch sessions from OpenF1
export async function fetchSessions(year: number = 2026): Promise<Session[]> {
  try {
    const response = await fetch(`${OPENF1_BASE}/sessions?year=${year}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
}

// Get current/live session from OpenF1
export async function getCurrentSession(): Promise<Session | null> {
  try {
    const now = new Date().toISOString();
    const response = await fetch(`${OPENF1_BASE}/sessions?date_start<=${now}&date_end>=${now}&is_cancelled=false`);
    const data = await response.json();
    
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching current session:', error);
    return null;
  }
}

// Get upcoming sessions
export async function getUpcomingSessions(limit: number = 5): Promise<Session[]> {
  try {
    const now = new Date().toISOString();
    const response = await fetch(`${OPENF1_BASE}/sessions?date_start>=${now}&is_cancelled=false&limit=${limit}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching upcoming sessions:', error);
    return [];
  }
}
