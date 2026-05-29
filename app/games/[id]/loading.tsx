import { Skeleton } from '@/components/ui/skeleton';

export default function GameDetailLoading() {
  return (
    <div className="bg-black min-h-screen pt-14" aria-busy="true">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-10 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24 rounded-sm" />
          <Skeleton className="h-6 w-20 rounded-sm" />
        </div>
        <Skeleton className="h-80 w-64 mx-auto rounded-lg" />
        <Skeleton className="h-24 w-full" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-7 w-20 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
