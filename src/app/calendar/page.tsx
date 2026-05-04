import { RaceCalendar } from "@/components/RaceCalendar";
import { Suspense } from "react";
import { RaceCalendarSkeleton } from "@/components/Skeletons";
import { fetchRaceCalendar } from "@/lib/api";
import JsonLd from "@/components/JsonLd";

export const revalidate = 3600;

export const metadata = {
  title: "Calendari F1 2026 — Dates i Circuits de Curses",
  description: "Calendari complet de la temporada 2026 de la Fórmula 1. 22 Grans Premis amb dates, circuits i horaris.",
};

export default async function CalendarPage() {
  const races = await fetchRaceCalendar(2026);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Calendari F1 2026",
    description: "Calendari complet de la temporada 2026 de la Fórmula 1.",
    itemListElement: races.map((r: any, i: number) => ({
      "@type": "SportsEvent",
      position: i + 1,
      name: r.name,
      location: {
        "@type": "Place",
        name: r.circuit,
        address: { "@type": "PostalAddress", addressLocality: r.city, addressCountry: r.country },
      },
      startDate: r.date,
    })),
  };

  return (
    <div className="space-y-6">
      <JsonLd data={jsonLd} />
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
