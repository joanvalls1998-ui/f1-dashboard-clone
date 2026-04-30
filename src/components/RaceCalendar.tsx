"use client";

import { calendar2024, type Race } from "@/lib/api";
import { Calendar, MapPin, Clock } from "lucide-react";

interface RaceCalendarProps {
  selectedYear?: number;
}

export function RaceCalendar({ selectedYear = 2024 }: RaceCalendarProps) {
  const races = calendar2024;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">
          {selectedYear} Race Calendar
        </h2>
      </div>

      <div className="grid gap-3">
        {races.map((race) => (
          <div
            key={race.sessionKey}
            className="flex items-center gap-4 p-4 rounded-lg border bg-card text-card-foreground hover:shadow-md transition-shadow"
          >
            {/* Round number */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg">
              {race.round}
            </div>

            {/* Race info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{race.officialName}</h3>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {race.locality}, {race.country}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(race.date)}
                </span>
              </div>
            </div>

            {/* Flag placeholder */}
            <div className="text-3xl">
              {getCountryFlag(race.country)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getCountryFlag(country: string): string {
  const flags: Record<string, string> = {
    Bahrain: "🇧🇭",
    "Saudi Arabia": "🇸🇦",
    Australia: "🇦🇺",
    Japan: "🇯🇵",
    China: "🇨🇳",
    "United States": "🇺🇸",
    Italy: "🇮🇹",
    Monaco: "🇲🇨",
    Canada: "🇨🇦",
    Spain: "🇪🇸",
    Austria: "🇦🇹",
    "United Kingdom": "🇬🇧",
    Hungary: "🇭🇺",
    Belgium: "🇧🇪",
    Netherlands: "🇳🇱",
    Azerbaijan: "🇦🇿",
    Singapore: "🇸🇬",
    Mexico: "🇲🇽",
    Brazil: "🇧🇷",
    "Las Vegas": "🇺🇸",
    Qatar: "🇶🇦",
    "Abu Dhabi": "🇦🇪",
  };
  return flags[country] || "🏁";
}
