import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlaces, createPlace, updatePlace, deletePlace } from '../../store/slices/placeSlice';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';

const emptyForm = { name: '', category: 'country', country: '', state: '', continent: '', description: '', imageUrl: '', latitude: 0, longitude: 0 };

const ManagePlaces = () => {
  const dispatch = useDispatch();
  const { places, loading, total } = useSelector((s) => s.places);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const params = { limit: 100 };
    if (filter) params.category = filter;
    dispatch(fetchPlaces(params));
  }, [dispatch, filter]);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (p) => {
    setEditId(p._id);
    setForm({ name: p.name, category: p.category, country: p.country || '', state: p.state || '', continent: p.continent || '', description: p.description || '', imageUrl: p.imageUrl || '', latitude: p.latitude || 0, longitude: p.longitude || 0 });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await dispatch(updatePlace({ id: editId, ...form })).unwrap();
        toast.success('Place updated!');
      } else {
        await dispatch(createPlace(form)).unwrap();
        toast.success('Place created!');
      }
      setModalOpen(false);
    } catch (err) { toast.error(err || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this place?')) return;
    try {
      await dispatch(deletePlace(id)).unwrap();
      toast.success('Place deleted');
    } catch (err) { toast.error(err || 'Failed'); }
  };

  return (
    <div className="w-full pb-12 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2 tracking-tight">Manage Places</h1>
            <p className="text-zinc-500">{total} places total</p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Place
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {['', 'country', 'state', 'city', 'wonder', 'fort'].map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${filter === cat ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200'}`}>
              {cat || 'All'}
            </button>
          ))}
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto card !p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-400 uppercase">Name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-400 uppercase">Category</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-400 uppercase hidden sm:table-cell">Country</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-zinc-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {places.map((p) => (
                  <tr key={p._id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-zinc-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 text-xs rounded-md bg-zinc-100 text-zinc-600 capitalize border border-zinc-200">{p.category}</span></td>
                    <td className="py-3 px-4 text-sm text-zinc-500 hidden sm:table-cell">{p.country || '—'}</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create/Edit Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Place' : 'Add Place'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Category *</label>
                <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="input-field">
                  {['country','state','city','wonder','fort'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Country</label>
                <input type="text" value={form.country} onChange={(e) => setForm({...form, country: e.target.value})} className="input-field" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">State</label>
                <input type="text" value={form.state} onChange={(e) => setForm({...form, state: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Continent</label>
                <input type="text" value={form.continent} onChange={(e) => setForm({...form, continent: e.target.value})} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} className="input-field resize-none" />
            </div>
            <button type="submit" className="btn-primary w-full">{editId ? 'Update Place' : 'Create Place'}</button>
          </form>
        </Modal>
      </div>
  );
};

export default ManagePlaces;
