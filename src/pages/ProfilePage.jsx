import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile } from '../store/slices/authSlice';
import { fetchExplorationStats } from '../store/slices/visitSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiUserCircle, HiPencilSquare, HiCalendarDays, HiEnvelope, HiShieldCheck } from 'react-icons/hi2';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, profileLoading } = useSelector((s) => s.auth);
  const { stats } = useSelector((s) => s.visits);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', avatar: '' });

  useEffect(() => {
    dispatch(getProfile());
    dispatch(fetchExplorationStats());
  }, [dispatch]);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', avatar: user.avatar || '' });
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(form)).unwrap();
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) { toast.error(err || 'Failed'); }
  };

  if (!user) return <LoadingSpinner text="Loading profile..." />;

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-8 tracking-tight">Profile</h1>

        {/* Profile Card */}
        <div className="mb-6 card">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-xl bg-zinc-900 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-zinc-900">{user.name}</h2>
                {user.role === 'admin' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-xs font-medium">
                    <HiShieldCheck className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 text-sm text-zinc-500">
                <span className="flex items-center gap-1"><HiEnvelope className="w-4 h-4" />{user.email}</span>
                {user.createdAt && <span className="flex items-center gap-1"><HiCalendarDays className="w-4 h-4" />Joined {new Date(user.createdAt).toLocaleDateString()}</span>}
              </div>
            </div>
            <button onClick={() => setEditing(!editing)} className="btn-secondary !px-4 !py-2 flex items-center gap-2 text-sm">
              <HiPencilSquare className="w-4 h-4" />
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="card mb-6 animate-slide-down">
            <h3 className="text-base font-semibold text-zinc-900 mb-4">Edit Profile</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Avatar URL</label>
                <input type="url" value={form.avatar} onChange={(e) => setForm({...form, avatar: e.target.value})} placeholder="https://..." className="input-field" />
              </div>
              <button type="submit" disabled={profileLoading} className="btn-primary">
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Stats Summary */}
        {stats?.overall && (
          <div className="card mb-6">
            <h3 className="text-base font-semibold text-zinc-900 mb-4">Exploration Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(stats).filter(([k]) => k !== 'overall').map(([key, val]) => (
                <div key={key} className="bg-zinc-50 rounded-lg p-4 text-center border border-zinc-100">
                  <div className="text-xl font-bold text-zinc-900">{val.visited}</div>
                  <div className="text-xs text-zinc-500 capitalize">{key}s visited</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{val.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges */}
        {user.badges?.length > 0 && (
          <div className="card">
            <h3 className="text-base font-semibold text-zinc-900 mb-4">Earned Badges ({user.badges.length})</h3>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((ub, i) => {
                const badge = typeof ub.badge === 'object' ? ub.badge : null;
                return badge ? (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-100">
                    <span className="text-lg">{badge.icon || '🏆'}</span>
                    <div>
                      <div className="text-sm font-medium text-zinc-900">{badge.name}</div>
                      <div className="text-xs text-zinc-400">{new Date(ub.awardedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
