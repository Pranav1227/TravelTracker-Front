import React from 'react';

const PlaceCardSkeleton = () => {
  return (
    <div className="card border border-zinc-200 relative overflow-hidden bg-white p-5">
      <div className="flex items-start justify-between gap-3 animate-pulse">
        <div className="flex-1 min-w-0">
          {/* Category badge skeleton */}
          <div className="h-5 w-20 bg-zinc-200 rounded-md mb-3"></div>

          {/* Place name skeleton */}
          <div className="h-5 w-3/4 bg-zinc-200 rounded mb-2"></div>

          {/* Location skeleton */}
          <div className="flex items-center gap-1 mt-1">
            <div className="h-4 w-4 bg-zinc-200 rounded-full"></div>
            <div className="h-4 w-1/2 bg-zinc-200 rounded"></div>
          </div>

          {/* Description skeleton */}
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full bg-zinc-100 rounded"></div>
            <div className="h-3 w-5/6 bg-zinc-100 rounded"></div>
          </div>
        </div>

        {/* Action button skeleton */}
        <div className="w-9 h-9 rounded-lg bg-zinc-200 flex-shrink-0"></div>
      </div>
    </div>
  );
};

export default PlaceCardSkeleton;
