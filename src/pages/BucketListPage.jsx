import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Plus, Search, MoreVertical, Edit2, Trash2, MapPin, Loader2, Star, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchBucketLists, createBucketList, updateBucketList, deleteBucketList, toggleFavorite, clearError } from '../store/slices/bucketListSlice';
import BucketListFormModal from '../components/bucketlist/BucketListFormModal';
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const BucketListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { lists, loading, error } = useSelector((state) => state.bucketList);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // recent, alpha, most_places

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [deletingList, setDeletingList] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Dropdown states
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    dispatch(fetchBucketLists());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleOpenCreate = () => {
    setEditingList(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (e, list) => {
    e.preventDefault();
    e.stopPropagation();
    // We need to fetch the full list by ID to get the populated places if it's not already in the list
    // Actually, we should fetch it when they click edit to ensure we have the places
    navigate(`/bucket-lists/${list._id}?edit=true`);
  };

  const handleOpenDelete = (e, list) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingList(list);
    setIsDeleteOpen(true);
    setOpenDropdownId(null);
  };

  const handleToggleFavorite = (e, listId) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(listId));
  };

  const handleSaveForm = async (formData) => {
    setIsSaving(true);
    try {
      if (editingList) {
        await dispatch(updateBucketList({ id: editingList._id, data: formData })).unwrap();
        toast.success('Bucket list updated');
      } else {
        await dispatch(createBucketList(formData)).unwrap();
        toast.success('Bucket list created');
      }
      setIsFormOpen(false);
    } catch (err) {
      toast.error(err || 'Failed to save bucket list');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingList) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteBucketList(deletingList._id)).unwrap();
      toast.success('Bucket list deleted');
      setIsDeleteOpen(false);
    } catch (err) {
      toast.error(err || 'Failed to delete bucket list');
    } finally {
      setIsDeleting(false);
    }
  };

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Filter and Sort
  let filteredLists = lists.filter(list => list.name.toLowerCase().includes(searchQuery.toLowerCase()));
  
  if (sortBy === 'alpha') {
    filteredLists.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'most_places') {
    filteredLists.sort((a, b) => b.totalPlaces - a.totalPlaces);
  } else {
    // recent
    filteredLists.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Also prioritize favorites
  filteredLists.sort((a, b) => (b.isFavorite === a.isFavorite) ? 0 : b.isFavorite ? 1 : -1);

  return (
    <div className="w-full pb-12 animate-fade-in">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A365D] flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-amber-500" />
            My Bucket Lists
          </h1>
          <p className="text-zinc-500 mt-1">Manage and track your travel goals.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" /> Create List
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card bg-white p-4 mb-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center z-20 relative">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search bucket lists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>
        <div className="w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-zinc-700"
          >
            <option value="recent">Recently Created</option>
            <option value="alpha">Alphabetical (A-Z)</option>
            <option value="most_places">Most Places Added</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner text="Loading bucket lists..." />
        </div>
      ) : lists.length === 0 ? (
        <div className="card bg-white border border-zinc-200 p-12 text-center rounded-xl shadow-sm mt-8">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-3">No Bucket Lists Yet</h2>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto text-lg">
            Create your first bucket list to start organizing your dream destinations and tracking your travel goals.
          </p>
          <button 
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-xl font-bold text-lg shadow-md transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-6 h-6" /> Create Bucket List
          </button>
        </div>
      ) : (
        <>
          {filteredLists.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-500">No bucket lists found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLists.map((list) => {
                const progressPercentage = list.totalPlaces > 0 ? Math.round((list.visitedPlaces / list.totalPlaces) * 100) : 0;
                
                return (
                  <Link 
                    key={list._id} 
                    to={`/bucket-lists/${list._id}`}
                    className="card group bg-white border border-zinc-200 rounded-xl overflow-hidden hover:border-primary-300 hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    {/* Header */}
                    <div className="p-5 border-b border-zinc-100 flex justify-between items-start bg-gradient-to-br from-white to-zinc-50">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="font-bold text-lg text-[#1A365D] group-hover:text-primary-700 transition-colors line-clamp-1">
                            {list.name}
                          </h3>
                          {list.isFavorite && <Star className="w-4 h-4 fill-amber-400 text-amber-400 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-zinc-500 font-medium">
                          Created {new Date(list.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      
                      {/* Context Menu */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpenDropdownId(openDropdownId === list._id ? null : list._id);
                          }}
                          className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        {openDropdownId === list._id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-zinc-200 rounded-lg shadow-xl py-1 z-30">
                            <button
                              onClick={(e) => handleToggleFavorite(e, list._id)}
                              className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                            >
                              <Star className={`w-4 h-4 ${list.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} /> 
                              {list.isFavorite ? 'Remove Favorite' : 'Mark as Favorite'}
                            </button>
                            <button
                              onClick={(e) => handleOpenDelete(e, list)}
                              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" /> Delete List
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats & Progress */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-zinc-600">
                          <MapPin className="w-4 h-4 text-primary-500" />
                          <span className="font-semibold">{list.totalPlaces} <span className="font-normal text-sm">Places</span></span>
                        </div>
                        {list.isPublic && (
                          <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md font-medium border border-blue-100 flex items-center gap-1">
                            <Share2 className="w-3 h-3" /> Public
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1.5">
                          <span className="text-zinc-500 uppercase tracking-wider">Progress</span>
                          <span className={progressPercentage === 100 ? 'text-green-600' : 'text-primary-600'}>
                            {list.visitedPlaces} / {list.totalPlaces} Visited ({progressPercentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${progressPercentage === 100 ? 'bg-green-500' : 'bg-primary-500'}`}
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <BucketListFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleSaveForm}
        isSaving={isSaving}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Bucket List?"
        message={`Are you sure you want to delete "${deletingList?.name}"? All associated places will be removed from this list. This action cannot be undone.`}
      />
    </div>
  );
};

export default BucketListPage;
