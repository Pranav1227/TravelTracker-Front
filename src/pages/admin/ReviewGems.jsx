import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllGems, verifyGem } from '../../store/slices/hiddenGemSlice';
import { fetchBadges } from '../../store/slices/badgeSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiSparkles, HiCheckCircle, HiXCircle, HiClock, HiMapPin } from 'react-icons/hi2';

const ReviewGems = () => {
  const dispatch = useDispatch();
  const { allGems, loading, verifyLoading } = useSelector((s) => s.hiddenGems);
  const { badges } = useSelector((s) => s.badges);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [notes, setNotes] = useState({});
  const [selectedBadge, setSelectedBadge] = useState({});

  useEffect(() => { dispatch(fetchAllGems(statusFilter)); }, [dispatch, statusFilter]);
  useEffect(() => { dispatch(fetchBadges()); }, [dispatch]);

  const handleVerify = async (id, status) => {
    try {
      await dispatch(verifyGem({ id, status, adminNotes: notes[id] || '', badgeId: status === 'approved' ? selectedBadge[id] : undefined })).unwrap();
      toast.success(`Gem ${status}!`);
    } catch (err) { toast.error(err || 'Failed'); }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2 tracking-tight">Review Hidden Gems</h1>
          <p className="text-zinc-500">Approve or reject community-submitted hidden gems.</p>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-1.5 mb-6">
          {['pending', 'approved', 'rejected'].map((st) => (
            <button key={st} onClick={() => setStatusFilter(st)} className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-all duration-200 flex items-center gap-1 ${statusFilter === st ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200'}`}>
              {st === 'pending' && <HiClock className="w-3.5 h-3.5" />}
              {st === 'approved' && <HiCheckCircle className="w-3.5 h-3.5" />}
              {st === 'rejected' && <HiXCircle className="w-3.5 h-3.5" />}
              {st}
            </button>
          ))}
        </div>

        {loading ? <LoadingSpinner /> : allGems.length === 0 ? (
          <div className="card text-center py-12">
            <HiSparkles className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-zinc-500">No {statusFilter} gems</h3>
          </div>
        ) : (
          <div className="space-y-3 animate-stagger">
            {allGems.map((gem) => (
              <div key={gem._id} className="card">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-zinc-900">{gem.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-zinc-400 mt-1"><HiMapPin className="w-3.5 h-3.5" />{gem.location}</div>
                    <div className="text-xs text-zinc-400 mt-1">By: {gem.submittedBy?.name} ({gem.submittedBy?.email})</div>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 mb-4">{gem.description}</p>

                {gem.proofImageUrl && <img src={gem.proofImageUrl} alt={gem.name} className="w-full h-48 object-cover rounded-lg mb-4 border border-zinc-200" onError={(e) => e.target.style.display = 'none'} />}

                {statusFilter === 'pending' && (
                  <div className="space-y-3 border-t border-zinc-200 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Admin Notes</label>
                      <textarea value={notes[gem._id] || ''} onChange={(e) => setNotes({...notes, [gem._id]: e.target.value})} rows={2} placeholder="Optional notes..." className="input-field resize-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Award Badge (on approve)</label>
                      <select value={selectedBadge[gem._id] || ''} onChange={(e) => setSelectedBadge({...selectedBadge, [gem._id]: e.target.value})} className="input-field text-sm">
                        <option value="">No badge</option>
                        {badges.map((b) => <option key={b._id} value={b._id}>{b.icon} {b.name}</option>)}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleVerify(gem._id, 'approved')} disabled={verifyLoading === gem._id} className="btn-primary flex-1 flex items-center justify-center gap-2 !py-2.5 text-sm">
                        <HiCheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button onClick={() => handleVerify(gem._id, 'rejected')} disabled={verifyLoading === gem._id} className="btn-danger flex-1 flex items-center justify-center gap-2 !py-2.5 text-sm">
                        <HiXCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                )}

                {gem.adminNotes && statusFilter !== 'pending' && (
                  <div className="bg-zinc-50 rounded-lg p-3 text-sm mt-3 border border-zinc-100">
                    <span className="text-zinc-400 font-medium">Notes: </span>
                    <span className="text-zinc-600">{gem.adminNotes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewGems;
