import { Users } from "lucide-react";
import { mockConstructorStandings2024 } from "@/lib/api";

export default function TeamsPage() {
  const teams = mockConstructorStandings2024;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Teams</h1>
        <p className="text-muted-foreground">
          All teams competing in the 2024 Formula 1 season.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div
            key={team.team_name}
            className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-lg"
                style={{ backgroundColor: `#${team.team_colour}` }}
              />
              <div>
                <h3 className="font-semibold">{team.team_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {team.wins} {team.wins === 1 ? "win" : "wins"}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Points</span>
                <span className="font-semibold">{team.points}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
