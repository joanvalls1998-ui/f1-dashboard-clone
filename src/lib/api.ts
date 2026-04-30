const BASE_URL = "https://api.openf1.org/v1";

export interface Session {
  session_key: number;
  session_type: string;
  session_name: string;
  date_start: string;
  date_end: string;
  meeting_key: number;
  circuit_key: number;
  circuit_short_name: string;
  country_key: number;
  country_code: string;
  country_name: string;
  location: string;
  gmt_offset: string;
  year: number;
  is_cancelled: boolean;
}

export interface Driver {
  meeting_key: number;
  session_key: number;
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  first_name: string;
  last_name: string;
  headshot_url: string;
  country_code: string;
}

export interface Meeting {
  meeting_key: number;
  meeting_name: string;
  location: string;
  country_key: number;
  country_code: string;
  country_name: string;
  circuit_key: number;
  circuit_short_name: string;
  date_start: string;
  year: number;
}

export interface RaceControl {
  driver_number: number;
  session_key: number;
  date: string;
  flag: string;
  category: string;
  message: string;
  lap_number: number | null;
}

export interface Weather {
  meeting_key: number;
  session_key: number;
  date: string;
  air_temp: number;
  humidity: number;
  pressure: number;
  rainfall: string;
  track_temp: number;
  wind_direction: number;
  wind_speed: number;
}

export async function getSessions(year: number): Promise<Session[]> {
  const res = await fetch(`${BASE_URL}/sessions?year=${year}&elasticache_life=3600`);
  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json();
}

export async function getLatestRaceSession(year: number): Promise<Session | null> {
  const sessions = await getSessions(year);
  // Find the most recent race session
  const raceSessions = sessions.filter(s => s.session_type === "Race");
  if (raceSessions.length === 0) return null;
  
  // Sort by date_start descending
  raceSessions.sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime());
  return raceSessions[0];
}

export async function getDrivers(sessionKey: number): Promise<Driver[]> {
  const res = await fetch(`${BASE_URL}/drivers?session_key=${sessionKey}&elasticache_life=3600`);
  if (!res.ok) throw new Error("Failed to fetch drivers");
  return res.json();
}

export async function getMeetings(year: number): Promise<Meeting[]> {
  const res = await fetch(`${BASE_URL}/meetings?year=${year}&elasticache_life=3600`);
  if (!res.ok) throw new Error("Failed to fetch meetings");
  return res.json();
}

export async function getRaceControl(sessionKey: number): Promise<RaceControl[]> {
  const res = await fetch(`${BASE_URL}/race_control?session_key=${sessionKey}&elasticache_life=60`);
  if (!res.ok) throw new Error("Failed to fetch race control");
  return res.json();
}

export async function getWeather(sessionKey: number): Promise<Weather[]> {
  const res = await fetch(`${BASE_URL}/weather?session_key=${sessionKey}&elasticache_life=60`);
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
}

// Mock data for standings (since OpenF1 doesn't provide standings directly)
export interface DriverStanding {
  position: number;
  driver_number: number;
  broadcast_name: string;
  team_name: string;
  team_colour: string;
  nationality: string;
  points: number;
  wins: number;
  headshot_url: string;
}

export interface ConstructorStanding {
  position: number;
  team_name: string;
  team_colour: string;
  points: number;
  wins: number;
}

