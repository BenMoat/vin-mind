import { Skeleton } from "@/components/ui/skeleton";

export default function CardSkeleton() {
  return (
    <div className="px-6 py-6 space-y-2 rounded-lg border text-center">
      <div className="space-y-2">
        <span className="flex items-center justify-center">
          <Skeleton className="h-6 w-[50px]" />
        </span>
        <div className="flex items-center justify-center">
          <Skeleton className="w-8 h-8 mr-2 rounded-full" />
          <Skeleton className="h-4 w-[50px]" />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Skeleton className="h-4 w-[140px]" />
      </div>
    </div>
  );
}
