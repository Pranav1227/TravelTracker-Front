import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBadges } from '../store/slices/badgeSlice';
import BadgeCard from '../components/ui/BadgeCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import { Trophy, Copy, Check } from 'lucide-react';
import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';

const BadgesPage = () => {
  const dispatch = useDispatch();
  const { badges, loading } = useSelector((state) => state.badges);
  const { user } = useSelector((state) => state.auth);
  
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [copied, setCopied] = useState(false);

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

  const handleBadgeClick = (badge, earned) => {
    if (!earned) return;
    setSelectedBadge({
      ...badge,
      awardedAt: earnedMap[badge._id]
    });
    setCopied(false);
  };

  if (loading) return <LoadingSpinner text="Loading badges..." />;

  return (
    <div className="w-full pb-12 animate-fade-in">
      {/* Header */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
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
        <div className="card mb-8 animate-slide-up hover:-translate-y-1 hover:shadow-xl transition-all duration-300" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-zinc-600 animate-pulse" />
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
          <div className="card text-center py-16 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            <Trophy className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-zinc-500 mb-2">
              No badges available yet
            </h3>
            <p className="text-sm text-zinc-400">
              Badges will appear here once they're created by admins.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-stagger" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
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
                  onClick={() => handleBadgeClick(badge, !!earnedMap[badge._id])}
                />
              ))}
          </div>
        )}
      {selectedBadge && (
        <Modal
          isOpen={!!selectedBadge}
          onClose={() => setSelectedBadge(null)}
          title="Share Achievement"
          maxWidth="max-w-sm"
        >
          <div className="text-center py-2">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 rounded-full bg-zinc-100 scale-125 animate-ping opacity-25" />
              <span className="text-6xl relative z-10 filter drop-shadow-md hover:scale-110 transition-transform duration-300 cursor-default inline-block">
                {selectedBadge.icon || '🏆'}
              </span>
            </div>

            <h3 className="text-lg font-bold text-zinc-900 mb-1">{selectedBadge.name}</h3>
            <div className="flex justify-center mb-3">
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border bg-zinc-50 border-zinc-200 text-zinc-600">
                {selectedBadge.level} Class
              </span>
            </div>

            <p className="text-xs text-zinc-500 max-w-xs mx-auto mb-5">
              {selectedBadge.description}
            </p>

            {selectedBadge.awardedAt && (
              <div className="text-[10px] text-zinc-400 mb-5 bg-zinc-50 py-1.5 rounded-lg border border-zinc-100">
                Earned on {new Date(selectedBadge.awardedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            )}

            <div className="space-y-2 text-left">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">Share on Social Media</span>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    const shareText = `I just unlocked the '${selectedBadge.name}' badge on TravelTracker! 🌍✨ ${selectedBadge.description}`;
                    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.origin)}`;
                    window.open(twitterUrl, '_blank');
                  }}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-700 transition-colors shadow-sm"
                >
                  <FaTwitter className="w-4 h-4 text-[#1DA1F2]" />
                  <span className="text-[10px] font-medium">X / Twitter</span>
                </button>

                <button
                  onClick={() => {
                    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`;
                    window.open(facebookUrl, '_blank');
                  }}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-700 transition-colors shadow-sm"
                >
                  <FaFacebook className="w-4 h-4 text-[#1877F2]" />
                  <span className="text-[10px] font-medium">Facebook</span>
                </button>

                <button
                  onClick={() => {
                    const shareText = `I just unlocked the '${selectedBadge.name}' badge on TravelTracker! 🌍✨`;
                    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(shareText)}`;
                    window.open(linkedinUrl, '_blank');
                  }}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-700 transition-colors shadow-sm"
                >
                  <FaLinkedin className="w-4 h-4 text-[#0A66C2]" />
                  <span className="text-[10px] font-medium">LinkedIn</span>
                </button>
              </div>

              <button
                onClick={() => {
                  const shareText = `I just unlocked the '${selectedBadge.name}' badge on TravelTracker! 🌍✨ ${selectedBadge.description}`;
                  navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-zinc-950 hover:bg-zinc-900 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> Copied Text!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Share Text
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BadgesPage;
