import { Consistency } from "@/components/Consistency";

export default function ConsistencyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Consistency</h1>
        <p className="text-[var(--text-secondary)]">
          Driver consistency analysis throughout the season. Track lap time variation, position changes, and finishing consistency.
        </p>
      </div>

      <Consistency />
    </div>
  );
}
