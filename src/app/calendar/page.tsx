import { RaceCalendar } from "@/components/RaceCalendar";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">2026 Season</p>
        <h1 className="text-3xl font-extrabold mt-1" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
          Race Calendar
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Complete Formula 1 race calendar for 2026 season.
        </p>
      </div>
      <RaceCalendar />
    </div>
  );
}
