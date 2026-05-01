"use client";

import { useEffect, useState } from "react";
import { circuitImages, teamColors, getTeamColor } from "@/lib/f1-assets";
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
        // Fetch races from Ergast
        const racesData = await fetchRaceCalendar(selectedYear);
        if (racesData.length > 0) {
          setRaceData(racesData);
          
          // Fetch sessions from OpenF1 to get detailed schedule
          const sessionsRes = await fetch(
            `https://api.openf1.org/v1/sessions?year=${selectedYear}`
          );
          const sessionsData: Session[] = await sessionsRes.json();
          
          // Group sessions by meeting (race weekend)
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
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#1a1a1a] rounded-xl h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#171717] rounded-lg p-4 text-center">
          <p className="text-3xl font-black text-green-500">{completedRaces.length}</p>
          <p className="text-xs text-gray-500 uppercase">Completed</p>
        </div>
        <div className="bg-[#171717] rounded-lg p-4 text-center">
          <p className="text-3xl font-black text-blue-500">{upcomingRaces.length}</p>
          <p className="text-xs text-gray-500 uppercase">Upcoming</p>
        </div>
        <div className="bg-[#171717] rounded-lg p-4 text-center">
          <p className="text-3xl font-black text-red-500">{cancelledRaces.length}</p>
          <p className="text-xs text-gray-500 uppercase">Cancelled</p>
        </div>
      </div>

      {/* Races Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {raceData.map((race) => (
          <RaceCard key={race.round} race={race} sessions={sessions} />
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
      className={`relative bg-[#1a1a1a] rounded-xl overflow-hidden group transition-all ${
        isCancelled ? "opacity-60" : "hover:ring-2 hover:ring-[#E10600]"
      }`}
    >
      {/* Circuit Image Background */}
      <div className="relative h-32 overflow-hidden">
        {circuitImage ? (
          <Image
            src={circuitImage}
            alt={race.circuit}
            fill
            className="object-cover opacity-30 group-hover:opacity-50 transition-opacity"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />

        {/* Round badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded-md bg-[#E10600] text-white text-xs font-bold">
            R{race.round}
          </span>
        </div>

        {/* Status badge */}
        {isCancelled && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-4 py-2 rounded-lg bg-red-600/90 text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              CANCELLED
            </span>
          </div>
        )}
        {isCompleted && race.winner && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm">
            <Flag className="w-3 h-3 text-yellow-500" />
            <span className="text-white text-xs font-medium">{race.winner}</span>
          </div>
        )}
        {!isCancelled && !isCompleted && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-blue-600/90 text-white text-xs font-medium">
            <Clock className="w-3 h-3" />
            UPCOMING
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-white font-bold text-lg">{race.country}</h3>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <MapPin className="w-3 h-3" />
              <span>{race.city}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-gray-300">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{race.date}</span>
            </div>
          </div>
        </div>

        {/* Circuit name */}
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">{race.circuit}</p>

        {/* Winner info */}
        {race.winner && !isCancelled && (
          <div className="flex items-center gap-2 pt-2 border-t border-[#333]">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: winnerColor }} />
            <span className="text-white text-sm">
              <span className="text-yellow-500 font-bold">Winner:</span> {race.winner}
            </span>
            <span className="text-gray-500 text-xs">({race.winnerTeam})</span>
          </div>
        )}
      </div>
    </div>
  );
}
