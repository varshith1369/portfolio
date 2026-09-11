import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "card" | "text" | "image";
}

const LoadingSkeleton = ({ className, variant = "card" }: LoadingSkeletonProps) => {
  if (variant === "card") {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="aspect-editorial bg-muted rounded-2xl" />
        <div className="p-4 space-y-2">
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (variant === "image") {
    return (
      <div className={cn("animate-pulse aspect-wide bg-muted rounded-2xl", className)} />
    );
  }

  return (
    <div className={cn("animate-pulse h-4 bg-muted rounded", className)} />
  );
};

export default LoadingSkeleton;
