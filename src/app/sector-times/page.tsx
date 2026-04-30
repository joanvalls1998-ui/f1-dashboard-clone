import { SectorTimes } from "@/components/SectorTimes";

export default function SectorTimesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Sector Times</h1>
        <p className="text-muted-foreground">
          Detailed sector time analysis for all drivers.
        </p>
      </div>
      <SectorTimes />
    </div>
  );
}
