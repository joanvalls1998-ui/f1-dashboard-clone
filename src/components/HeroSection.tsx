"use client";

import { useEffect, useState } from "react";
import { Trophy, Calendar, Timer, ChevronRight } from "lucide-react";
import { fetchRaceCalendar } from "@/lib/api";
import Link from "next/link";

function useNextRace() {
  const [nextRace, setNextRace] = useState<{ name: string; date: Date; circuit: string; country: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    async function load() {
      const calendar = await fetchRaceCalendar(2026);
      const now = new Date();
      const upcoming = calendar.find((r) => new Date(r.date) > now);
      if (upcoming) {
        setNextRace({
          name: upcoming.name,
          date: new Date(upcoming.date),
          circuit: upcoming.circuit,
          country: upcoming.country,
        });
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!nextRace) return;
    const interval = setInterval(() => {
      const diff = nextRace.date.getTime() - Date.now();
      if (diff <= 0) return;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${days}d ${hours}h ${mins}m`);
    }, 60000);
    setTimeLeft("Calculant...");
    return () => clearInterval(interval);
  }, [nextRace]);

  return { nextRace, timeLeft };
}

export default function HeroSection() {
  const { nextRace, timeLeft } = useNextRace();

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse at 15% 30%, rgba(225,6,0,0.12) 0%, transparent 50%), radial-gradient(ellipse at 85% 70%, rgba(54,113,198,0.1) 0%, transparent 50%)",
        }}
      />

      <div className="py-8 md:py-12">
        <div className="max-w-4xl">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-[1.1]"
            style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}
          >
            F1 Dashboard
            <span className="block text-2xl md:text-3xl lg:text-4xl font-bold mt-2" style={{ color: "var(--accent-red)" }}>
              Temporada 2026
            </span>
          </h1>
          <p className="text-base md:text-lg max-w-xl mb-6" style={{ color: "var(--text-secondary)" }}>
            Estadístiques, classificacions i cronometratge en temps real de la Fórmula 1. 
            Dades actualitzades de la temporada 2026.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/standings/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--accent-red)", color: "#fff" }}
            >
              <Trophy className="w-4 h-4" />
              Classificacions
            </Link>
            <Link
              href="/calendar/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] border"
              style={{ borderColor: "var(--bg-overlay)", color: "var(--text-primary)" }}
            >
              <Calendar className="w-4 h-4" />
              Calendari
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Countdown */}
        {nextRace && (
          <div className="mt-8 card inline-block">
            <div className="flex items-center gap-3 mb-2">
              <Timer className="w-5 h-5" style={{ color: "var(--accent-red)" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Propera cursa: {nextRace.name}
              </span>
            </div>
            <div
              className="text-3xl md:text-4xl font-black tracking-tight"
              style={{ fontFamily: "var(--font-heading)", color: "var(--accent-red)" }}
            >
              {timeLeft}
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {nextRace.circuit}, {nextRace.country}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
