'use client';

import { useState, useEffect } from 'react';
import { Wrench, Clock, AlertCircle, Timer } from 'lucide-react';

interface PitStop {
  driver: string;
  abbreviation: string;
  team: string;
  lap: number;
  stop: number;
  time: string;
  duration: string;
}

const driverIdToAbbrev: Record<string, string> = {
  "max_verstappen": "VER", "lando_norris": "NOR", "charles_leclerc": "LEC",
  "oscar_piastri": "PIA", "carlos_sainz": "SAI", "kimi_antonelli": "ANT",
  "george_russell": "RUS", "lewis_hamilton": "HAM", "fernando_alonso": "ALO",
  "lance_stroll": "STR", "yuki_tsunoda": "TSU", "lawson": "LAW",
  "isack_hadjar": "HAD", "pierre_gasly": "GAS", "esteban_ocon": "OCO",
  "nico_hulkenberg": "HUL", "kevin_magnussen": "MAG", "alex_albon": "ALB",
  "valtteri_bottas": "BOT", "zhou_guanyu": "ZHO", "gabriel_bortoleto": "BOR",
  "callum_colapinto": "COL",
};

const RACE = { round: 4, name: 'Japanese Grand Prix', year: 2026 };

export default function PitStopsPage() {
  const [pitStops, setPitStops] = useState<PitStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPitStops() {
      try {
        const res = await fetch(`https://api.jolpi.ca/ergast/f1/${RACE.year}/${RACE.round}/pitstops.json`, { signal: AbortSignal.timeout(8000) });
        if (res.ok) {
          const data = await res.json();
          const race = data.MRData?.RaceTable?.Races?.[0];
          if (race?.PitStops && race.PitStops.length > 0) {
            // Get driver + constructor from qualifying results
            const resultsRes = await fetch(`https://api.jolpi.ca/ergast/f1/${RACE.year}/${RACE.round}/qualifying.json`, { signal: AbortSignal.timeout(5000) });
            const driverTeamMap: Record<string, string> = {};
            if (resultsRes.ok) {
              const qData = await resultsRes.json();
              const qRace = qData.MRData?.RaceTable?.Races?.[0];
              qRace?.QualifyingResults?.forEach((r: any) => {
                driverTeamMap[r.Driver.driverId] = r.Constructor.name;
              });
            }
            const mapped: PitStop[] = race.PitStops.map((s: any) => {
              const driverId = s.driverId || '';
              const abbrev = driverIdToAbbrev[driverId] || driverId.slice(0, 3).toUpperCase();
              return {
                driver: abbrev,
                abbreviation: abbrev,
                team: driverTeamMap[driverId] || 'Unknown',
                lap: parseInt(s.lap) || 0,
                stop: parseInt(s.stop) || 1,
                time: s.time || '',
                duration: s.duration || '0.000',
              };
            });
            mapped.sort((a, b) => a.lap - b.lap || a.stop - b.stop);
            setPitStops(mapped);
            setLoading(false);
            return;
          }
        }
        setError(true);
      } catch (e) {
        console.error('Error fetching pit stops:', e);
        setError(true);
      }
      setPitStops([]); setError(false);
      setLoading(false);
    }
    fetchPitStops();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" role="status" aria-label="Loading pit stops">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
      </div>
    );
  }

  const sortedByTime = [...pitStops].sort((a, b) => parseFloat(a.duration) - parseFloat(b.duration));
  const stopsByLap = [...pitStops].sort((a, b) => a.lap - b.lap);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Wrench className="w-6 h-6 text-orange-500" />
        <h1 className="text-2xl font-bold">Pit Stop Analysis</h1>
      </div>
      <p className="var(--text-muted) text-sm">{RACE.name} {RACE.year} — {pitStops.length} pit stops recorded</p>

      {error && (
        <div className="flex items-center gap-2 text-sm text-amber-500 bg-amber-500/10 rounded-lg px-4 py-2" role="alert">
          <AlertCircle className="w-4 h-4" />
          Using demo data — real data unavailable
        </div>
      )}

      {/* Timeline */}
      <div className="bg-card rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-500" />
          Pit Stop Timeline
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Pit stops by lap">
            <thead>
              <tr className="border-b">
                <th scope="col" className="text-left p-3 font-medium">Lap</th>
                <th scope="col" className="text-left p-3 font-medium">Driver</th>
                <th scope="col" className="text-center p-3 font-medium">Stop</th>
                <th scope="col" className="text-right p-3 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              {stopsByLap.map((stop, i) => (
                <tr key={i} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-3"><span className="font-mono font-medium">{stop.lap}</span></td>
                  <td className="p-3">
                    <div className="font-medium">{stop.driver}</div>
                    <div className="text-xs var(--text-muted)">{stop.team}</div>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 bg-muted rounded text-xs font-medium">#{stop.stop}</span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="font-mono font-bold text-orange-400">{stop.duration}s</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fastest */}
      <div className="bg-card rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Timer className="w-5 h-5 text-green-500" />
          Fastest Pit Stops
        </h2>
        <div className="space-y-2">
          {sortedByTime.slice(0, 5).map((stop, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i === 0 ? 'bg-yellow-500 text-black' :
                i === 1 ? 'bg-gray-400 text-black' :
                i === 2 ? 'bg-amber-600 var(--text-primary)' :
                'bg-muted'
              }`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="font-medium">{stop.driver}</div>
                <div className="text-xs var(--text-muted)">Lap {stop.lap} — {stop.team}</div>
              </div>
              <div className="font-mono text-xl font-bold text-green-400">
                {stop.duration}s
              </div>
            </div>
          ))}
        </div>
      </div>

      {pitStops.length === 0 && (
        <div className="text-center py-8 var(--text-muted) flex flex-col items-center gap-2" role="status">
          <AlertCircle className="w-8 h-8" />
          <p>No pit stop data available.</p>
        </div>
      )}
    </div>
  );
}
