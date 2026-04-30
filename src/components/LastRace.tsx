"use client";

import { Flag } from "lucide-react";

export function LastRace() {
  // This would normally fetch from API - for now showing mock data
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Flag className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-semibold">Last Race</h2>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="text-center space-y-4">
          <div className="text-4xl">🇦🇪</div>
          <div>
            <h3 className="text-xl font-bold">Abu Dhabi Grand Prix</h3>
            <p className="text-muted-foreground">Yas Marina Circuit</p>
          </div>
          <div className="text-sm text-muted-foreground">
            December 6-8, 2024
          </div>
        </div>
      </div>
    </div>
  );
}
