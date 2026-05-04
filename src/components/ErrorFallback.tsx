"use client";

// Compatible amb react-error-boundary FallbackProps
interface Props {
  error: any;
  resetErrorBoundary: () => void;
}

export default function ErrorFallback({ error, resetErrorBoundary }: Props) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Algo ha sortit malament
        </h2>
        <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
          No hem pogut carregar les dades. Reintenta en uns segons.
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 rounded-lg font-medium text-sm transition-all"
          style={{ backgroundColor: "var(--accent-red)", color: "#fff" }}
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
