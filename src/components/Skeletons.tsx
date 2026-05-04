// Lightweight skeleton components using Tailwind only (no shadcn dep)

const SkeletonBox = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-zinc-800 rounded ${className}`} />
);

export function DriverStandingsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,0,2].map((_, i) => (
          <div key={i} className="card">
            <SkeletonBox className="h-1 w-full rounded-t-xl mb-4" />
            <SkeletonBox className="w-16 h-16 rounded-full mx-auto mb-3" />
            <SkeletonBox className="h-5 w-24 mx-auto mb-2" />
            <SkeletonBox className="h-4 w-16 mx-auto mb-4" />
            <SkeletonBox className="h-8 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConstructorStandingsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="card">
          <div className="flex items-center gap-3 mb-3">
            <SkeletonBox className="w-8 h-8 rounded" />
            <SkeletonBox className="flex-1 h-5" />
          </div>
          <SkeletonBox className="h-3 w-24 mb-2" />
          <SkeletonBox className="h-2 w-full rounded-full mb-3" />
          <div className="flex gap-2">
            <SkeletonBox className="w-16 h-6 rounded-full" />
            <SkeletonBox className="w-12 h-6 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RaceCalendarSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-3 mb-6">
        <SkeletonBox className="h-10 flex-1 rounded-lg" />
        <SkeletonBox className="h-10 w-10 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card">
            <SkeletonBox className="h-32 w-full rounded-lg mb-4" />
            <SkeletonBox className="h-5 w-32 mb-2" />
            <SkeletonBox className="h-4 w-24 mb-3" />
            <div className="flex gap-2">
              <SkeletonBox className="w-12 h-6 rounded-full" />
              <SkeletonBox className="w-16 h-6 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DriversListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="card">
          <SkeletonBox className="h-24 w-full rounded-lg mb-3" />
          <SkeletonBox className="h-5 w-28 mb-2" />
          <SkeletonBox className="h-4 w-20 mb-2" />
          <SkeletonBox className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="card space-y-3">
      <div className="flex gap-3 pb-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBox key={i} className="h-5 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3 py-2">
          {Array.from({ length: 6 }).map((_, j) => (
            <SkeletonBox key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonBox className="h-8 w-48 mb-2" />
      <SkeletonBox className="h-12 w-72 mb-6" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card">
            <div className="flex items-center gap-3">
              <SkeletonBox className="w-10 h-10 rounded-lg" />
              <div>
                <SkeletonBox className="h-5 w-20 mb-1" />
                <SkeletonBox className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
