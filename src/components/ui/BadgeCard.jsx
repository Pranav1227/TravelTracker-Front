const levelStyles = {
  bronze: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    label: 'Bronze',
  },
  silver: {
    bg: 'bg-zinc-50',
    border: 'border-zinc-200',
    text: 'text-zinc-600',
    label: 'Silver',
  },
  gold: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    label: 'Gold',
  },
  platinum: {
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-700',
    label: 'Platinum',
  },
  legendary: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    label: 'Legendary',
  },
};

const BadgeCard = ({ badge, earned = false, awardedAt, onClick }) => {
  const style = levelStyles[badge.level] || levelStyles.bronze;

  return (
    <div
      onClick={onClick}
      className={`relative card cursor-pointer transition-all duration-200 hover:border-zinc-300 ${
        earned
          ? ''
          : 'opacity-40 grayscale hover:opacity-60 hover:grayscale-0'
      }`}
    >
      {/* Icon */}
      <div className="text-center mb-3">
        <span className="text-3xl block">{badge.icon || '🏆'}</span>
      </div>

      {/* Name */}
      <h3 className="text-center text-sm font-semibold text-zinc-900 mb-1 truncate">
        {badge.name}
      </h3>

      {/* Level tag */}
      <div className="flex justify-center mb-2">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-md ${style.bg} ${style.text} border ${style.border}`}
        >
          {style.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-zinc-500 text-center line-clamp-2">
        {badge.description}
      </p>

      {/* Awarded date */}
      {earned && awardedAt && (
        <p className="text-xs text-zinc-400 text-center mt-2">
          Earned {new Date(awardedAt).toLocaleDateString()}
        </p>
      )}

      {/* Earned indicator */}
      {earned && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-900 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </div>
  );
};

export default BadgeCard;
