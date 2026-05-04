import Image from "next/image";
import Link from "next/link";
import { fetchDriverStandings } from "@/lib/api";
import { driverImages, teamColors } from "@/lib/f1-assets";
import { Suspense } from "react";
import { DriversListSkeleton } from "@/components/Skeletons";
import JsonLd from "@/components/JsonLd";

export const revalidate = 300; // ISR every 5 minutes

export const metadata = {
  title: "Pilots de F1 2026 — Classificació i Estadístiques",
  description: "Descobreix tots els pilots de la temporada 2026 de la Fórmula 1. Classificació, punts, equips i estadístiques completes.",
};

interface Driver {
  position: number;
  abbreviation: string;
  fullName: string;
  team: string;
  points: number;
  driverId: string;
  number: string;
  nationality: string;
}

async function DriversGrid() {
  const drivers = await fetchDriverStandings(2026);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {drivers.map((driver: Driver, i: number) => {
        const imageUrl = driverImages[driver.abbreviation as keyof typeof driverImages];
        const teamColor = teamColors[driver.team] || "#666666";
        const nameParts = driver.fullName.split(" ");
        const lastName = nameParts[nameParts.length - 1];
        const firstName = nameParts.slice(0, -1).join(" ");

        return (
          <Link
            href={`/drivers/${driver.driverId}`}
            className="block"
            key={driver.abbreviation}
          >
          <div
            key={driver.abbreviation}
            className="card card-interactive overflow-hidden animate-enter"
            style={{ animationDelay: `${Math.min(i, 20) * 30}ms` }}
          >
            <div
              className="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10"
              style={{ backgroundColor: teamColor, color: "#fff", fontFamily: 'var(--font-mono)' }}
            >
              {driver.position}
            </div>

            <div className="relative h-28 overflow-hidden rounded-lg mb-3" style={{ backgroundColor: 'var(--bg-elevated)' }}>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={driver.fullName}
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span
                    className="text-4xl font-black"
                    style={{ color: teamColor + '66', fontFamily: 'var(--font-heading)' }}
                  >
                    {lastName[0]}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-transparent" />
            </div>

            <div className="space-y-1">
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0">
                  <h3 className="font-bold text-sm truncate leading-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                    {lastName}
                  </h3>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{firstName}</p>
                </div>
                <div
                  className="shrink-0 px-1.5 py-0.5 rounded text-xs font-medium"
                  style={{ backgroundColor: teamColor + '22', color: teamColor }}
                >
                  {driver.team.length > 10 ? driver.team.split(" ").map((w: string) => w[0]).join("") : driver.team}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--bg-overlay)' }}>
                <span className="stat-number text-base" style={{ color: teamColor }}>{driver.points}</span>
                <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>#{driver.number}</span>
              </div>
            </div>
          </div>
          </Link>
        );
      })}
    </div>
  );
}

export default async function DriversPage() {
  const drivers = await fetchDriverStandings(2026);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Pilots de F1 2026",
    description: "Llista completa de pilots de la temporada 2026 de la Fórmula 1.",
    itemListElement: drivers.map((d: Driver, i: number) => ({
      "@type": "Person",
      position: i + 1,
      name: d.fullName,
      memberOf: { "@type": "SportsTeam", name: d.team },
      url: `https://f1-dashboard-clone.vercel.app/drivers/${d.driverId}`,
    })),
  };

  return (
    <div className="space-y-6">
      <JsonLd data={jsonLd} />
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--accent-red)' }}>
          <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)', color: '#fff' }}>22</span>
        </div>
        <div>
          <p className="eyebrow">Temporada 2026</p>
          <h1 className="text-3xl font-extrabold" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>Pilots</h1>
        </div>
      </div>
      <Suspense fallback={<DriversListSkeleton />}>
        <DriversGrid />
      </Suspense>
    </div>
  );
}
