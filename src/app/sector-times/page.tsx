import { SectorTimes } from "@/components/SectorTimes";

export const metadata = {
  title: "Temps per Sector F1 2026",
  description: "Temps per sector de la Fórmula 1 2026. Anàlisi de sectors, mini-sectors i velocitat.",
};

export default function SectorTimesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Sector Times</h1>
        <p className="text-gray-400">
          Detailed sector time analysis for all drivers.
        </p>
      </div>
      <SectorTimes />
    </div>
  );
}
