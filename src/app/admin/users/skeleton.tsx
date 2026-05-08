import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUsersSkeleton() {
  return (
    <div className="flex flex-col gap-4 min-h-[80vh] pt-5">
      {/* Skeleton for StatCard */}
      <div className="bg-secondary flex items-center gap-4 p-4 border rounded-lg shadow-sm">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>

      {/* Skeleton for DataTable */}
      <div className="space-y-4">
        {/* Table header filters */}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-64" />
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <div className="p-4">
            <Skeleton className="h-10 w-full mb-2" />
            {[...Array(5)].map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static
              <Skeleton key={i} className="h-10 w-full mb-2" />
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-64" />
        </div>
      </div>
    </div>
  );
}
