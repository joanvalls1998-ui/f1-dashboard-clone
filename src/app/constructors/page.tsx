import { ConstructorStandingsReal } from "@/components/ConstructorStandingsReal";

export default function ConstructorsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Constructor Standings</h1>
        <p className="text-muted-foreground">
          F1 Constructors Championship standings with detailed team statistics.
        </p>
      </div>
      <ConstructorStandingsReal />
    </div>
  );
}
