"use client";

import { Download } from "lucide-react";

interface ExportCSVProps {
  data: Record<string, any>[];
  filename: string;
  label?: string;
}

export default function ExportCSV({ data, filename, label = "Exportar CSV" }: ExportCSVProps) {
  function download() {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((h) => {
        const v = row[h];
        return typeof v === "string" && v.includes(",") ? `"${v}"` : String(v);
      }).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={download}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border hover:scale-[1.02]"
      style={{ borderColor: "var(--bg-overlay)", color: "var(--text-secondary)" }}
      disabled={!data || data.length === 0}
    >
      <Download className="w-3 h-3" />
      {label}
    </button>
  );
}
