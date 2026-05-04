"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Loader2, Search, XCircle, Flag, Globe } from "lucide-react";
import { fetchRaceCalendar } from "@/lib/api";
import { circuitImages } from "@/lib/f1-assets";
import { CircuitGlobe } from "@/components/CircuitGlobe";

interface Race {
  round: number;
  name: string;
  country: string;
  city: string;
  date: string;
  circuit: string;
  status: 'completed' | 'upcoming' | 'cancelled';
  winner?: string;
  winnerTeam?: string;
  lat?: number;
  lng?: number;
}

export function RaceCalendar() {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showPast, setShowPast] = useState(true);
  const [showGlobe, setShowGlobe] = useState(false);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  useEffect(() => {
    async function loadCalendar() {
      try {
        const data = await fetchRaceCalendar(2026);
        setRaces(data);
      } catch (error) {
        console.error("Error loading calendar:", error);
      }
      setLoading(false);
    }
    loadCalendar();
  }, []);

  const handleViewGlobe = (race: Race) => {
    setSelectedRace(race);
    setShowGlobe(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--bg-overlay)', borderTopColor: 'var(--accent-red)' }} />
      </div>
    );
  }

  const filteredRaces = races.filter((race) => {
    const matchesSearch =
      race.country.toLowerCase().includes(search.toLowerCase()) ||
      race.name.toLowerCase().includes(search.toLowerCase()) ||
      race.city.toLowerCase().includes(search.toLowerCase());

    if (!showPast) {
      const raceDate = new Date(race.date);
      return matchesSearch && raceDate >= new Date();
    }
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'upcoming': return '#3b82f6';
      case 'cancelled': return '#ef4444';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <>
      {showGlobe && (
        <CircuitGlobe
          races={races}
          selectedRace={selectedRace}
          onSelectRace={setSelectedRace}
          onClose={() => setShowGlobe(false)}
        />
      )}

      <div className="space-y-4">
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by country, city or race name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search races by country, city or race name"
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-[var(--bg-surface)] focus:outline-none"
              style={{ borderColor: 'var(--bg-overlay)', color: 'var(--text-primary)' }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <XCircle className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowPast(!showPast)}
            className="btn-ghost text-sm"
            style={{ borderColor: showPast ? 'var(--accent-blue)' : 'var(--bg-overlay)' }}
          >
            {showPast ? "All Races" : "Upcoming Only"}
          </button>
          <button
            onClick={() => { setSelectedRace(null); setShowGlobe(true); }}
            className="btn-ghost text-sm flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            Globe View
          </button>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRaces.map((race) => (
            <div
              key={race.round}
              className="card card-interactive overflow-hidden"
            >
              {/* Circuit image */}
              <div className="relative h-32 overflow-hidden rounded-lg" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                {circuitImages[race.country] ? (
                  <img
                    src={circuitImages[race.country]}
                    alt={race.circuit}
                    className="w-full h-full object-cover opacity-70"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
                  </div>
                )}
                <div className="absolute top-2 left-2" style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: '6px' }}>
                  <span className="text-white font-bold text-sm">Round {race.round}</span>
                </div>
                <div className="absolute top-2 right-2" style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: '6px' }}>
                  <span className="text-xs font-medium" style={{ color: getStatusColor(race.status) }}>
                    {race.status === 'completed' ? '✓ Completed' :
                     race.status === 'cancelled' ? '✕ Cancelled' : 'Upcoming'}
                  </span>
                </div>
                {/* Globe button */}
                <button
                  onClick={() => handleViewGlobe(race)}
                  className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded text-xs text-white transition-colors"
                  style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                >
                  <Globe className="w-3 h-3" />
                  Map
                </button>
              </div>

              {/* Race info */}
              <div className="p-4">
                <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{race.name}</h3>
                <div className="flex items-center gap-2 text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                  <MapPin className="w-3 h-3" />
                  <span>{race.city}, {race.country}</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <Calendar className="w-3 h-3" />
                  <span>{race.date}</span>
                </div>

                {race.winner && (
                  <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--bg-overlay)' }}>
                    <div className="flex items-center gap-2">
                      <Flag className="w-3 h-3" style={{ color: '#eab308' }} />
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Winner:</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{race.winner}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredRaces.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">No races found</p>
          </div>
        )}
      </div>
    </>
  );
}
