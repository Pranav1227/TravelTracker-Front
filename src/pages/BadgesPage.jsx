import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBadges } from '../store/slices/badgeSlice';
import BadgeCard from '../components/ui/BadgeCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Trophy } from 'lucide-react';

const BadgesPage = () => {
  const dispatch = useDispatch();
  const { badges, loading } = useSelector((state) => state.badges);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchBadges());
  }, [dispatch]);

  // Build a map of earned badges
  const earnedMap = {};
  if (user?.badges) {
    user.badges.forEach((ub) => {
      const badgeId = typeof ub.badge === 'object' ? ub.badge._id : ub.badge;
      earnedMap[badgeId] = ub.awardedAt;
    });
  }

  const earnedCount = Object.keys(earnedMap).length;

  if (loading) return <LoadingSpinner text="Loading badges..." />;

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2 tracking-tight">Badges</h1>
          <p className="text-zinc-500">
            Collect badges by exploring and discovering hidden gems.{' '}
            <span className="text-zinc-900 font-semibold">
              {earnedCount}
            </span>{' '}
            earned out of{' '}
            <span className="text-zinc-900 font-semibold">{badges.length}</span>.
          </p>
        </div>

        {/* Summary card */}
        <div className="card mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-zinc-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-zinc-900">Your Collection</h2>
              <p className="text-sm text-zinc-500">
                Keep exploring to unlock more badges!
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-zinc-900">
                {earnedCount}/{badges.length}
              </div>
              <div className="text-xs text-zinc-400">Badges Earned</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-600 to-accent-500 rounded-full transition-all duration-1000"
                style={{
                  width: `${badges.length > 0 ? (earnedCount / badges.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Badge Grid */}
        {badges.length === 0 ? (
          <div className="card text-center py-16">
            <HiTrophy className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-zinc-500 mb-2">
              No badges available yet
            </h3>
            <p className="text-sm text-zinc-400">
              Badges will appear here once they're created by admins.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-stagger">
            {/* Show earned badges first */}
            {[...badges]
              .sort((a, b) => {
                const aEarned = !!earnedMap[a._id];
                const bEarned = !!earnedMap[b._id];
                if (aEarned && !bEarned) return -1;
                if (!aEarned && bEarned) return 1;
                return 0;
              })
              .map((badge) => (
                <BadgeCard
                  key={badge._id}
                  badge={badge}
                  earned={!!earnedMap[badge._id]}
                  awardedAt={earnedMap[badge._id]}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgesPage;
