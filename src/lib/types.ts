// Shared TypeScript interfaces for F1 Dashboard
// Consolidates interfaces from multiple components

// ============================================
// DRIVER & TEAM INTERFACES
// ============================================

export interface Driver {
  number: number;
  code: string;
  name: string;
  team: string;
  teamColor: string;
  country: string;
  countryCode: string;
  headshot: string;
  podiums?: number;
  wins?: number;
  championships?: number;
  points: number;
}

export interface Team {
  name: string;
  color: string;
  drivers: TeamDriver[];
}

export interface TeamDriver {
  position: number;
  abbreviation: string;
  fullName: string;
  team: string;
  points: number;
}

export interface SeasonDriver {
  driverId: string;
  abbreviation: string;
  fullName: string;
  team: string;
  teamColor: string;
  colorClass?: string;
  number?: string;
  nationality?: string;
  position: number;
  points: number;
  wins?: number;
  podiums?: number;
  fastestLaps?: number;
}

export interface SeasonTeam {
  key: string;
  name: string;
  officialName: string;
  colorClass: string;
  drivers: string[];
  color?: string;
}

// ============================================
// RACE & SESSION INTERFACES
// ============================================

export interface Session {
  sessionKey?: string;
  sessionName?: string;
  sessionType?: string;
  countryCode?: string;
  country?: string;
  locality?: string;
  circuitName?: string;
  dateStart?: string;
  dateEnd?: string;
  gmtOffset?: string;
}

export interface LapEntry {
  lapNumber: number;
  driverNumber?: number;
  driverCode?: string;
  position?: number;
  lapTime?: number | null;
  lapTimeStr?: string;
  pitStop?: number;
  isPersonalBest?: boolean;
  isFastestLap?: boolean;
  timestamp?: string;
}

export interface StintInfo {
  stintNumber: number;
  lapStart: number;
  lapEnd: number;
  tireCompound?: string;
  tireAge?: number;
}

export interface PositionRecord {
  driver_number: number;
  driver_name: string;
  driver_code?: string;
  team_name: string;
  team_color: string;
  positions_by_lap: number[];
  total_laps: number;
  final_position: number;
  fastest_lap: number;
  fastest_lap_time?: string;
  pit_stops: number;
  status?: string;
}

export interface IntervalData {
  driverCode: string;
  driverName: string;
  teamName: string;
  teamColor: string;
  position: number;
  interval: number | null;
  intervalStr?: string;
  gapToLeader: number | null;
  gapToLeaderStr?: string;
  lapTime?: number;
  lastLapTime?: number;
  positionChange?: number;
}

export interface DNFRecord {
  driverCode: string;
  driverName: string;
  teamName: string;
  reason?: string;
  lap?: number;
}

export interface WeatherData {
  airTemp?: number;
  trackTemp?: number;
  humidity?: number;
  windSpeed?: number;
  windDirection?: number;
  pressure?: number;
  rainfall?: number;
  sessionKey?: string;
  date?: string;
}

export interface CircuitInfo {
  circuitId?: string;
  circuitName: string;
  circuitShortName?: string;
  location: string;
  country: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  url?: string;
  imageUrl?: string;
}

// ============================================
// STANDINGS & RESULTS INTERFACES
// ============================================

export interface DriverStanding {
  position: number;
  abbreviation: string;
  fullName: string;
  team: string;
  points: number;
  wins: number;
  driverId: string;
  number: string;
  nationality: string;
}

export interface ConstructorStanding {
  position: number;
  teamName: string;
  teamColor?: string;
  points: number;
  wins: number;
}

export interface RaceResult {
  position: number;
  driverCode: string;
  driverName: string;
  team: string;
  points: number;
  status: string;
  laps?: number;
  time?: string;
  fastestLap?: boolean;
  gridPosition?: number;
}

export interface QualifyingResult {
  position: number;
  driverCode: string;
  driverName: string;
  team: string;
  Q1?: string;
  Q2?: string;
  Q3?: string;
  gap?: string;
}

// ============================================
// CONSISTENCY & STATS INTERFACES
// ============================================

export interface ConsistencyMetric {
  driver_name: string;
  abbreviation: string;
  team_name: string;
  team_color: string;
  position: number;
  lap_time_stddev: number;
  lap_time_avg: number;
  fastest_lap: number;
  slowest_lap: number;
  avg_finish_position: number;
  position_stddev: number;
  best_finish: number;
  worst_finish: number;
  races_finished: number;
  races_started: number;
  dnfs: number;
  points_total: number;
  points_per_race: number;
  points_stddev: number;
}

export interface SeasonPoint {
  driver_name: string;
  team_color: string;
  rounds: number[];
  points_by_round: { round: number; points: number }[];
  total_points: number;
}

// ============================================
// API RESPONSE INTERFACES
// ============================================

export interface ErgastRaceResponse {
  raceName: string;
  circuit: string;
  location: string;
  country: string;
  date: string;
  round: number;
  Results?: ErgastResult[];
}

export interface ErgastResult {
  position: string;
  Driver: {
    code: string;
    givenName: string;
    familyName: string;
    driverId: string;
    permanentNumber?: string;
    nationality: string;
  };
  Constructor: {
    name: string;
    constructorId: string;
  };
  Time?: {
    time: string;
  };
  laps: string;
  status: string;
  points: string;
  FastestLap?: {
    rank: string;
    lap: string;
    Time?: {
      time: string;
    };
  };
}

export interface LapComparison {
  lap_number: number;
  ver_lap_time?: number | null;
  nor_lap_time?: number | null;
  lec_lap_time?: number | null;
  [key: string]: number | null | undefined;
}
