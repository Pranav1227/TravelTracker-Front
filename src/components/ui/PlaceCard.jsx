import { Check, MapPin, Bookmark, Camera, Image as ImageIcon } from 'lucide-react';

const categoryColors = {
  country: 'bg-blue-50 text-blue-700 border-blue-200',
  state: 'bg-purple-50 text-purple-700 border-purple-200',
  city: 'bg-orange-50 text-orange-700 border-orange-200',
  wonder: 'bg-amber-50 text-amber-700 border-amber-200',
  fort: 'bg-red-50 text-red-700 border-red-200',
  landmark: 'bg-zinc-50 text-zinc-700 border-zinc-200',
};

const categoryIcons = {
  country: '🌍',
  state: '🏛️',
  city: '🏙️',
  wonder: '✨',
  fort: '🏰',
  landmark: '📍',
};

const PlaceCard = ({
  place,
  isVisited,
  isBucketList,
  onToggle,
  onToggleBucketList,
  isToggling,
  onExploreState,
  onExploreCity,
  onExploreCountry,
  onAddMemory,
  visitRecord,
}) => {
  const isParentCategory =
    place.category === 'state' ||
    place.category === 'city' ||
    place.category === 'country';

  const handleCardClick = () => {
    if (place.category === 'state' && onExploreState) {
      onExploreState(place);
    } else if (place.category === 'city' && onExploreCity) {
      onExploreCity(place);
    } else if (place.category === 'country' && onExploreCountry) {
      onExploreCountry(place);
    } else {
      onToggle(place._id);
    }
  };

  return (
    <div
      className={`card group cursor-pointer transition-all duration-200 hover:border-zinc-300 relative overflow-hidden bg-white border border-zinc-200 ${
        isVisited ? 'bg-zinc-50' : ''
      }`}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between gap-3">
        {visitRecord?.memoryPhotoUrl && !isParentCategory && (
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-200">
            <img src={`http://localhost:5000${visitRecord.memoryPhotoUrl}`} alt="Memory" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {/* Category badge */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md border mb-3 ${
              categoryColors[place.category] || 'bg-zinc-50 text-zinc-600 border-zinc-200'
            }`}
          >
            <span>{categoryIcons[place.category]}</span>
            {place.category}
          </span>

          {/* Place name */}
          <h3 className="text-base font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors truncate">
            {place.name}
          </h3>

          {/* Location */}
          {(place.country || place.state) && (
            <div className="flex items-center gap-1 mt-1 text-sm text-zinc-400">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">
                {[place.state, place.country].filter(Boolean).join(', ')}
              </span>
            </div>
          )}

          {/* Description */}
          {place.description && (
            <p className="mt-2 text-sm text-zinc-500 line-clamp-2">
              {place.description}
            </p>
          )}

          {/* Action indicator for parent regions */}
          {isParentCategory && (
            <div className="mt-3 text-xs text-zinc-500 group-hover:text-zinc-700 font-medium flex items-center gap-1">
              Explore nested destinations →
            </div>
          )}
        </div>

        {/* Toggle / Completion indicator button */}
        {isParentCategory ? (
          <div className="flex flex-col items-end gap-1">
            <div
              title={isVisited ? 'Explored' : 'Not Explored Yet'}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                isVisited
                  ? 'bg-primary-600 text-white font-semibold'
                  : (place.explorePercentage > 0)
                  ? 'bg-primary-50 text-primary-700 border border-primary-100 font-bold'
                  : 'bg-zinc-100 text-zinc-400 border border-zinc-200 font-bold'
              }`}
            >
              {isVisited ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-[10px]">
                  {place.explorePercentage ?? 0}%
                </span>
              )}
            </div>
            {place.totalSubPlaces !== undefined && (
              <span className="text-[10px] font-medium text-zinc-400 whitespace-nowrap">
                {place.visitedSubPlaces}/{place.totalSubPlaces} places
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleBucketList) onToggleBucketList(place._id);
              }}
              disabled={isToggling}
              title={isBucketList ? "Remove from Bucket List" : "Add to Bucket List"}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                isBucketList
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-zinc-50 text-zinc-300 hover:bg-zinc-100 hover:text-amber-500 border border-zinc-100'
              } ${isToggling ? 'opacity-50' : ''}`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBucketList ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle(place._id);
              }}
              disabled={isToggling}
              title={isVisited ? "Remove Visit" : "Mark as Visited"}
              className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                isVisited
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-300 hover:bg-zinc-200 hover:text-zinc-600 border border-zinc-200'
              } ${isToggling ? 'animate-pulse' : ''}`}
            >
              <Check className="w-4 h-4" />
            </button>
            {isVisited && onAddMemory && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddMemory(place);
                }}
                title="Add Memory Photo"
                className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-100 mt-1"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceCard;
