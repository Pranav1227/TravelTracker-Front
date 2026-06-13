import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchBucketListById, 
  updateBucketList, 
  togglePlaceVisited, 
  duplicateBucketList,
  clearCurrentList
} from '../store/slices/bucketListSlice';
import { 
  ArrowLeft, Share2, Edit2, MapPin, Check, Image as ImageIcon, 
  GripVertical, Copy, Plus, Map as MapIcon, X, Download, Sparkles 
} from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import BucketListFormModal from '../components/bucketlist/BucketListFormModal';

const BucketListDetailPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentList, detailLoading, error } = useSelector((state) => state.bucketList);
  const { user } = useSelector((state) => state.auth);

  const [isEditOpen, setIsEditOpen] = useState(searchParams.get('edit') === 'true');
  const [isSaving, setIsSaving] = useState(false);
  const [localPlaces, setLocalPlaces] = useState([]);
  
  // Drag and drop state
  const dragItem = useRef();
  const dragOverItem = useRef();

  useEffect(() => {
    dispatch(fetchBucketListById(id));
    return () => {
      dispatch(clearCurrentList());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentList && currentList.places) {
      setLocalPlaces([...currentList.places].sort((a, b) => a.order - b.order));
    }
  }, [currentList]);

  useEffect(() => {
    if (searchParams.get('edit') === 'true' && currentList && currentList.user === user?._id) {
      setIsEditOpen(true);
      setSearchParams({});
    }
  }, [searchParams, currentList, user, setSearchParams]);

  if (detailLoading && !currentList) {
    return <div className="flex justify-center py-20"><LoadingSpinner text="Loading bucket list details..." /></div>;
  }

  if (error || !currentList) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <MapIcon className="w-16 h-16 text-zinc-300 mb-4" />
        <h2 className="text-2xl font-bold text-zinc-800 mb-2">Bucket List Not Found</h2>
        <p className="text-zinc-500 mb-6 max-w-md">The bucket list you're looking for doesn't exist or you don't have permission to view it.</p>
        <button onClick={() => navigate('/bucket-list')} className="btn-primary">Return to My Lists</button>
      </div>
    );
  }

  const isOwner = user && currentList.user === user._id;
  const totalPlaces = localPlaces.length;
  const visitedPlaces = localPlaces.filter(p => p.isVisited).length;
  const progressPercentage = totalPlaces > 0 ? Math.round((visitedPlaces / totalPlaces) * 100) : 0;

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Shareable link copied to clipboard!');
  };

  const handleDuplicate = async () => {
    try {
      const newList = await dispatch(duplicateBucketList(currentList._id)).unwrap();
      toast.success('Bucket list duplicated!');
      navigate(`/bucket-lists/${newList._id}`);
    } catch (err) {
      toast.error(err || 'Failed to duplicate');
    }
  };

  const handleEditSubmit = async (formData) => {
    setIsSaving(true);
    try {
      await dispatch(updateBucketList({ id: currentList._id, data: formData })).unwrap();
      toast.success('Bucket list updated');
      setIsEditOpen(false);
      dispatch(fetchBucketListById(currentList._id)); // Refresh full data
    } catch (err) {
      toast.error(err || 'Failed to update');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisited = async (placeId) => {
    if (!isOwner) return;
    try {
      await dispatch(togglePlaceVisited({ bucketListId: currentList._id, placeId })).unwrap();
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleRemovePlace = async (placeId) => {
    if (!isOwner) return;
    const confirm = window.confirm("Are you sure you want to remove this place from your bucket list?");
    if (!confirm) return;
    
    // We update by passing the filtered list of place IDs
    const newPlaceIds = localPlaces.filter(p => p.place._id !== placeId).map(p => p.place._id);
    try {
      await dispatch(updateBucketList({ id: currentList._id, data: { placeIds: newPlaceIds } })).unwrap();
      setLocalPlaces(localPlaces.filter(p => p.place._id !== placeId));
      toast.success('Place removed');
    } catch (err) {
      toast.error('Failed to remove place');
    }
  };

  // Drag and Drop Logic
  const dragStart = (e, position) => {
    dragItem.current = position;
  };

  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const drop = async (e) => {
    if (!isOwner || dragItem.current === undefined || dragOverItem.current === undefined) return;
    
    const copyListItems = [...localPlaces];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    
    // Update local immediately for snappy UI
    dragItem.current = null;
    dragOverItem.current = null;
    setLocalPlaces(copyListItems);

    // Save order by updating the entire placeIds array in new order
    try {
      await dispatch(updateBucketList({ 
        id: currentList._id, 
        data: { placeIds: copyListItems.map(p => p.place._id) } 
      })).unwrap();
    } catch (err) {
      toast.error('Failed to save new order');
      dispatch(fetchBucketListById(currentList._id)); // Revert on failure
    }
  };

  const handleExportCSV = () => {
    if (!currentList || !localPlaces.length) return;
    const headers = ['Place Name', 'Category', 'Country', 'State', 'City', 'Status', 'Notes'];
    const rows = localPlaces.map(item => {
      const p = item.place;
      return [
        `"${p.name || ''}"`,
        `"${p.category || ''}"`,
        `"${p.country || ''}"`,
        `"${p.state || ''}"`,
        `"${p.city || ''}"`,
        `"${item.isVisited ? 'Visited' : 'Planned'}"`,
        `"${item.notes || ''}"`
      ].join(',');
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentList.name.replace(/\s+/g, '_')}_BucketList.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV!');
  };

  const handleAIRecommend = () => {
    // Simple placeholder for AI recommendations routing or modal
    toast.success('Analyzing your bucket list...');
    setTimeout(() => {
      toast('Based on your list, we recommend adding: Venice, Kyoto, and Santorini!', {
        icon: '✨',
      });
    }, 1500);
  };

  return (
    <div className="w-full pb-12 animate-fade-in">
      {/* Top Nav */}
      <button 
        onClick={() => navigate('/bucket-list')}
        className="flex items-center gap-2 text-zinc-500 hover:text-primary-600 mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Lists
      </button>

      {/* Header Section */}
      <div className="card bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden mb-8">
        <div className="p-8 bg-gradient-to-br from-[#1A365D] to-[#112440] text-white flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
          
          <div className="flex-1 relative z-10">
            {currentList.isPublic && (
              <span className="inline-block bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium mb-3 backdrop-blur-sm">
                Public List
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{currentList.name}</h1>
            <p className="text-blue-100/80 font-medium">
              Created on {new Date(currentList.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 relative z-10">
            <button onClick={handleExportCSV} className="btn bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm shadow-sm flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={handleShare} className="btn bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm shadow-sm flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all">
              <Share2 className="w-4 h-4" /> Share
            </button>
            
            {isOwner ? (
              <button onClick={() => setIsEditOpen(true)} className="btn bg-white text-[#1A365D] hover:bg-zinc-100 border-0 shadow-sm flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all">
                <Edit2 className="w-4 h-4" /> Edit List
              </button>
            ) : (
              user && (
                <button onClick={handleDuplicate} className="btn bg-white text-[#1A365D] hover:bg-zinc-100 border-0 shadow-sm flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all">
                  <Copy className="w-4 h-4" /> Duplicate
                </button>
              )
            )}
          </div>
          
          {/* Decorative background element */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
            <MapIcon className="w-64 h-64" />
          </div>
        </div>

        {/* Analytics Bar */}
        <div className="p-6 bg-white border-t border-zinc-100 flex flex-col md:flex-row gap-6 md:items-center">
          <div className="flex-1">
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-zinc-600">Goal Progress</span>
              <span className="text-primary-600">{visitedPlaces} / {totalPlaces} Explored</span>
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${progressPercentage === 100 ? 'bg-green-500' : 'bg-primary-500'}`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex gap-8 md:px-8 border-l border-zinc-100 text-center">
            <div>
              <p className="text-3xl font-bold text-zinc-900">{progressPercentage}%</p>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Places List */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-zinc-900">Destinations ({localPlaces.length})</h2>
        <div className="flex gap-4 items-center">
          {isOwner && localPlaces.length > 0 && (
            <button 
              onClick={handleAIRecommend}
              className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <Sparkles className="w-4 h-4" /> AI Suggest
            </button>
          )}
          {isOwner && (
            <button 
              onClick={() => setIsEditOpen(true)}
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Places
            </button>
          )}
        </div>
      </div>

      {localPlaces.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-zinc-200 border-dashed">
          <p className="text-zinc-500">No places added to this list yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {localPlaces.map((item, index) => {
            const place = item.place;
            return (
              <div 
                key={place._id}
                draggable={isOwner}
                onDragStart={(e) => dragStart(e, index)}
                onDragEnter={(e) => dragEnter(e, index)}
                onDragEnd={drop}
                onDragOver={(e) => e.preventDefault()}
                className={`group card bg-white border border-zinc-200 rounded-xl p-4 flex items-center gap-4 transition-all hover:shadow-sm ${isOwner ? 'cursor-grab active:cursor-grabbing' : ''}`}
              >
                {/* Drag Handle */}
                {isOwner && (
                  <div className="text-zinc-300 group-hover:text-zinc-500 transition-colors cursor-grab active:cursor-grabbing px-1">
                    <GripVertical className="w-5 h-5" />
                  </div>
                )}
                
                {/* Image Placeholder */}
                <div className="w-20 h-20 bg-zinc-100 rounded-lg flex-shrink-0 flex items-center justify-center text-zinc-400 overflow-hidden relative">
                  {place.imageUrls && place.imageUrls[0] ? (
                     <img src={place.imageUrls[0]} alt={place.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6" />
                  )}
                  {item.isVisited && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="w-8 h-8 bg-green-500 rounded-full text-white flex items-center justify-center shadow-md">
                        <Check className="w-5 h-5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-lg font-bold truncate ${item.isVisited ? 'text-zinc-500 line-through' : 'text-zinc-900'}`}>
                      {place.name}
                    </h3>
                    <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded capitalize font-medium">
                      {place.category}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 flex items-center gap-1 mb-1 truncate">
                    <MapPin className="w-3.5 h-3.5" />
                    {[place.city, place.state, place.country].filter(Boolean).join(', ')}
                  </p>
                  {place.description && (
                    <p className="text-xs text-zinc-400 line-clamp-1">{place.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:gap-3 pl-2">
                  {isOwner && (
                    <button
                      onClick={() => handleToggleVisited(place._id)}
                      className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        item.isVisited
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-zinc-100 text-zinc-400 hover:bg-green-50 hover:text-green-500 border border-zinc-200'
                      }`}
                      title={item.isVisited ? "Mark as Planned" : "Mark as Visited"}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                  {isOwner && (
                    <button
                      onClick={() => handleRemovePlace(place._id)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from List"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {isOwner && (
        <BucketListFormModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleEditSubmit}
          initialData={currentList}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default BucketListDetailPage;
