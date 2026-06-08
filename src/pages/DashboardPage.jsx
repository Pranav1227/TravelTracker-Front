import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchExplorationStats, fetchMyVisits } from '../store/slices/visitSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { MapPin, LayoutGrid, List } from 'lucide-react';

const ProgressRing = ({ percentage = 0, size = 96, strokeWidth = 8, color = '#18181b', trackColor = '#f4f4f5' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (percentage / 100) * circumference;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(targetOffset);
    }, 150);
    return () => clearTimeout(timer);
  }, [targetOffset]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
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
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-zinc-900">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, statsLoading, visits, loading: visitsLoading } = useSelector((state) => state.visits);

  useEffect(() => {
    dispatch(fetchExplorationStats());
    dispatch(fetchMyVisits());
  }, [dispatch]);

  const sortedVisits = visits ? [...visits].sort((a, b) => new Date(b.visitedAt) - new Date(a.visitedAt)) : [];
  const recentVisits = sortedVisits.slice(0, 5);
  const recentBadges = user?.badges?.slice(-2).reverse() || [];

  if (statsLoading || visitsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner text="Loading dashboard data..." />
      </div>
    );
  }

  // Ring data mapping based on design
  const rings = [
    { label: 'WORLD', percentage: stats?.overall?.percentage || 0, color: '#A0AEC0' },
    { label: 'COUNTRIES', percentage: stats?.country?.percentage || 0, color: '#2F855A' },
    { label: 'STATES', percentage: stats?.state?.percentage || 0, color: '#ED8936' },
    { label: 'CITIES', percentage: stats?.city?.percentage || 0, color: '#1A365D' },
  ];

  return (
    <div className="w-full pb-12 animate-fade-in">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A365D]">Welcome back, Explorer!</h1>
          <p className="text-zinc-500 mt-1">Your journey map is looking dense today.</p>
        </div>
        <Link 
          to="/explore" 
          className="flex items-center gap-2 bg-[#1A365D] hover:bg-[#112440] text-white px-5 py-2.5 rounded-lg font-semibold transition-colors self-start sm:self-auto shadow-sm"
        >
          <MapPin className="w-4 h-4" /> Log New Visit
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Exploration Progress Card */}
        <div className="card bg-white rounded-xl border border-zinc-200 shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-[#1A365D]">Exploration Progress</h2>
            <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Global Sync Active</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {rings.map((ring, idx) => (
              <div key={idx} className="flex flex-col items-center p-4 rounded-xl bg-[#F7FAFC] border border-zinc-100">
                <ProgressRing percentage={ring.percentage} color={ring.color} size={100} />
                <span className="text-xs font-bold text-zinc-400 tracking-widest uppercase mt-4">{ring.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Badge Showcase Card */}
        <div className="card bg-white rounded-xl border border-zinc-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#1A365D]">Badge Showcase</h2>
            <Link to="/badges" className="text-xs font-bold text-[#ED8936] hover:text-[#dd7d2e] transition-colors">
              View All
            </Link>
          </div>

          {recentBadges.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-zinc-400">
              No badges earned yet.
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              {recentBadges.map((ub, idx) => {
                const badge = typeof ub.badge === 'object' ? ub.badge : null;
                if (!badge) return null;
                
                // Calculate days ago
                const daysAgo = Math.floor((new Date() - new Date(ub.awardedAt)) / (1000 * 60 * 60 * 24));
                const timeText = daysAgo === 0 ? 'Today' : `${daysAgo}d ago`;

                return (
                  <div key={idx} className="flex items-center gap-4 p-3.5 rounded-xl border border-zinc-100 bg-[#F7FAFC]">
                    <div className="w-12 h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-2xl shadow-sm">
                      {badge.icon || '🏆'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1A365D]">{badge.name}</h4>
                      <p className="text-xs text-zinc-500 mt-0.5 capitalize">
                        {badge.level} • Earned {timeText}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Logs Table */}
      <div className="card bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-[#1A365D]">Recent Logs</h2>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded text-zinc-400 hover:text-[#1A365D] hover:bg-zinc-50 transition-colors">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded bg-[#F7FAFC] text-[#1A365D] border border-zinc-200 transition-colors">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 tracking-wider uppercase border-b border-zinc-100">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 tracking-wider uppercase border-b border-zinc-100">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 tracking-wider uppercase border-b border-zinc-100">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 tracking-wider uppercase border-b border-zinc-100">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {recentVisits.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-sm text-zinc-400">
                    No recent logs found. Start exploring!
                  </td>
                </tr>
              ) : (
                recentVisits.map((visit, idx) => (
                  <tr key={idx} className="hover:bg-[#F7FAFC]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-[#ED8936]/10 flex items-center justify-center text-[#ED8936]">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-[#1A365D]">{visit.place?.name || 'Unknown Place'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-500 capitalize">{visit.place?.category || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-500">
                        {new Date(visit.visitedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#2F855A]/10 text-[#2F855A]">
                        Verified
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
