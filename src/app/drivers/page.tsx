import { DriversList } from "@/components/DriversList";

export default function DriversPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Drivers</h1>
        <p className="text-muted-foreground">
          All drivers competing in Formula 1 with detailed statistics.
        </p>
      </div>
      <DriversList />
    </div>
  );
}
