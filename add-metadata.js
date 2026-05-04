const fs = require('fs');
const path = require('path');

/** @type {Record<string, {title:string; description:string}>} */
const metaMap = {
  "consistency/page.tsx": {
    title: "Consistència F1 2026 — Estadístiques de Pilots",
    description: "Analitza la consistència dels pilots de Fórmula 1 2026. Voltes ràpides, estabilitat i rendiment per cursa.",
  },
  "destructors/page.tsx": {
    title: "Destructors Championship F1 2026",
    description: "Classificació de pilots amb més incidents, abandonaments i penalitzacions de la temporada 2026 de Fórmula 1.",
  },
  "dnf/page.tsx": {
    title: "Abandonaments F1 2026 — DNF",
    description: "Llista d'abandonaments (DNF) de la temporada 2026 de Fórmula 1. Causes, voltes i pilots afectats.",
  },
  "driver-comparison/page.tsx": {
    title: "Comparativa de Pilots F1 2026",
    description: "Compara pilots de Fórmula 1 2026. Estadístiques, rendiment i dades cara a cara.",
  },
  "driver-stats/page.tsx": {
    title: "Estadístiques de Pilots F1 2026",
    description: "Estadístiques detallades de pilots de Fórmula 1 2026. Punts, victòries, voltes ràpides i molt més.",
  },
  "engineer/page.tsx": {
    title: "Enginyer F1 — Estratègia i Dades",
    description: "Eina d'enginyer de Fórmula 1. Anàlisi tècnic, estratègia de curses i dades de rendiment.",
  },
  "favorito/page.tsx": {
    title: "Pilot Favorit F1 2026",
    description: "Selecciona i segueix el teu pilot favorit de la temporada 2026 de Fórmula 1.",
  },
  "head-to-head/page.tsx": {
    title: "Cara a Cara F1 2026 — Comparativa Directa",
    description: "Comparativa cara a cara de pilots de Fórmula 1 2026. Estadístiques directes i rendiment.",
  },
  "home-intel/page.tsx": {
    title: "Intel·ligència F1 — Anàlisi Avançada",
    description: "Intel·ligència de dades de Fórmula 1. Anàlisi avançada, prediccions i insights de la temporada 2026.",
  },
  "intervals/page.tsx": {
    title: "Intervals F1 — Temps entre Pilots",
    description: "Intervals entre pilots de Fórmula 1 2026. Gaps, diferències de temps i posicions en cursa.",
  },
  "live/page.tsx": {
    title: "Directe F1 — Cronometratge en Temps Real",
    description: "Segueix les sessions de Fórmula 1 en temps real amb cronometratge en directe, posicions i telemetry.",
  },
  "news/page.tsx": {
    title: "Notícies F1 2026 — Última Hora",
    description: "Notícies i actualitat de la Fórmula 1 2026. Últimes novetats, resultats i anàlisi.",
  },
  "pit-stops/page.tsx": {
    title: "Parades a Boxes F1 2026",
    description: "Anàlisi de parades a boxes de la temporada 2026 de Fórmula 1. Temps, estratègia i comparativa.",
  },
  "predictions/page.tsx": {
    title: "Prediccions F1 2026 — Resultats i Anàlisi",
    description: "Prediccions de resultats de Fórmula 1 2026. Machine learning, anàlisi estadística i pronòstics de curses.",
  },
  "qualifying/page.tsx": {
    title: "Classificació F1 2026 — Qualifying",
    description: "Resultats de classificació (qualifying) de la Fórmula 1 2026. Grid, Q1, Q2, Q3 i posicions de sortida.",
  },
  "race-history/page.tsx": {
    title: "Històric de Curses F1",
    description: "Històric de curses de Fórmula 1. Resultats passats, estadístiques i evolució de la temporada 2026.",
  },
  "race-mode/page.tsx": {
    title: "Mode Cursa F1 2026",
    description: "Mode cursa de Fórmula 1 2026. Visualització immersiva de dades en temps real durant la cursa.",
  },
  "race-pace/page.tsx": {
    title: "Ritme de Cursa F1 2026",
    description: "Analitza el ritme de cursa dels pilots de Fórmula 1 2026. Desgast de pneumàtics i consistència.",
  },
  "season-stats/page.tsx": {
    title: "Estadístiques de Temporada F1 2026",
    description: "Estadístiques globals de la temporada 2026 de Fórmula 1. Pilots, equips, curses i rècords.",
  },
  "sector-times/page.tsx": {
    title: "Temps per Sector F1 2026",
    description: "Temps per sector de la Fórmula 1 2026. Anàlisi de sectors, mini-sectors i velocitat.",
  },
  "speed-histogram/page.tsx": {
    title: "Histograma de Velocitat F1 2026",
    description: "Histograma de velocitat de Fórmula 1 2026. Distribució de velocitats per pilot i cursa.",
  },
  "speed-trap/page.tsx": {
    title: "Radar de Velocitat F1 2026",
    description: "Velocitat màxima i radar de velocitat de la Fórmula 1 2026. Speed trap i velocitats punta.",
  },
  "starting-grid/page.tsx": {
    title: "Graella de Sortida F1 2026",
    description: "Graella de sortida de la Fórmula 1 2026. Posicions, equips i comparativa de classificació.",
  },
  "teams/page.tsx": {
    title: "Equips F1 2026 — Informació i Estadístiques",
    description: "Informació i estadístiques dels equips de Fórmula 1 2026. Plantilles, punts i victòries.",
  },
  "tech-updates/page.tsx": {
    title: "Actualitzacions Tècniques F1 2026",
    description: "Últimes actualitzacions tècniques de la Fórmula 1 2026. Novetats, millores i canvis reguladors.",
  },
  "track-dna/page.tsx": {
    title: "ADN del Circuit F1 2026",
    description: "Anàlisi detallat dels circuits de Fórmula 1 2026. Característiques, sectors i dades tècniques.",
  },
  "track-map/page.tsx": {
    title: "Mapa del Circuit F1 2026",
    description: "Mapa interactiu dels circuits de Fórmula 1 2026. Traçats, alçades i punts clau.",
  },
  "tyre-strategy/page.tsx": {
    title: "Estratègia de Pneumàtics F1 2026",
    description: "Estratègia de pneumàtics de la Fórmula 1 2026. Compostos, desgast i parades a boxes.",
  },
  "used-elements/page.tsx": {
    title: "Elements Usats F1 2026",
    description: "Registre d'elements usats pels pilots de Fórmula 1 2026. Motor, caixa de canvis i components.",
  },
  "weather/page.tsx": {
    title: "Temps F1 2026 — Meteorologia de Curses",
    description: "Condicions meteorològiques de les curses de Fórmula 1 2026. Temperatura, pluja i vent.",
  },
};

const baseDir = path.resolve(__dirname, 'src/app');

function insertAfterImports(content, insert) {
  const lines = content.split('\n');
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*import\s+/.test(lines[i])) {
      lastImportIdx = i;
    }
  }
  if (lastImportIdx >= 0) {
    lines.splice(lastImportIdx + 1, 0, '', insert);
    return lines.join('\n');
  }
  return insert + '\n\n' + content;
}

for (const [relPath, meta] of Object.entries(metaMap)) {
  const filePath = path.join(baseDir, relPath);
  if (!fs.existsSync(filePath)) {
    console.log('MISSING', relPath);
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('export const metadata')) {
    console.log('SKIP', relPath);
    continue;
  }
  const metaBlock = `export const metadata = {
  title: "${meta.title}",
  description: "${meta.description}",
};`;
  const newContent = insertAfterImports(content, metaBlock);
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('DONE', relPath);
}
