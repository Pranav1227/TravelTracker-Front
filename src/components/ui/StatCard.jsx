const ProgressRing = ({ percentage = 0, size = 72, strokeWidth = 5 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#f4f4f5"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#18181b"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
};

const StatCard = ({ icon, label, value, total, percentage, delay = 0 }) => {
  return (
    <div
      className="card group hover:border-zinc-300 transition-all duration-200"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{icon}</span>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">{label}</h3>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-zinc-900">{value}</span>
            {total !== undefined && (
              <span className="text-sm text-zinc-400">/ {total}</span>
            )}
          </div>
          {percentage !== undefined && (
            <div className="mt-1.5 text-xs text-zinc-500 font-medium">
              {percentage}% explored
            </div>
          )}
        </div>
        {percentage !== undefined && (
          <div className="relative">
            <ProgressRing percentage={percentage} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-zinc-900">{percentage}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
