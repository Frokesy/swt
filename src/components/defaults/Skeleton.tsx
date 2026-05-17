type SkeletonProps = {
  className?: string;
};

export const Skeleton = ({ className = '' }: SkeletonProps) => (
  <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
);

export const ProductCardSkeleton = () => (
  <div className="border border-gray-200 rounded-lg p-3 flex flex-col space-y-3 bg-white shadow-sm">
    <Skeleton className="h-[160px] w-full rounded-md" />
    <Skeleton className="h-4 w-4/5" />
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid lg:grid-cols-4 grid-cols-2 gap-5 my-10">
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

export const PageBlockSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-24 w-full rounded-xl" />
    <Skeleton className="h-24 w-full rounded-xl" />
  </div>
);
