import ConstructorStandings from "@/components/ConstructorStandings";
import DriverStandings from "@/components/DriverStandings";

export default function StandingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Standings</h1>
        <p className="text-muted-foreground">
          Current F1 Championship standings for drivers and constructors.
        </p>
      </div>
      <DriverStandings />
      <ConstructorStandings />
    </div>
  );
}
