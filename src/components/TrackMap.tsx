"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Map, MapPin, RefreshCw } from "lucide-react";
import { circuitImages } from "@/lib/f1-assets";
import { fetchRaceCalendar, Race } from "@/lib/api";

interface TrackMapProps {
  raceKey?: number; // Optional session_key from OpenF1
}

export function TrackMap({ raceKey }: TrackMapProps) {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [allRaces, setAllRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    async function loadRaces() {
      try {
        const races = await fetchRaceCalendar(2026);
        setAllRaces(races);
        
        // Find current/last completed race
        const now = new Date();
        const completedRaces = races.filter((r) => r.status === "completed");
        
        if (raceKey) {
          // Use specific race if provided
          const found = races.find((r) => r.round === raceKey);
          if (found) setSelectedRace(found);
        } else if (completedRaces.length > 0) {
          // Default to last completed race
          setSelectedRace(completedRaces[completedRaces.length - 1]);
        } else if (races.length > 0) {
          // Fallback to first upcoming race
          const upcoming = races.find((r) => r.status === "upcoming");
          if (upcoming) setSelectedRace(upcoming);
        }
      } catch (error) {
        console.error("Error loading races:", error);
      }
      setLoading(false);
    }

    loadRaces();
  }, [raceKey]);

  // Get circuit image URL from f1-assets
  const circuitImageUrl = selectedRace ? circuitImages[selectedRace.country] : null;

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold">Track Map</h2>
        </div>

        {/* Race selector */}
        <select
          value={selectedRace?.round || ""}
          onChange={(e) => {
            const race = allRaces.find((r) => r.round === parseInt(e.target.value));
            setSelectedRace(race || null);
            setImageError(false);
          }}
          aria-label="Select race to view track map"
          className="px-3 py-2 rounded-md border bg-background text-sm"
        >
          <option value="">Select a race</option>
          {allRaces.map((race) => (
            <option key={race.round} value={race.round}>
              Round {race.round}: {race.country} ({race.status})
            </option>
          ))}
        </select>
      </div>

      {/* Circuit Image Display */}
      {selectedRace ? (
        <div className="rounded-lg border bg-card overflow-hidden">
          {/* Circuit Info Header */}
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white text-xs font-bold">
                    R{selectedRace.round}
                  </span>
                  <h3 className="text-xl font-bold">{selectedRace.country}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    selectedRace.status === "completed" 
                      ? "bg-green-500/20 text-green-500" 
                      : "bg-blue-500/20 text-blue-500"
                  }`}>
                    {selectedRace.status === "completed" ? "Completed" : "Upcoming"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedRace.city}</span>
                  <span className="mx-1">•</span>
                  <span>{selectedRace.circuit}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{selectedRace.date}</div>
              </div>
            </div>
          </div>

          {/* Circuit Image */}
          <div className="relative aspect-[2/1] bg-muted/30">
            {circuitImageUrl && !imageError ? (
              <Image
                src={circuitImageUrl}
                alt={`${selectedRace.country} circuit map`}
                fill
                className="object-contain p-4"
                unoptimized
                onError={handleImageError}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                <MapPin className="w-12 h-12 mb-2" />
                <span className="text-sm">No circuit image available</span>
              </div>
            )}

            {/* Circuit name overlay */}
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-sm font-medium">{selectedRace.circuit}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-12 text-center">
          <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No race selected</p>
        </div>
      )}

      {/* Quick Race List */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="p-3 border-b bg-muted/30">
          <h3 className="text-sm font-medium">Season Calendar</h3>
        </div>
        <div className="max-h-48 overflow-y-auto">
          <div className="divide-y">
            {allRaces.slice(0, 10).map((race) => (
              <button
                key={race.round}
                onClick={() => {
                  setSelectedRace(race);
                  setImageError(false);
                }}
                className={`w-full p-3 text-left hover:bg-muted/50 transition-colors flex items-center gap-3 ${
                  selectedRace?.round === race.round ? "bg-muted/50" : ""
                }`}
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600/20 text-red-600 flex items-center justify-center text-xs font-bold">
                  {race.round}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{race.country}</div>
                  <div className="text-xs text-muted-foreground truncate">{race.city}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  race.status === "completed" 
                    ? "bg-green-500/20 text-green-500" 
                    : "bg-blue-500/20 text-blue-500"
                }`}>
                  {race.status === "completed" ? "✓" : "Upcoming"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
