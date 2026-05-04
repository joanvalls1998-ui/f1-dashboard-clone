import { RaceCalendar } from "@/components/RaceCalendar";
import { Suspense } from "react";
import { RaceCalendarSkeleton } from "@/components/Skeletons";

export const revalidate = 3600; // 1 hour (calendar changes less)

export const metadata = {
  title: "Calendari F1 2026 — Dates i Circuits de Curses",
  description: "Calendari complet de la temporada 2026 de la Fórmula 1. 22 Grans Premis amb dates, circuits i horaris.",
};

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Temporada 2026</p>
        <h1 className="text-3xl font-extrabold mt-1" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
          Calendari de Curses
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          22 Grans Premis — Totes les dates i circuits de la temporada.
        </p>
      </div>
      <Suspense fallback={<RaceCalendarSkeleton />}>
        <RaceCalendar />
      </Suspense>
    </div>
  );
}
