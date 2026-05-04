"use client";

import { useEffect } from "react";

interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[];
}

export default function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    // Script injection for structured data
    const scripts = document.querySelectorAll('script[data-jsonld="true"]');
    scripts.forEach((s) => s.remove());
  }, []);

  const jsonLd = Array.isArray(data)
    ? data.map((item) => ({ ...item, "@context": "https://schema.org" }))
    : { ...data, "@context": "https://schema.org" };

  return (
    <script
      type="application/ld+json"
      data-jsonld="true"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}

// Helpers
export function sportsEventLD(race: {
  name: string;
  date: string;
  circuit: string;
  city: string;
  country: string;
}): Record<string, any> {
  return {
    "@type": "SportsEvent",
    name: race.name,
    startDate: race.date,
    sport: "Formula One",
    location: {
      "@type": "SportsActivityLocation",
      name: race.circuit,
      address: {
        "@type": "PostalAddress",
        addressLocality: race.city,
        addressCountry: race.country,
      },
    },
  };
}

export function personLD(driver: {
  fullName: string;
  team?: string;
  nationality?: string;
  position?: number;
  points?: number;
}): Record<string, any> {
  return {
    "@type": "Person",
    name: driver.fullName,
    nationality: { "@type": "Country", name: driver.nationality || "Unknown" },
    memberOf: driver.team
      ? { "@type": "SportsTeam", name: driver.team }
      : undefined,
    jobTitle: "F1 Driver",
    identifier: driver.position
      ? `Championship Position ${driver.position}`
      : undefined,
  };
}

export function sportsTeamLD(team: {
  name: string;
  points?: number;
  wins?: number;
  position?: number;
  drivers?: string[];
}): Record<string, any> {
  return {
    "@type": "SportsTeam",
    name: team.name,
    sport: "Formula One",
    member: team.drivers?.map((d) => ({ "@type": "Person", name: d })),
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Championship Points",
        value: team.points ?? 0,
      },
      {
        "@type": "PropertyValue",
        name: "Championship Position",
        value: team.position ?? 0,
      },
      {
        "@type": "PropertyValue",
        name: "Wins",
        value: team.wins ?? 0,
      },
    ],
  };
}

export function websiteLD(): Record<string, any> {
  return {
    "@type": "WebSite",
    name: "F1 Dashboard",
    url: "https://f1-dashboard-clone.vercel.app",
    inLanguage: "ca",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://f1-dashboard-clone.vercel.app/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}
