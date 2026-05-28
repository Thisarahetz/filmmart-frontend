import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLoading() {
  return (
    <div className="p-6 max-w-5xl" aria-busy="true">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((n) => <Skeleton key={n} className="h-24 rounded-xl" />)}
      </div>
      <Skeleton className="h-6 w-40 mb-3" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}
