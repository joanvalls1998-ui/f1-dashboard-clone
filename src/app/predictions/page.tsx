import PredictEngine from "@/components/PredictEngine";

export default function PredictionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Predicción Táctica</h1>
        <p className="text-muted-foreground">
          Análisis táctico y predicciones de carrera.
        </p>
      </div>
      <PredictEngine raceName="Gran Premio de Emilia-Romaña" />
    </div>
  );
}
