import { ConstructorStandingsReal } from "@/components/ConstructorStandingsReal";
import { Suspense } from "react";
import { ConstructorStandingsSkeleton } from "@/components/Skeletons";
import { fetchConstructorStandings } from "@/lib/api";
import JsonLd from "@/components/JsonLd";

export const revalidate = 300;

export const metadata = {
  title: "Constructors F1 2026 — Classificació d'Equips",
  description: "Classificació del Mundial de Constructors de la Fórmula 1 2026. Estadístiques, punts i victòries de tots els equips.",
};

export default async function ConstructorsPage() {
  const constructors = await fetchConstructorStandings(2026);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Classificació Constructors F1 2026",
    description: "Classificació del Mundial de Constructors de Fórmula 1 2026.",
    itemListElement: constructors.map((c: any, i: number) => ({
      "@type": "Organization",
      position: i + 1,
      name: c.name,
      member: [],
      description: `${c.points} punts, ${c.wins} victòries`,
    })),
  };

  return (
    <div className="space-y-8">
      <JsonLd data={jsonLd} />
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Classificació d'Equips</h1>
        <p className="text-gray-400">
          Classificació del Mundial de Constructors F1 2026.
        </p>
      </div>
      <Suspense fallback={<ConstructorStandingsSkeleton />}>
        <ConstructorStandingsReal />
      </Suspense>
    </div>
  );
}
