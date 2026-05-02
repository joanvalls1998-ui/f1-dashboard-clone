// Unified team colors and team data for 2026 F1 season
// Replaces duplicate TEAM_COLORS in EngineerDashboard, FavoritoDashboard, RaceMode, HomeIntel

import { drivers2026, teams2026 } from './rc-data/grid';

// Official 2026 team colors (hex values) - keyed by team name
export const TEAM_COLORS: Record<string, string> = {
  Mercedes: '#27F4D2',
  Ferrari: '#E8002D',
  McLaren: '#FF8000',
  'Red Bull Racing': '#3671C6',
  'Red Bull': '#3671C6',
  'Racing Bulls': '#203F94',
  'RB F1 Team': '#203F94',
  'Haas F1 Team': '#B6BABD',
  Haas: '#B6BABD',
  Alpine: '#FF87BC',
  'Alpine F1 Team': '#FF87BC',
  Audi: '#C80029',
  Williams: '#64C4FF',
  'Aston Martin': '#0072FF',
  Cadillac: '#C80029',
  'Cadillac F1 Team': '#C80029',
  'Kick Sauber': '#52E252',
};

// Team colors keyed by colorClass (used in grid.ts driver data)
// This maps colorClass like 'mercedes', 'ferrari' to hex colors
export const TEAM_COLORS_BY_KEY: Record<string, string> = {
  mercedes: '#27f4d2',
  ferrari: '#ff1800',
  mclaren: '#ff8700',
  redbull: '#3671c6',
  haas: '#c92d28',
  rb: '#203f94',
  alpine: '#ff87bc',
  audi: '#e11a2b',
  williams: '#64c4ff',
  cadillac: '#c80029',
  aston: '#0072ff'
};

// Team color variants (with/without hash)
export const TEAM_COLORS_HEX: Record<string, string> = {
  Mercedes: '#27f4d2',
  Ferrari: '#ff1800',
  McLaren: '#ff8700',
  'Red Bull Racing': '#3671c6',
  'Red Bull': '#3671c6',
  'Racing Bulls': '#203f94',
  'RB F1 Team': '#203f94',
  'Haas F1 Team': '#b6babd',
  Haas: '#b6babd',
  Alpine: '#ff87bc',
  'Alpine F1 Team': '#ff87bc',
  Audi: '#c80029',
  Williams: '#64c4ff',
  'Aston Martin': '#0072ff',
  Cadillac: '#c80029',
  'Cadillac F1 Team': '#c80029',
  'Kick Sauber': '#52e252',
};

// Team data with drivers and colors - unified 2026 grid
export const TEAM_DATA = teams2026.map(team => ({
  key: team.key,
  name: team.name,
  officialName: team.officialName,
  color: TEAM_COLORS[team.name] || TEAM_COLORS[team.officialName] || '#666666',
  colorHex: TEAM_COLORS_HEX[team.name] || TEAM_COLORS_HEX[team.officialName] || '666666',
  drivers: team.drivers,
  colorClass: team.colorClass,
}));

// Get team color by team name (handles various team name formats)
export function getTeamColor(teamName: string): string {
  return TEAM_COLORS[teamName] || TEAM_COLORS_HEX[teamName] || '#666666';
}

// Get team color hex without hash
export function getTeamColorHex(teamName: string): string {
  const color = TEAM_COLORS[teamName] || TEAM_COLORS_HEX[teamName];
  return color ? color.replace('#', '') : '666666';
}

// Get driver info by code
export function getDriverByCode(code: string) {
  return drivers2026.find(d => d.shortCode === code);
}

// Get team info by team name
export function getTeamByName(name: string) {
  return TEAM_DATA.find(t => t.name === name || t.officialName === name);
}
