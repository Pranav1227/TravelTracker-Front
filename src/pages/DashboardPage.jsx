import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchExplorationStats, fetchMyVisits } from '../store/slices/visitSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { MapPin, LayoutGrid, List, Download, Bookmark } from 'lucide-react';
import html2canvas from 'html2canvas';

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

  const completedVisits = visits ? visits.filter(v => v.status === 'visited').sort((a, b) => new Date(b.visitedAt) - new Date(a.visitedAt)) : [];
  const bucketListVisits = visits ? visits.filter(v => v.status === 'bucketlist').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
  const recentVisits = completedVisits.slice(0, 5);
  const recentBadges = user?.badges?.slice(-2).reverse() || [];
  
  const [activeTab, setActiveTab] = useState('logs');

  const exportStats = async () => {
    const element = document.getElementById('stats-export-template');
    if (element) {
      try {
        element.style.display = 'block';
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#1A365D' });
        element.style.display = 'none';
        const data = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = data;
        link.download = 'my-travel-stats.png';
        link.click();
      } catch (err) {
        console.error('Error exporting stats', err);
        element.style.display = 'none';
      }
    }
  };

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
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button 
            onClick={exportStats}
            className="flex items-center gap-2 bg-[#F7FAFC] hover:bg-zinc-100 text-[#1A365D] border border-zinc-200 px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Stats
          </button>
          <Link 
            to="/explore" 
            className="flex items-center gap-2 bg-[#1A365D] hover:bg-[#112440] text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
          >
            <MapPin className="w-4 h-4" /> Log Visit
          </Link>
        </div>
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

      {/* Tabs & Table */}
      <div className="card bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden mb-6">
        <div className="flex items-center border-b border-zinc-100">
          <button 
            className={`px-6 py-4 font-bold text-sm transition-colors border-b-2 ${activeTab === 'logs' ? 'text-[#1A365D] border-[#1A365D]' : 'text-zinc-400 border-transparent hover:text-zinc-600'}`}
            onClick={() => setActiveTab('logs')}
          >
            Recent Logs
          </button>
          <button 
            className={`px-6 py-4 font-bold text-sm transition-colors border-b-2 ${activeTab === 'bucketlist' ? 'text-[#1A365D] border-[#1A365D]' : 'text-zinc-400 border-transparent hover:text-zinc-600'}`}
            onClick={() => setActiveTab('bucketlist')}
          >
            Bucket List ({bucketListVisits.length})
          </button>
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
              {activeTab === 'logs' ? (
                recentVisits.length === 0 ? (
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
                          {visit.memoryPhotoUrl ? (
                            <img src={`http://localhost:5000${visit.memoryPhotoUrl}`} alt="Memory" className="w-10 h-10 rounded-md object-cover border border-zinc-200" />
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-[#ED8936]/10 flex items-center justify-center text-[#ED8936]">
                              <MapPin className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <span className="text-sm font-semibold text-[#1A365D] block">{visit.place?.name || 'Unknown Place'}</span>
                            {visit.memoryNote && <span className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{visit.memoryNote}</span>}
                          </div>
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
                )
              ) : (
                bucketListVisits.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-sm text-zinc-400">
                      Your bucket list is empty. Add places you want to visit!
                    </td>
                  </tr>
                ) : (
                  bucketListVisits.map((visit, idx) => (
                    <tr key={idx} className="hover:bg-[#F7FAFC]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-amber-100 flex items-center justify-center text-amber-600">
                            <Bookmark className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-semibold text-[#1A365D]">{visit.place?.name || 'Unknown Place'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-zinc-500 capitalize">{visit.place?.category || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-zinc-500">
                          {new Date(visit.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-700">
                          Bucket List
                        </span>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden Export Template */}
      <div id="stats-export-template" style={{ display: 'none', width: '800px', padding: '40px', background: 'linear-gradient(to bottom right, #1A365D, #112440)', borderRadius: '24px' }}>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' }}>TravelTracker</h1>
        <p style={{ color: '#E2E8F0', fontSize: '24px', marginBottom: '40px', fontWeight: '500' }}>
          I've explored <span style={{ color: '#48BB78', fontWeight: 'bold' }}>{stats?.overall?.percentage || 0}%</span> of the World! 🌍
        </p>
        <div style={{ display: 'flex', gap: '32px', justifyItems: 'center', marginBottom: '20px' }}>
            {rings.map((ring, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.1)', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '160px' }}>
                <ProgressRing percentage={ring.percentage} color={ring.color} trackColor="rgba(255,255,255,0.2)" size={100} />
                <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.1em', marginTop: '16px' }}>{ring.label}</span>
              </div>
            ))}
        </div>
        <p style={{ color: '#A0AEC0', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>Generated by TravelTracker App</p>
      </div>

    </div>
  );
};

export default DashboardPage;