// 2024 mock standings (real data would come from an API)
export const mockDriverStandings2024: DriverStanding[] = [
  { position: 1, driver_number: 1, broadcast_name: "M VERSTAPPEN", team_name: "Red Bull Racing", team_colour: "3671c6", nationality: "NED", points: 437, wins: 19, headshot_url: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png" },
  { position: 2, driver_number: 4, broadcast_name: "L NORRIS", team_name: "McLaren", team_colour: "ff8000", nationality: "GBR", points: 374, wins: 4, headshot_url: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/1col/image.png" },
  { position: 3, driver_number: 16, broadcast_name: "C LECLERC", team_name: "Ferrari", team_colour: "e8002d", nationality: "MON", points: 356, wins: 3, headshot_url: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/1col/image.png" },
  { position: 4, driver_number: 55, broadcast_name: "C SAINZ", team_name: "Ferrari", team_colour: "e8002d", nationality: "ESP", points: 290, wins: 2, headshot_url: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/1col/image.png" },
  { position: 5, driver_number: 81, broadcast_name: "O PIASTRI", team_name: "McLaren", team_colour: "ff8000", nationality: "AUS", points: 272, wins: 2, headshot_url: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/1col/image.png" },
  { position: 6, driver_number: 11, broadcast_name: "S PEREZ", team_name: "Red Bull Racing", team_colour: "3671c6", nationality: "MEX", points: 234, wins: 1, headshot_url: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/1col/image.png" },
  { position: 7, driver_number: 14, broadcast_name: "F ALONSO", team_name: "Aston Martin", team_colour: "229971", nationality: "ESP", points: 181, wins: 0, headshot_url: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/1col/image.png" },
  { position: 8, driver_number: 44, broadcast_name: "L HAMILTON", team_name: "Mercedes", team_colour: "27f4d2", nationality: "GBR", points: 117, wins: 0, headshot_url: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/1col/image.png" },
  { position: 9, driver_number: 63, broadcast_name: "G RUSSELL", team_name: "Mercedes", team_colour: "27f4d2", nationality: "GBR", points: 115, wins: 2, headshot_url: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/1col/image.png" },
  { position: 10, driver_number: 31, broadcast_name: "E OCON", team_name: "Alpine", team_colour: "ff87bc", nationality: "FRA", points: 62, wins: 0, headshot_url: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png.transform/1col/image.png" },
];

export const mockConstructorStandings2024: ConstructorStanding[] = [
  { position: 1, team_name: "McLaren", team_colour: "ff8000", points: 646, wins: 6 },
  { position: 2, team_name: "Ferrari", team_colour: "e8002d", points: 646, wins: 5 },
  { position: 3, team_name: "Red Bull Racing", team_colour: "3671c6", points: 671, wins: 20 },
  { position: 4, team_name: "Mercedes", team_colour: "27f4d2", points: 232, wins: 2 },
  { position: 5, team_name: "Aston Martin", team_colour: "229971", points: 181, wins: 0 },
  { position: 6, team_name: "Alpine", team_colour: "ff87bc", points: 120, wins: 0 },
  { position: 7, team_name: "RB", team_colour: "6692ff", points: 46, wins: 0 },
  { position: 8, team_name: "Williams", team_colour: "64c4ff", points: 27, wins: 0 },
  { position: 9, team_name: "Kick Sauber", team_colour: "52e252", points: 4, wins: 0 },
  { position: 10, team_name: "Haas F1 Team", team_colour: "b6babd", points: 0, wins: 0 },
];

// Calendar data
export interface Race {
  round: number;
  country: string;
  locality: string;
  officialName: string;
  date: string;
  sessionKey: number;
}

export const calendar2024: Race[] = [
  { round: 1, country: "Bahrain", locality: "Sakhir", officialName: "Gulf Air Bahrain Grand Prix", date: "2024-03-02", sessionKey: 9472 },
  { round: 2, country: "Saudi Arabia", locality: "Jeddah", officialName: "STC Saudi Arabian Grand Prix", date: "2024-03-09", sessionKey: 9480 },
  { round: 3, country: "Australia", locality: "Melbourne", officialName: "Australian Grand Prix", date: "2024-03-24", sessionKey: 9488 },
  { round: 4, country: "Japan", locality: "Suzuka", officialName: "Meadow Fuji Racing Grand Prix", date: "2024-04-07", sessionKey: 9496 },
  { round: 5, country: "China", locality: "Shanghai", officialName: "Lenovo Chinese Grand Prix", date: "2024-04-21", sessionKey: 9673 },
  { round: 6, country: "United States", locality: "Miami", officialName: "Crypto.com Miami Grand Prix", date: "2024-05-05", sessionKey: 9507 },
  { round: 7, country: "Italy", locality: "Imola", officialName: "MSC Cruises Italian Grand Prix", date: "2024-05-19", sessionKey: 9515 },
  { round: 8, country: "Monaco", locality: "Monaco", officialName: "Grand Prix de Monaco", date: "2024-05-26", sessionKey: 9523 },
  { round: 9, country: "Canada", locality: "Montréal", officialName: "Pirelli Grand Prix de Québec", date: "2024-06-09", sessionKey: 9531 },
  { round: 10, country: "Spain", locality: "Barcelona", officialName: "Pirelli Gran Premio de España", date: "2024-06-23", sessionKey: 9539 },
  { round: 11, country: "Austria", locality: "Spielberg", officialName: "BWT Austrian Grand Prix", date: "2024-06-30", sessionKey: 9550 },
  { round: 12, country: "United Kingdom", locality: "Silverstone", officialName: "Aramco British Grand Prix", date: "2024-07-07", sessionKey: 9558 },
  { round: 13, country: "Hungary", locality: "Budapest", officialName: "Rolex Hungarian Grand Prix", date: "2024-07-21", sessionKey: 9566 },
  { round: 14, country: "Belgium", locality: "Spa-Francorchamps", officialName: "Belgian Grand Prix", date: "2024-07-28", sessionKey: 9574 },
  { round: 15, country: "Netherlands", locality: "Zandvoort", officialName: "Heineken Dutch Grand Prix", date: "2024-08-25", sessionKey: 9582 },
  { round: 16, country: "Italy", locality: "Monza", officialName: " Pirelli Gran Premio d'Italia", date: "2024-09-01", sessionKey: 9590 },
  { round: 17, country: "Azerbaijan", locality: "Baku", officialName: " Azerbaijan Grand Prix", date: "2024-09-15", sessionKey: 9598 },
  { round: 18, country: "Singapore", locality: "Marina Bay", officialName: "Singapore Grand Prix", date: "2024-09-22", sessionKey: 9606 },
  { round: 19, country: "United States", locality: "Austin", officialName: "Coinbase United States Grand Prix", date: "2024-10-20", sessionKey: 9617 },
  { round: 20, country: "Mexico", locality: "Mexico City", officialName: "Gran Premio de la Ciudad de México", date: "2024-10-27", sessionKey: 9625 },
  { round: 21, country: "Brazil", locality: "São Paulo", officialName: " Lenovo Grande Prêmio de São Paulo", date: "2024-11-03", sessionKey: 9636 },
  { round: 22, country: "United States", locality: "Las Vegas", officialName: "Las Vegas Grand Prix", date: "2024-11-24", sessionKey: 9644 },
  { round: 23, country: "Qatar", locality: "Lusail", officialName: "Qatar Airways Qatar Grand Prix", date: "2024-12-01", sessionKey: 9655 },
  { round: 24, country: "Abu Dhabi", locality: "Yas Island", officialName: "Etihad Airways Abu Dhabi Grand Prix", date: "2024-12-08", sessionKey: 9662 },
];
