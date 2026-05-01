"use client";

import { useState, useEffect } from "react";
import { Calendar, Trophy, MapPin, Loader2 } from "lucide-react";

interface RaceResult {
  round: number;
  raceName: string;
  country: string;
  circuit: string;
  date: string;
  winner?: string;
  winnerTeam?: string;
  winnerTime?: string;
}

const ERGAST_BASE = 'https://api.jolpi.ca/ergast/f1';

export function SeasonHistory() {
  const [races, setRaces] = useState<RaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSeasonData() {
      try {
        // Fetch race calendar and results for 2026
        const [calendarResponse, resultsResponse] = await Promise.all([
          fetch(`${ERGAST_BASE}/2026.json`),
          fetch(`${ERGAST_BASE}/2026/results.json`)
        ]);

        const calendarData = await calendarResponse.json();
        const resultsData = await resultsResponse.json();

        const racesList = calendarData.MRData.RaceTable.Races;
        const resultsList = resultsData.MRData.RaceTable.Races;

        // Create a map of round to results
        const resultsMap = new Map();
        resultsList.forEach((race: any) => {
          if (race.Results && race.Results.length > 0) {
            const winner = race.Results[0];
            resultsMap.set(race.round, {
              winner: `${winner.Driver.givenName} ${winner.Driver.familyName}`,
              winnerTeam: winner.Constructor.name,
              winnerTime: winner.Time?.time || winner.status,
              winnerCode: winner.Driver.code,
            });
          }
        });

        // Combine calendar with results
        const combinedRaces: RaceResult[] = racesList.map((race: any) => ({
          round: parseInt(race.round),
          raceName: race.raceName.replace(' Grand Prix', ' GP').replace('United States Grand Prix', 'USA GP'),
          country: race.Circuit.Location.country,
          circuit: race.Circuit.circuitName,
          date: new Date(race.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          ...resultsMap.get(race.round)
        }));

        setRaces(combinedRaces);
      } catch (err) {
        console.error('Error fetching season data:', err);
        setError('Failed to load season data');
      }
      setLoading(false);
    }

    fetchSeasonData();
  }, []);

  // Country flag emoji mapping
  const getCountryFlag = (country: string): string => {
    const flags: Record<string, string> = {
      'Australia': '🇦🇺',
      'China': '🇨🇳',
      'Japan': '🇯🇵',
      'USA': '🇺🇸',
      'Canada': '🇨🇦',
      'Monaco': '🇲🇨',
      'Spain': '🇪🇸',
      'UK': '🇬🇧',
      'Belgium': '🇧🇪',
      'Hungary': '🇭🇺',
      'Netherlands': '🇳🇱',
      'Italy': '🇮🇹',
      'Azerbaijan': '🇦🇿',
      'Singapore': '🇸🇬',
      'Mexico': '🇲🇽',
      'Brazil': '🇧🇷',
      'Qatar': '🇶🇦',
      'UAE': '🇦🇪',
      'Bahrain': '🇧🇭',
      'Saudi Arabia': '🇸🇦',
      'France': '🇫🇷',
      'Portugal': '🇵🇹',
      'Turkey': '🇹🇷',
      'Russia': '🇷🇺',
      'Poland': '🇵🇱',
      'Switzerland': '🇨🇭',
      'Sweden': '🇸🇪',
      'Argentina': '🇦🇷',
    };
    return flags[country] || '🏁';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="w-4 h-4" />
        <span>23 Rounds</span>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-sm font-medium">
          <div className="col-span-1">Round</div>
          <div className="col-span-2">Country</div>
          <div className="col-span-3">Circuit</div>
          <div className="col-span-4">Winner</div>
          <div className="col-span-2">Date</div>
        </div>

        <div className="divide-y">
          {races.map((race) => (
            <div
              key={race.round}
              className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/50 transition-colors items-center"
            >
              <div className="col-span-1">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {race.round}
                </span>
              </div>
              
              <div className="col-span-2 flex items-center gap-2">
                <span className="text-2xl">{getCountryFlag(race.country)}</span>
                <span className="font-medium truncate">{race.country}</span>
              </div>
              
              <div className="col-span-3">
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <span className="truncate text-muted-foreground">{race.circuit}</span>
                </div>
              </div>
              
              <div className="col-span-4">
                {race.winner ? (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{race.winner}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {race.winnerTeam} • {race.winnerTime}
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">Upcoming</span>
                )}
              </div>
              
              <div className="col-span-2 text-sm text-muted-foreground">
                {race.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
