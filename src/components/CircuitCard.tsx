"use client";

import { useEffect, useState } from "react";
import { circuitImages, getTeamColor } from "@/lib/f1-assets";
import Image from "next/image";
import { MapPin, Calendar, Flag, CheckCircle, XCircle, Clock } from "lucide-react";
import { fetchRaceCalendar } from "@/lib/api";

interface Race {
  round: number;
  name: string;
  country: string;
  city: string;
  date: string;
  circuit: string;
  winner?: string;
  winnerTeam?: string;
  status: "completed" | "upcoming" | "cancelled";
}

interface Session {
  session_key: number;
  meeting_key: number;
  session_type: string;
  session_name: string;
  date_start: string;
  date_end: string;
  circuit_short_name: string;
  country_name: string;
  location: string;
  is_cancelled: boolean;
}

interface RaceCalendarVisualProps {
  races?: Race[];
  title?: string;
}

export function RaceCalendarVisual({ races = [], title = "2026 Calendar" }: RaceCalendarVisualProps) {
  const [raceData, setRaceData] = useState<Race[]>(races);
  const [sessions, setSessions] = useState<Record<number, Session[]>>({});
  const [loading, setLoading] = useState(races.length === 0);
  const [selectedYear, setSelectedYear] = useState(2026);

  useEffect(() => {
    async function loadData() {
      try {
        const racesData = await fetchRaceCalendar(selectedYear);
        if (racesData.length > 0) {
          setRaceData(racesData);

          const sessionsRes = await fetch(
            `https://api.openf1.org/v1/sessions?year=${selectedYear}`,
            { signal: AbortSignal.timeout(8000) }
          );
          const sessionsData: Session[] = await sessionsRes.json();

          const sessionsByMeeting: Record<number, Session[]> = {};
          sessionsData.forEach((session) => {
            if (!sessionsByMeeting[session.meeting_key]) {
              sessionsByMeeting[session.meeting_key] = [];
            }
            sessionsByMeeting[session.meeting_key].push(session);
          });

          setSessions(sessionsByMeeting);
        }
      } catch (error) {
        console.error("Error loading race data:", error);
      }
      setLoading(false);
    }

    if (raceData.length === 0) {
      loadData();
    }
  }, [selectedYear]);

  const completedRaces = raceData.filter((r) => r.status === "completed");
  const upcomingRaces = raceData.filter((r) => r.status === "upcoming");
  const cancelledRaces = raceData.filter((r) => r.status === "cancelled");

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            {title}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[var(--bg-surface)] rounded-xl h-48 skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center py-4">
          <p className="stat-number text-3xl" style={{ color: 'var(--status-live)' }}>{completedRaces.length}</p>
          <p className="stat-label mt-1">Completed</p>
        </div>
        <div className="card text-center py-4">
          <p className="stat-number text-3xl" style={{ color: 'var(--status-upcoming)' }}>{upcomingRaces.length}</p>
          <p className="stat-label mt-1">Upcoming</p>
        </div>
        <div className="card text-center py-4">
          <p className="stat-number text-3xl" style={{ color: 'var(--accent-red)' }}>{cancelledRaces.length}</p>
          <p className="stat-label mt-1">Cancelled</p>
        </div>
      </div>

      {/* Races Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {raceData.map((race, i) => (
          <div key={race.round} className="animate-enter" style={{ animationDelay: `${i * 40}ms` }}>
            <RaceCard race={race} sessions={sessions} />
          </div>
        ))}
      </div>
    </div>
  );
}

function RaceCard({ race, sessions }: { race: Race; sessions: Record<number, Session[]> }) {
  const circuitImage = circuitImages[race.country] || "";
  const winnerColor = race.winnerTeam ? getTeamColor(race.winnerTeam) : "#666";
  const isCancelled = race.status === "cancelled";
  const isCompleted = race.status === "completed";

  return (
    <div
      className={`card card-interactive overflow-hidden ${isCancelled ? "opacity-60" : ""}`}
    >
      {/* Circuit Image */}
      <div className="relative h-32 -mx-5 -mt-5 overflow-hidden rounded-t-xl">
        {circuitImage ? (
          <Image
            src={circuitImage}
            alt={race.circuit}
            fill
            className="object-cover opacity-30 group-hover:opacity-50 transition-opacity"
            unoptimized
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)`,
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, var(--bg-surface) 0%, transparent 60%)`,
          }}
        />

        {/* Round badge */}
        <div className="absolute top-3 left-3">
          <span
            className="px-2 py-1 rounded-md text-white text-xs font-bold"
            style={{ backgroundColor: 'var(--accent-red)', fontFamily: 'var(--font-heading)' }}
          >
            R{race.round}
          </span>
        </div>

        {/* Status badge */}
        {isCancelled && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="px-4 py-2 rounded-lg text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2"
              style={{ backgroundColor: 'rgba(239,68,68,0.9)', backdropFilter: 'blur(4px)' }}
            >
              <XCircle className="w-4 h-4" />
              Cancelled
            </span>
          </div>
        )}
        {isCompleted && race.winner && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          >
            <Flag className="w-3 h-3" style={{ color: '#eab308' }} />
            <span className="text-white text-xs font-medium">{race.winner}</span>
          </div>
        )}
        {!isCancelled && !isCompleted && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md"
            style={{ backgroundColor: 'rgba(59,130,246,0.9)', backdropFilter: 'blur(4px)' }}
          >
            <Clock className="w-3 h-3" />
            <span className="text-white text-xs font-medium">Upcoming</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-2">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3
              className="text-[var(--text-primary)] font-bold text-base"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {race.country}
            </h3>
            <div className="flex items-center gap-1 text-[var(--text-muted)] text-sm">
              <MapPin className="w-3 h-3" />
              <span>{race.city}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[var(--text-secondary)]">
            <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs">{race.date}</span>
          </div>
        </div>

        {/* Circuit name */}
        <p
          className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-2"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {race.circuit}
        </p>

        {/* Winner info */}
        {race.winner && !isCancelled && (
          <div
            className="flex items-center gap-2 pt-2 border-t mt-2"
            style={{ borderColor: 'var(--bg-overlay)' }}
          >
            <div className="team-dot" style={{ backgroundColor: winnerColor }} />
            <span className="text-[var(--text-secondary)] text-sm">
              <span style={{ color: '#eab308', fontWeight: 600 }}>Winner:</span>
              {' '}{race.winner}
            </span>
            <span className="text-[var(--text-muted)] text-xs">({race.winnerTeam})</span>
          </div>
        )}
      </div>
    </div>
  );
}
