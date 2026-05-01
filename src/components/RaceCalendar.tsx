"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Loader2, Search, XCircle, Flag } from "lucide-react";
import { fetchRaceCalendar } from "@/lib/api";
import { circuitImages } from "@/lib/f1-assets";
import Image from "next/image";

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
}

export function RaceCalendar() {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showPast, setShowPast] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  const filteredRaces = races.filter((race) => {
    const matchesSearch = race.country.toLowerCase().includes(search.toLowerCase()) ||
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
      case 'completed': return 'text-green-500';
      case 'upcoming': return 'text-blue-500';
      case 'cancelled': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
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
            className="w-full bg-[#171717] text-white pl-10 pr-4 py-2 rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <XCircle className="w-4 h-4 text-gray-500 hover:text-white" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowPast(!showPast)}
          className={`px-4 py-2 rounded-lg border ${
            showPast
              ? "bg-blue-500/20 border-blue-500 text-blue-400"
              : "bg-[#171717] border-gray-800 text-gray-400"
          }`}
        >
          {showPast ? "All Races" : "Upcoming Only"}
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRaces.map((race) => (
          <div
            key={race.round}
            className="bg-[#171717] rounded-xl overflow-hidden hover:bg-[#1f1f1f] transition-colors"
          >
            {/* Circuit image */}
            <div className="relative h-32 bg-[#0a0a0a]">
              {circuitImages[race.country] ? (
                <img
                  src={circuitImages[race.country]}
                  alt={race.circuit}
                  className="w-full h-full object-cover opacity-70"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-gray-700" />
                </div>
              )}
              <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded">
                <span className="text-white font-bold text-sm">Round {race.round}</span>
              </div>
              <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded">
                <span className={`text-xs font-medium ${getStatusColor(race.status)}`}>
                  {race.status === 'completed' ? '✓ Completed' :
                   race.status === 'cancelled' ? '✕ Cancelled' : 'Upcoming'}
                </span>
              </div>
            </div>

            {/* Race info */}
            <div className="p-4">
              <h3 className="text-white font-bold mb-1">{race.name}</h3>
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <MapPin className="w-3 h-3" />
                <span>{race.city}, {race.country}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar className="w-3 h-3" />
                <span>{race.date}</span>
              </div>

              {race.winner && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <div className="flex items-center gap-2">
                    <Flag className="w-3 h-3 text-yellow-500" />
                    <span className="text-gray-400 text-xs">Winner:</span>
                    <span className="text-white text-sm font-medium">{race.winner}</span>
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
  );
}
