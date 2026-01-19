import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSpinnerProps {
  className?: string;
  count?: number;
}

export function LoadingSpinner({ className, count = 1 }: LoadingSpinnerProps) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
      ))}
    </div>
  );
}
