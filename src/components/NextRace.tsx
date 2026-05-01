"use client";

import { Calendar, MapPin, Clock } from "lucide-react";

const nextEvent = {
  name: "2026 Season Preview",
  type: "Testing",
  country: "Bahrain",
  locality: "Sakhir",
  circuit: "Bahrain International Circuit",
  date: "February 26, 2026",
  daysUntil: 301,
};

export function NextRace() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold">What's Next</h2>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl">🇧🇭</div>
          <div>
            <h3 className="text-xl font-bold">{nextEvent.name}</h3>
            <p className="text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {nextEvent.circuit}, {nextEvent.locality}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted">
            <div className="text-3xl font-bold text-blue-500">{nextEvent.daysUntil}</div>
            <div className="text-xs text-muted-foreground">Days until</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted">
            <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <div className="text-sm">{nextEvent.date}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted">
            <Calendar className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <div className="text-sm">{nextEvent.type}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
