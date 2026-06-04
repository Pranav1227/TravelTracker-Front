import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchExplorationStats } from '../store/slices/visitSlice';
import StatCard from '../components/ui/StatCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  HiMapPin,
  HiTrophy,
  HiSparkles,
  HiArrowRight,
  HiCheckBadge,
  HiCalendarDays,
  HiGlobeAmericas,
} from 'react-icons/hi2';

const categoryInfo = {
  country: { icon: '🌍', label: 'Countries' },
  state: { icon: '🏛️', label: 'States' },
  city: { icon: '🏙️', label: 'Cities' },
  wonder: { icon: '✨', label: 'Wonders' },
  fort: { icon: '🏰', label: 'Forts' },
};

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, statsLoading } = useSelector((state) => state.visits);

  useEffect(() => {
    dispatch(fetchExplorationStats());
  }, [dispatch]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getExplorerRank = (totalVisits) => {
    if (!totalVisits || totalVisits === 0) return { title: 'Novice Explorer', desc: 'Log your first visit to start your journey.' };
    if (totalVisits < 3) return { title: 'Wayfinder', desc: 'You are discovering local treasures.' };
    if (totalVisits < 8) return { title: 'Globe Trekker', desc: 'An experienced explorer with a passion for travel.' };
    return { title: 'Legendary Pathfinder', desc: 'A master world conqueror.' };
  };

  const rank = getExplorerRank(stats?.overall?.visited);

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              {getGreeting()}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Track your exploration progress, collect achievements, and explore the world.
            </p>
          </div>
          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 text-xs font-semibold transition-all self-start sm:self-center"
          >
            How It Works & FAQ →
          </Link>
        </div>

        {/* Getting Started Guide */}
        <div className="card mb-8 bg-zinc-50/50">
          <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2 mb-4">
            <HiGlobeAmericas className="w-4 h-4 text-zinc-700" /> Getting Started Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">1. Find Destinations</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Go to the <Link to="/explore" className="text-zinc-900 font-medium underline underline-offset-2">Explore</Link> page. Browse through lists of countries, cities, or wonders of the world.
              </p>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">2. Log Your Visits</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Click on the circular checkmarks to log a place as visited. Your stats and overall completion bar will update instantly.
              </p>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">3. Submit Hidden Gems</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Have a secret spot? Submit it on the <Link to="/hidden-gems" className="text-zinc-900 font-medium underline underline-offset-2">Hidden Gems</Link> page to have it reviewed and verified by admins.
              </p>
            </div>
          </div>
        </div>

        {/* Rank + Overall Progress Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Rank Card */}
          <div className="card">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Explorer Rank</div>
            <div className="text-lg font-bold text-zinc-900">{rank.title}</div>
            <p className="text-sm text-zinc-500 mt-1">{rank.desc}</p>
          </div>

          {/* Overall Progress */}
          {stats?.overall && (
            <div className="card lg:col-span-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Overall Progress</div>
                  <p className="text-sm text-zinc-600">
                    <span className="text-zinc-900 font-bold text-lg">{stats.overall.visited}</span>
                    <span className="text-zinc-400"> / {stats.overall.total} destinations</span>
                  </p>
                </div>
                <div className="w-full sm:w-64">
                  <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                    <span className="text-zinc-400">Completion</span>
                    <span className="text-zinc-900 font-semibold">{stats.overall.percentage}%</span>
                  </div>
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${stats.overall.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Stats */}
        {statsLoading ? (
          <LoadingSpinner text="Loading your exploration stats..." />
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 animate-stagger">
            {Object.entries(categoryInfo).map(([key, info], idx) => {
              const catStat = stats[key] || { visited: 0, total: 0, percentage: 0 };
              return (
                <StatCard
                  key={key}
                  icon={info.icon}
                  label={info.label}
                  value={catStat.visited}
                  total={catStat.total}
                  percentage={catStat.percentage}
                  delay={idx * 60}
                />
              );
            })}
          </div>
        ) : null}

        {/* Badges and Profile Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Recent Badges */}
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <HiCheckBadge className="w-4 h-4 text-zinc-400" /> Recent Achievements
              </h3>
              <Link to="/badges" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-0.5 transition-colors">
                All Badges <HiArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {user?.badges?.length === 0 ? (
              <div className="py-8 text-center text-zinc-400 text-sm">
                No badges earned yet. Start exploring to unlock achievements!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user?.badges?.slice(-2).map((ub, idx) => {
                  const badge = typeof ub.badge === 'object' ? ub.badge : null;
                  return badge ? (
                    <div key={idx} className="p-4 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center gap-3 hover:border-zinc-200 transition-colors">
                      <span className="text-2xl">{badge.icon || '🏆'}</span>
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-900">{badge.name}</h4>
                        <p className="text-xs text-zinc-500 mt-0.5">{badge.description}</p>
                        <span className="inline-block mt-1.5 text-xs text-zinc-500 font-medium bg-zinc-100 px-2 py-0.5 rounded capitalize">
                          {badge.level}
                        </span>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Profile Summary */}
          <div className="card">
            <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2 mb-4">
              <HiCalendarDays className="w-4 h-4 text-zinc-400" /> Summary
            </h3>
            <div className="space-y-0">
              <div className="flex justify-between items-center text-sm py-3">
                <span className="text-zinc-500">Total Visited</span>
                <span className="font-semibold text-zinc-900">{stats?.overall?.visited || 0}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-3 border-t border-zinc-100">
                <span className="text-zinc-500">Badges Earned</span>
                <span className="font-semibold text-zinc-900">{user?.badges?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-3 border-t border-zinc-100">
                <span className="text-zinc-500">Role</span>
                <span className="font-semibold capitalize text-zinc-900">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mb-2">
          <h2 className="text-sm font-semibold text-zinc-900 mb-3">Quick Navigation</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-stagger">
          <Link
            to="/explore"
            className="card group hover:border-zinc-300 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center">
                  <HiMapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium text-zinc-900 text-sm">Explore Places</h3>
                  <p className="text-xs text-zinc-400">Browse & log visits</p>
                </div>
              </div>
              <HiArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

          <Link
            to="/badges"
            className="card group hover:border-zinc-300 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center">
                  <HiTrophy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium text-zinc-900 text-sm">Your Badges</h3>
                  <p className="text-xs text-zinc-400">
                    {user?.badges?.length || 0} earned
                  </p>
                </div>
              </div>
              <HiArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

          <Link
            to="/hidden-gems"
            className="card group hover:border-zinc-300 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center">
                  <HiSparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium text-zinc-900 text-sm">Hidden Gems</h3>
                  <p className="text-xs text-zinc-400">Submit discoveries</p>
                </div>
              </div>
              <HiArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
