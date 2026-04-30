import { TyreStrategy } from "@/components/TyreStrategy";

export default function TyreStrategyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tyre Strategy</h1>
        <p className="text-muted-foreground">
          Tyre compounds and stint analysis.
        </p>
      </div>
      <TyreStrategy />
    </div>
  );
}
