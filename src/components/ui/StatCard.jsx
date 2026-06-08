import { useState, useEffect } from 'react';

const ProgressRing = ({ percentage = 0, size = 72, strokeWidth = 5, color = '#18181b' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (percentage / 100) * circumference;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(targetOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [targetOffset]);

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
        stroke={color}
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
  const colorMap = {
    'Countries': '#10b981', // emerald
    'States': '#0ea5e9',    // sky
    'Cities': '#8b5cf6',    // violet
    'Wonders': '#f59e0b',   // amber
    'Forts': '#f43f5e',     // rose
    'Landmarks': '#6366f1'  // indigo
  };

  const glowMap = {
    'Countries': 'hover:shadow-emerald-500/10 hover:border-emerald-200',
    'States': 'hover:shadow-sky-500/10 hover:border-sky-200',
    'Cities': 'hover:shadow-violet-500/10 hover:border-violet-200',
    'Wonders': 'hover:shadow-amber-500/10 hover:border-amber-200',
    'Forts': 'hover:shadow-rose-500/10 hover:border-rose-200',
    'Landmarks': 'hover:shadow-indigo-500/10 hover:border-indigo-200'
  };

  const strokeColor = colorMap[label] || '#18181b';
  const glowClass = glowMap[label] || 'hover:shadow-zinc-500/10 hover:border-zinc-200';

  return (
    <div
      className={`card group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${glowClass}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl group-hover:scale-110 transition-transform duration-300 inline-block">{icon}</span>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide group-hover:text-zinc-600 transition-colors">{label}</h3>
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
          <div className="relative group-hover:scale-105 transition-transform duration-300">
            <ProgressRing percentage={percentage} color={strokeColor} />
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
