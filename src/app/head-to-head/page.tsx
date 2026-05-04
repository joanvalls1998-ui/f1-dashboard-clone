import { HeadToHead } from "@/components/HeadToHead";

export default function HeadToHeadPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Head to Head</h1>
        <p className="text-[var(--text-secondary)]">
          Compare drivers head-to-head across the 2026 season.
        </p>
      </div>
      <HeadToHead />
    </div>
  );
}
