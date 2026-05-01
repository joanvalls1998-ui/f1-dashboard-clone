export default function StartingGridPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Starting Grid</h1>
        <p className="text-muted-foreground">
          Qualifying results and starting grid positions for the next race.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">
          Starting grid is populated from qualifying results once a session is complete.
        </p>
      </div>
    </div>
  );
}
