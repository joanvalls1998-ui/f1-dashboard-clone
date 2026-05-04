"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { X, MapPin, Globe as GlobeIcon } from "lucide-react";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface Race {
  round: number;
  name: string;
  country: string;
  city: string;
  date: string;
  circuit: string;
  status: "completed" | "upcoming" | "cancelled";
  lat?: number;
  lng?: number;
}

interface Props {
  races: Race[];
  selectedRace: Race | null;
  onSelectRace: (race: Race | null) => void;
  onClose: () => void;
}

export function CircuitGlobe({ races, selectedRace, onSelectRace, onClose }: Props) {
  const globeRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter races that have coordinates
  const racesWithCoords = races.filter((r) => r.lat != null && r.lng != null);

  // Fly to selected race
  useEffect(() => {
    if (!globeReady || !globeRef.current || !selectedRace) return;

    const { lat, lng } = selectedRace;
    if (lat == null || lng == null) return;

    globeRef.current.pointOfView(
      { lat, lng, altitude: 0.3 },
      1200
    );
  }, [selectedRace, globeReady]);

  // Auto-rotate until user interacts
  useEffect(() => {
    if (!mounted || !globeRef.current) return;
    // Disabled: user prefers direct interaction
    globeRef.current.controls().autoRotate = false;
  }, [mounted]);



  if (!mounted) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
        <div className="text-white">Loading globe...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <GlobeIcon className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-white font-bold text-lg">
              {selectedRace ? selectedRace.name : "2026 Race Calendar"}
            </h2>
            {selectedRace && (
              <p className="text-gray-400 text-sm">
                {selectedRace.city}, {selectedRace.country} · Round {selectedRace.round}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
        >
          <X className="w-4 h-4" />
          Close
        </button>
      </div>

      {/* Globe */}
      <div className="flex-1 cursor-grab active:cursor-grabbing">
        <Globe
          ref={globeRef}
          onGlobeReady={() => setGlobeReady(true)}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          pointsData={racesWithCoords}
          pointLat="lat"
          pointLng="lng"
          pointColor={() => "#3b82f6"}
          pointAltitude={0.005}
          pointRadius={0.25}
          onPointClick={(point: any) => {
            const race = racesWithCoords.find(
              (r) => Math.abs(r.lat! - point.lat) < 0.01 && Math.abs(r.lng! - point.lng) < 0.01
            );
            if (race) onSelectRace(race);
          }}
          pointLabel={({ lat, lng, ...race }: any) => {
            const r = race as Race;
            return `
              <div style="background:#1a1a2e;border-radius:8px;padding:12px;font-family:system-ui;color:white;min-width:160px">
                <div style="font-weight:bold;font-size:14px;margin-bottom:4px">${r.name}</div>
                <div style="color:#9ca3af;font-size:12px">${r.city}, ${r.country}</div>
                <div style="color:#6b7280;font-size:11px;margin-top:4px">Round ${r.round} · ${r.date}</div>
                ${r.status === "completed" ? `<div style="color:#22c55e;font-size:11px;margin-top:4px">✓ Completed</div>` : ""}
              </div>
            `;
          }}
          polygonsData={[]}
          polygonsTransitionDuration={300}
          enablePointerInteraction={true}
        />
      </div>

      {/* Selected race info */}
      {selectedRace && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-card/90 backdrop-blur-sm border rounded-xl px-6 py-4 flex items-center gap-4 shadow-xl">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: "var(--team-color, #3b82f6)" }}
          >
            {selectedRace.round}
          </div>
          <div>
            <p className="text-white font-bold">{selectedRace.name}</p>
            <p className="text-gray-400 text-sm">
              <MapPin className="w-3 h-3 inline mr-1" />
              {selectedRace.city}, {selectedRace.country}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs">{selectedRace.date}</p>
            <p className="text-xs text-gray-500">
              {selectedRace.lat?.toFixed(2)}°, {selectedRace.lng?.toFixed(2)}°
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
