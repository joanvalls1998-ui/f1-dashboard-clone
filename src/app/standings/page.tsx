import DriverStandings from "@/components/DriverStandings";
import ConstructorStandings from "@/components/ConstructorStandings";
import { Suspense } from "react";
import SimpleErrorBoundary, { ErrorFallbackUI } from "@/components/SimpleErrorBoundary";
import { DriverStandingsSkeleton, ConstructorStandingsSkeleton } from "@/components/Skeletons";

export const revalidate = 300;

export const metadata = {
  title: "Classificacions F1 2026 — Pilots i Constructors",
  description: "Classificació del Mundial de Pilots i Constructors de Fórmula 1 2026. Puntuacions, victòries i estadístiques en temps real.",
};

export default function StandingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">2026 Championship</p>
        <h1
          className="text-3xl font-extrabold mt-1"
          style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}
        >
          Classificacions
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Classificacions del Mundial de Pilots i Constructors F1 2026.
        </p>
      </div>

      <SimpleErrorBoundary fallback={<ErrorFallbackUI />}>
        <Suspense fallback={<DriverStandingsSkeleton />}>
          <DriverStandings />
        </Suspense>
      </SimpleErrorBoundary>

      <SimpleErrorBoundary fallback={<ErrorFallbackUI />}>
        <Suspense fallback={<ConstructorStandingsSkeleton />}>
          <ConstructorStandings />
        </Suspense>
      </SimpleErrorBoundary>
    </div>
  );
}
