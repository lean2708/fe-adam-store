import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  )
}

interface ProductCardSkeletonProps {
  className?: string
}

function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      <Skeleton className="aspect-[3/4] rounded-lg mb-3" />
      <Skeleton className="h-4 rounded mb-2" />
      <Skeleton className="h-4 rounded w-2/3" />
    </div>
  )
}

interface CategorySkeletonProps {
  className?: string
}

function CategorySkeleton({ className }: CategorySkeletonProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      <Skeleton className="aspect-square rounded-lg mb-2" />
      <Skeleton className="h-4 rounded w-3/4 mx-auto" />
    </div>
  )
}

interface ProductCardWithColorsSkeletonProps {
  className?: string
}

function ProductCardWithColorsSkeleton({ className }: ProductCardWithColorsSkeletonProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      <Skeleton className="aspect-[3/4] rounded-lg mb-3" />
      <div className="flex gap-2 mb-3">
        <Skeleton className="w-12 h-7 rounded-full" />
        <Skeleton className="w-12 h-7 rounded-full" />
      </div>
      <Skeleton className="h-4 rounded mb-2" />
      <Skeleton className="h-4 rounded w-2/3" />
    </div>
  )
}

export { Skeleton, ProductCardSkeleton, CategorySkeleton, ProductCardWithColorsSkeleton }
