"use client";

import Script from "next/script";

export function JsonLdScript() {
  return (
    <Script
      id="website-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "F1 Dashboard",
          url: "https://f1-dashboard-clone.vercel.app",
          inLanguage: "ca",
          description: "La millor web d'estadístiques, classificació i calendari de Fórmula 1 en temps real.",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://f1-dashboard-clone.vercel.app/?search={search_term}",
            "query-input": "required name=search_term",
          },
          sameAs: [
            "https://github.com/joanvalls1998-ui/f1-dashboard-clone",
          ],
        }),
      }}
    />
  );
}

interface SportsEventLD {
  name: string;
  date: string;
  circuit: string;
  city: string;
  country: string;
}

export function SportsEventLD({ event }: { event: SportsEventLD }) {
  return (
    <Script
      id={`race-ld-${event.name.replace(/\s+/g, "-")}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SportsEvent",
          name: event.name,
          startDate: event.date,
          sport: "Formula One",
          location: {
            "@type": "SportsActivityLocation",
            name: event.circuit,
            address: {
              "@type": "PostalAddress",
              addressLocality: event.city,
              addressCountry: event.country,
            },
          },
        }),
      }}
    />
  );
}

interface PersonLD {
  fullName: string;
  team?: string;
  nationality?: string;
  position?: number;
  points?: number;
}

export function PersonLD({ person }: { person: PersonLD }) {
  return (
    <Script
      id={`driver-ld-${person.fullName.replace(/\s+/g, "-")}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: person.fullName,
          nationality: { "@type": "Country", name: person.nationality || "Unknown" },
          memberOf: person.team ? { "@type": "SportsTeam", name: person.team } : undefined,
          jobTitle: "F1 Driver",
        }),
      }}
    />
  );
}
