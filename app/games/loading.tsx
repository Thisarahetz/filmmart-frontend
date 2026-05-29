import { Skeleton } from '@/components/ui/skeleton';

export default function GamesLoading() {
  return (
    <div className="bg-black min-h-screen pt-4" aria-busy="true">
      <div className="px-4 lg:px-6 mb-4">
        <div className="flex gap-2 overflow-x-hidden">
          {[1, 2, 3, 4, 5].map((n) => (
            <Skeleton key={n} className="h-8 w-28 rounded-full shrink-0" />
          ))}
        </div>
      </div>
      <div className="space-y-8 px-12">
        {[1, 2, 3].map((n) => (
          <div key={n}>
            <Skeleton className="h-5 w-64 mb-3" />
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-[240px] w-[160px] shrink-0" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
