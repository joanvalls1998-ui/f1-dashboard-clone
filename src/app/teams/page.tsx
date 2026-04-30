import { TeamsList } from "@/components/TeamsList";

export default function TeamsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Teams</h1>
        <p className="text-muted-foreground">
          All F1 teams with detailed statistics and information.
        </p>
      </div>
      <TeamsList />
    </div>
  );
}
