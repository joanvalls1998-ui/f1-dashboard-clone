import Image from "next/image";
import { mockDriverStandings2024 } from "@/lib/api";
import { IdCard } from "lucide-react";

export default function DriversPage() {
  const drivers = mockDriverStandings2024;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Drivers</h1>
        <p className="text-muted-foreground">
          All drivers competing in the 2024 Formula 1 season.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver) => (
          <div
            key={driver.driver_number}
            className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted">
                <Image
                  src={driver.headshot_url}
                  alt={driver.broadcast_name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{driver.full_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {driver.broadcast_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {driver.team_name}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-muted-foreground">Number: {driver.driver_number}</span>
              <span className="text-muted-foreground">Country: {driver.nationality}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
