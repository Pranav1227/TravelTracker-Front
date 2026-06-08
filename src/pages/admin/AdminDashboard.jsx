import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchDashboardStats } from '../../store/slices/adminSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Users, MapPin, Eye, Sparkles, Trophy, ArrowRight } from 'lucide-react';

const statCards = [
  { key: 'totalUsers', label: 'Total Users', icon: <Users className="w-5 h-5" /> },
  { key: 'totalPlaces', label: 'Total Places', icon: <MapPin className="w-5 h-5" /> },
  { key: 'totalVisits', label: 'Total Visits', icon: <Eye className="w-5 h-5" /> },
  { key: 'pendingGems', label: 'Pending Gems', icon: <Sparkles className="w-5 h-5" /> },
  { key: 'totalBadges', label: 'Total Badges', icon: <Trophy className="w-5 h-5" /> },
];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats, loading } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(fetchDashboardStats()); }, [dispatch]);

  if (loading || !dashboardStats) return <LoadingSpinner text="Loading admin dashboard..." />;

  return (
    <div className="w-full pb-12 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2 tracking-tight">Admin Dashboard</h1>
          <p className="text-zinc-500">Overview of your platform's activity.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8 animate-stagger">
          {statCards.map((sc) => (
            <div key={sc.key} className="card hover:border-zinc-300 transition-all duration-200">
              <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center mb-3">{sc.icon}</div>
              <div className="text-2xl font-bold text-zinc-900">{dashboardStats[sc.key]}</div>
              <div className="text-xs text-zinc-400 mt-1">{sc.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {[
            { to: '/admin/places', label: 'Manage Places', desc: 'Add, edit, delete', icon: <MapPin className="w-4 h-4" /> },
            { to: '/admin/gems', label: 'Review Gems', desc: `${dashboardStats.pendingGems} pending`, icon: <Sparkles className="w-4 h-4" /> },
            { to: '/admin/users', label: 'Manage Users', desc: `${dashboardStats.totalUsers} users`, icon: <Users className="w-4 h-4" /> },
          ].map((link) => (
            <Link key={link.to} to={link.to} className="card group hover:border-zinc-300 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center">{link.icon}</div>
                  <div>
                    <h3 className="font-medium text-zinc-900 text-sm">{link.label}</h3>
                    <p className="text-xs text-zinc-400">{link.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        {/* Top Explorers */}
        {dashboardStats.topExplorers?.length > 0 && (
          <div className="card">
            <h2 className="text-base font-semibold text-zinc-900 mb-4">🏆 Top Explorers</h2>
            <div className="space-y-2">
              {dashboardStats.topExplorers.map((exp, i) => (
                <div key={exp._id} className="flex items-center gap-4 p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                  <span className="text-base font-bold text-zinc-400 w-8 text-center">#{i + 1}</span>
                  <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white font-semibold text-sm">{exp.name?.charAt(0)}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-zinc-900">{exp.name}</div>
                    <div className="text-xs text-zinc-400">{exp.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-zinc-900">{exp.visitCount}</div>
                    <div className="text-xs text-zinc-400">visits</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
  );
};

export default AdminDashboard;
