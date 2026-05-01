"use client";

import { useState } from "react";
import { Radio } from "lucide-react";

export function LiveTiming() {
  const [iframeKey, setIframeKey] = useState(0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-red-500 animate-pulse" />
          <h2 className="text-lg font-semibold">Live Timing — Miami GP</h2>
          <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full animate-pulse">
            LIVE
          </span>
        </div>

        <button
          onClick={() => setIframeKey(k => k + 1)}
          className="px-3 py-1.5 text-sm bg-secondary rounded-md hover:bg-secondary/80"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Embedded Live Timing */}
      <div className="border rounded-lg overflow-hidden">
        <iframe
          key={iframeKey}
          src="https://app.formula1dashboard.com/live-timing/"
          className="w-full h-[700px] md:h-[800px]"
          title="F1 Live Timing"
          style={{ border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        Live timing powered by formula1dashboard.com — Miami Grand Prix 2026
      </p>
    </div>
  );
}
