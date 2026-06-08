import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitHiddenGem, fetchMyGems } from '../store/slices/hiddenGemSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { Sparkles, MapPin, Camera, Send, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

const statusConfig = {
  pending: { class: 'status-pending', icon: <Clock className="w-3.5 h-3.5" />, label: 'Pending' },
  approved: { class: 'status-approved', icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'Approved' },
  rejected: { class: 'status-rejected', icon: <XCircle className="w-3.5 h-3.5" />, label: 'Rejected' },
};

const HiddenGemsPage = () => {
  const dispatch = useDispatch();
  const { myGems, loading, submitLoading } = useSelector((s) => s.hiddenGems);
  const [form, setForm] = useState({ name: '', location: '', description: '', proofImageUrl: '' });

  useEffect(() => { dispatch(fetchMyGems()); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(submitHiddenGem(form)).unwrap();
      toast.success('Hidden gem submitted!');
      setForm({ name: '', location: '', description: '', proofImageUrl: '' });
    } catch (err) { toast.error(err || 'Failed'); }
  };

  return (
    <div className="w-full pb-12 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2 tracking-tight">Hidden Gems</h1>
          <p className="text-zinc-500">Share unique places and get verified for badges!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <div className="card sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-base font-semibold text-zinc-900">Submit a Hidden Gem</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Place Name *</label>
                  <input type="text" name="name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required placeholder="Secret Waterfall Trail" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5"><MapPin className="inline w-4 h-4 mr-1" />Location *</label>
                  <input type="text" name="location" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} required placeholder="Bali, Indonesia" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5"><MessageSquare className="inline w-4 h-4 mr-1" />Description *</label>
                  <textarea name="description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} required maxLength={1000} rows={4} placeholder="Tell us about this place..." className="input-field resize-none" />
                  <p className="text-xs text-zinc-400 mt-1 text-right">{form.description.length}/1000</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5"><Camera className="inline w-4 h-4 mr-1" />Proof Image URL</label>
                  <input type="url" name="proofImageUrl" value={form.proofImageUrl} onChange={(e) => setForm({...form, proofImageUrl: e.target.value})} placeholder="https://example.com/photo.jpg" className="input-field" />
                </div>
                <button type="submit" disabled={submitLoading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {submitLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                  {submitLoading ? 'Submitting...' : 'Submit Hidden Gem'}
                </button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-3">
            <h2 className="text-base font-semibold text-zinc-900 mb-4">My Submissions ({myGems.length})</h2>
            {loading ? <LoadingSpinner text="Loading..." /> : myGems.length === 0 ? (
              <div className="card text-center py-12">
                <Sparkles className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-base font-semibold text-zinc-500">No submissions yet</h3>
              </div>
            ) : (
              <div className="space-y-3 animate-stagger">
                {myGems.map((gem) => {
                  const st = statusConfig[gem.status];
                  return (
                    <div key={gem._id} className="card">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-zinc-900 truncate">{gem.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-zinc-400 mt-1"><MapPin className="w-3.5 h-3.5" />{gem.location}</div>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${st.class}`}>{st.icon}{st.label}</span>
                      </div>
                      <p className="text-sm text-zinc-500 mb-3">{gem.description}</p>
                      {gem.adminNotes && <div className="bg-zinc-50 rounded-lg p-3 text-sm border border-zinc-100"><span className="text-zinc-400 font-medium">Admin: </span><span className="text-zinc-600">{gem.adminNotes}</span></div>}
                      <div className="flex items-center gap-4 mt-3 text-xs text-zinc-400">
                        <span>Submitted {new Date(gem.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default HiddenGemsPage;
