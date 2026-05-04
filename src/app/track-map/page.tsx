"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { circuitImages } from "@/lib/f1-assets";
import { fetchRaceCalendar, Race } from "@/lib/api";
import { MapPin, Calendar, Flag, Clock } from "lucide-react";

export default function TrackMapPage() {
  const [currentRace, setCurrentRace] = useState<Race | null>(null);
  const [upcomingRace, setUpcomingRace] = useState<Race | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const races = await fetchRaceCalendar(2026);
        const now = new Date();

        // Find the most recent completed race (current)
        const completedRaces = races.filter((r) => r.status === "completed");
        const upcomingRaces = races.filter((r) => r.status === "upcoming");

        if (completedRaces.length > 0) {
          // Get the last completed race as "current"
          setCurrentRace(completedRaces[completedRaces.length - 1]);
        }

        if (upcomingRaces.length > 0) {
          setUpcomingRace(upcomingRaces[0]);
        }
      } catch (error) {
        console.error("Error loading race data:", error);
      }
      setLoading(false);
    }

    loadData();
  }, []);

  // Use current race if available, otherwise upcoming
  const displayRace = currentRace || upcomingRace;
  const circuitImageUrl = displayRace ? circuitImages[displayRace.country] : null;

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Track Map</h1>
          <p className="text-[var(--text-muted)]">Circuit map for current and upcoming races.</p>
        </div>
        <div className="space-y-4">
          <div className="bg-[var(--bg-surface)] rounded-xl p-6 animate-pulse">
            <div className="aspect-[2/1] bg-[var(--bg-elevated)] rounded-lg" />
          </div>
          <div className="bg-[var(--bg-surface)] rounded-xl p-6 animate-pulse">
            <div className="h-48 bg-[var(--bg-elevated)] rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!displayRace) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Track Map</h1>
          <p className="text-[var(--text-muted)]">Circuit map for current and upcoming races.</p>
        </div>
        <div className="bg-[var(--bg-surface)] rounded-xl p-12 text-center">
          <p className="text-[var(--text-muted)]">No race data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Track Map</h1>
        <p className="text-[var(--text-muted)]">
          Circuit map for current and upcoming races.
        </p>
      </div>

      {/* Current/Upcoming Race Badge */}
      <div className="flex items-center gap-2">
        {currentRace && upcomingRace && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-[var(--text-secondary)]">Current Race</span>
          </div>
        )}
        {currentRace && !upcomingRace && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <Flag className="w-3 h-3 text-yellow-500" />
            <span className="text-xs font-medium text-[var(--text-secondary)]">Latest Completed</span>
          </div>
        )}
        {!currentRace && upcomingRace && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <Clock className="w-3 h-3 text-blue-500" />
            <span className="text-xs font-medium text-[var(--text-secondary)]">Next Upcoming</span>
          </div>
        )}
      </div>

      {/* Circuit Info Card */}
      <div className="bg-[var(--bg-surface)] rounded-xl overflow-hidden">
        {/* Circuit Image */}
        <div className="relative aspect-[2/1] bg-[var(--bg-elevated)]">
          {circuitImageUrl ? (
            <Image
              src={circuitImageUrl}
              alt={`${displayRace.country} circuit map`}
              fill
              className="object-contain p-4"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-[var(--text-muted)]" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-transparent pointer-events-none" />

          {/* Round badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 rounded-md bg-[#E10600] var(--text-primary) text-sm font-bold">
              R{displayRace.round}
            </span>
          </div>

          {/* Status badge */}
          {currentRace && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1.5 rounded-md bg-black/70 backdrop-blur-sm var(--text-primary) text-xs font-medium">
                {currentRace.name}
              </span>
            </div>
          )}
        </div>

        {/* Circuit Details */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">{displayRace.country}</h2>
              <div className="flex items-center gap-1 text-[var(--text-muted)] mt-1">
                <MapPin className="w-4 h-4" />
                <span>{displayRace.city}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[var(--text-secondary)] bg-[var(--bg-surface)] px-3 py-2 rounded-lg">
              <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
              <span className="text-sm font-medium">{displayRace.date}</span>
            </div>
          </div>

          <p className="text-[var(--text-muted)] text-sm uppercase tracking-wider">
            {displayRace.circuit}
          </p>

          {/* Race Winner (if completed) */}
          {currentRace?.winner && (
            <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-color)]">
              <Flag className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-[var(--text-muted)]">Winner:</span>
              <span className="text-[var(--text-primary)] font-medium">{currentRace.winner}</span>
              {currentRace.winnerTeam && (
                <span className="text-[var(--text-muted)] text-sm">({currentRace.winnerTeam})</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Race Preview (if different from current) */}
      {upcomingRace && upcomingRace.round !== currentRace?.round && (
        <div className="bg-[var(--bg-surface)] rounded-xl overflow-hidden border border-[var(--border-color)]">
          <div className="p-4 border-b border-[var(--border-color)]">
            <h3 className="text-sm font-medium text-[var(--text-muted)] flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Next Race
            </h3>
          </div>
          <div className="p-4 flex items-center gap-4">
            <div className="relative w-24 h-16 bg-[var(--bg-elevated)] rounded-lg overflow-hidden flex-shrink-0">
              {circuitImages[upcomingRace.country] ? (
                <Image
                  src={circuitImages[upcomingRace.country]}
                  alt={`${upcomingRace.country} circuit`}
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[var(--text-muted)]" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-[var(--text-primary)] font-bold">{upcomingRace.country}</h4>
              <p className="text-[var(--text-muted)] text-sm">{upcomingRace.circuit}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-sm">{upcomingRace.date}</span>
              </div>
              <p className="text-[var(--text-muted)] text-xs mt-1">{upcomingRace.city}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
