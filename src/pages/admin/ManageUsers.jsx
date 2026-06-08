import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, changeUserRole, awardBadge } from '../../store/slices/adminSlice';
import { fetchBadges } from '../../store/slices/badgeSlice';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { Users, ShieldCheck, Trophy, Search } from 'lucide-react';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, usersLoading } = useSelector((s) => s.admin);
  const { badges } = useSelector((s) => s.badges);
  const [search, setSearch] = useState('');
  const [badgeModal, setBadgeModal] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState('');

  useEffect(() => { dispatch(fetchAllUsers()); dispatch(fetchBadges()); }, [dispatch]);

  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change role to ${newRole}?`)) return;
    try {
      await dispatch(changeUserRole({ id, role: newRole })).unwrap();
      toast.success(`Role changed to ${newRole}`);
    } catch (err) { toast.error(err || 'Failed'); }
  };

  const handleAwardBadge = async () => {
    if (!selectedBadge || !badgeModal) return;
    try {
      await dispatch(awardBadge({ userId: badgeModal, badgeId: selectedBadge })).unwrap();
      toast.success('Badge awarded!');
      setBadgeModal(null);
      setSelectedBadge('');
    } catch (err) { toast.error(err || 'Failed'); }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full pb-12 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2 tracking-tight">Manage Users</h1>
          <p className="text-zinc-500">{users.length} registered users</p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="input-field !pl-10" />
        </div>

        {usersLoading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto card !p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-400 uppercase">User</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-400 uppercase hidden sm:table-cell">Email</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-400 uppercase">Role</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-400 uppercase hidden md:table-cell">Badges</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-zinc-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-semibold">{u.name?.charAt(0)}</div>
                        <span className="text-sm font-medium text-zinc-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-zinc-500 hidden sm:table-cell">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${u.role === 'admin' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500 border border-zinc-200'}`}>
                        {u.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-zinc-500 hidden md:table-cell">{u.badges?.length || 0}</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => handleRoleChange(u._id, u.role)} className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors" title="Toggle role">
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setBadgeModal(u._id); setSelectedBadge(''); }} className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors ml-1" title="Award badge">
                        <Trophy className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Award Badge Modal */}
        <Modal isOpen={!!badgeModal} onClose={() => setBadgeModal(null)} title="Award Badge">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Select Badge</label>
              <select value={selectedBadge} onChange={(e) => setSelectedBadge(e.target.value)} className="input-field">
                <option value="">Choose a badge...</option>
                {badges.map((b) => <option key={b._id} value={b._id}>{b.icon} {b.name} ({b.level})</option>)}
              </select>
            </div>
            <button onClick={handleAwardBadge} disabled={!selectedBadge} className="btn-primary w-full">Award Badge</button>
          </div>
        </Modal>
      </div>
  );
};

export default ManageUsers;
