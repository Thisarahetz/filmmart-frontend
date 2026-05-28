import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="bg-black min-h-screen pt-14" aria-busy="true" aria-label="Loading content">
      {/* Hero skeleton */}
      <Skeleton className="h-[60vh] w-full rounded-none" />

      {/* List skeletons */}
      <div className="mt-6 space-y-8 px-12">
        {[1, 2, 3].map((n) => (
          <div key={n}>
            <Skeleton className="h-5 w-48 mb-3" />
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-[120px] w-[225px] shrink-0" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
