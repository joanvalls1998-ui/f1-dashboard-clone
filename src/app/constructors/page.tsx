import { ConstructorStandings } from "@/components/ConstructorStandings";

export default function ConstructorsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Constructor Standings</h1>
        <p className="text-muted-foreground">
          Current Formula 1 constructor championship standings.
        </p>
      </div>
      <ConstructorStandings />
    </div>
  );
}
