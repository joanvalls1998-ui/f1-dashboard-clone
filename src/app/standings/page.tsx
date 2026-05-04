import DriverStandings from "@/components/DriverStandings";
import ConstructorStandings from "@/components/ConstructorStandings";

export default function StandingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">2026 Championship</p>
        <h1
          className="text-3xl font-extrabold mt-1"
          style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}
        >
          Standings
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Current F1 Championship standings for drivers and constructors.
        </p>
      </div>
      <DriverStandings />
      <ConstructorStandings />
    </div>
  );
}
