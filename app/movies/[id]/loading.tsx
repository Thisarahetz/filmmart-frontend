import { Skeleton } from '@/components/ui/skeleton';

export default function MovieDetailLoading() {
  return (
    <div className="bg-black min-h-screen pt-14" aria-busy="true">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-72 w-full max-w-xl mx-auto rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-sm" />
          <Skeleton className="h-6 w-16 rounded-sm" />
        </div>
        <Skeleton className="h-24 w-full" />
        <div className="flex gap-8">
          <Skeleton className="flex-1 h-56 rounded-lg" />
          <Skeleton className="w-56 h-40 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
