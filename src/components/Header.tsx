"use client";

import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const getTitle = () => {
    if (pathname === "/") return "Home";
    if (pathname === "/calendar") return "Race Calendar";
    if (pathname === "/standings") return "Driver Standings";
    if (pathname === "/constructors") return "Constructor Standings";
    if (pathname === "/drivers") return "Drivers";
    if (pathname === "/teams") return "Teams";
    if (pathname === "/driver-stats") return "Driver Stats";
    if (pathname === "/head-to-head") return "Head To Head";
    if (pathname === "/consistency") return "Consistency";
    if (pathname === "/race-pace") return "Race Pace";
    if (pathname === "/pit-stops") return "Pit Stops";
    if (pathname === "/tech-updates") return "Tech Updates";
    if (pathname === "/used-elements") return "Used Elements";
    if (pathname === "/destructors") return "Destructors Championship";
    if (pathname === "/track-dna") return "Track DNA";
    if (pathname === "/live") return "Live Timing";
    if (pathname === "/predictions") return "Predicción";
    if (pathname === "/favorito") return "Favorito";
    if (pathname === "/engineer") return "Ingeniero";
    if (pathname === "/home-intel") return "Home Intel";
    if (pathname === "/news") return "News";
    if (pathname === "/race-mode") return "Modo Carrera";
    if (pathname === "/sector-times") return "Sector Times";
    if (pathname === "/intervals") return "Intervals";
    if (pathname === "/qualifying") return "Qualifying";
    if (pathname === "/starting-grid") return "Starting Grid";
    if (pathname === "/race-history") return "Race History";
    if (pathname === "/weather") return "Weather";
    if (pathname === "/track-map") return "Track Map";
    if (pathname === "/season-stats") return "Season Stats";
    if (pathname === "/dnf") return "DNF Tracker";
    if (pathname === "/speed-trap") return "Speed Trap";
    if (pathname === "/speed-histogram") return "Speed Histogram";
    if (pathname === "/tyre-strategy") return "Tyre Strategy";
    if (pathname === "/driver-comparison") return "Driver Comparison";
    return "F1 Dashboard";
  };

  return (
    <header
      className="sticky top-0 z-20 backdrop-blur-md border-b"
      style={{
        backgroundColor: 'rgba(9,9,11,0.85)',
        borderColor: 'var(--bg-overlay)',
      }}
    >
      <div className="flex h-14 items-center gap-3 px-4 md:px-6">
        {/* Title */}
        <nav aria-label="breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm">
            <li>
              <span
                className="font-semibold"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
              >
                {getTitle()}
              </span>
            </li>
          </ol>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Live dot (only on non-live pages) */}
          {pathname !== '/live' && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--bg-overlay)' }}>
              <div className="live-dot" />
              <span className="text-xs font-medium" style={{ color: 'var(--status-live)' }}>Live</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
