const SkeletonCard = () => (
  <div className="card space-y-4 animate-pulse">
    <div className="skeleton h-5 w-3/4" />
    <div className="skeleton h-4 w-1/2" />
    <div className="flex gap-2 mt-4">
      <div className="skeleton h-8 w-24 rounded-xl" />
      <div className="skeleton h-8 w-20 rounded-xl" />
    </div>
  </div>
);

export const SkeletonList = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

export default SkeletonCard;
