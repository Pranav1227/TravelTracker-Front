import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, MapPin } from 'lucide-react';
import Modal from '../ui/Modal';
import API from '../../utils/api';

const BucketListFormModal = ({ isOpen, onClose, onSubmit, initialData = null, isSaving = false }) => {
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setIsPublic(initialData.isPublic || false);
        // Map initial places which might be nested objects { place: { _id, name... } } or just place objects
        const initialPlaces = initialData.places 
          ? initialData.places.map(p => p.place ? p.place : p) 
          : [];
        setSelectedPlaces(initialPlaces);
      } else {
        setName('');
        setIsPublic(false);
        setSelectedPlaces([]);
      }
      setSearchTerm('');
      setSearchResults([]);
    }
  }, [isOpen, initialData]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Async search effect
  useEffect(() => {
    const fetchPlaces = async () => {
      setIsSearching(true);
      try {
        const query = searchTerm.trim().length > 0 ? `search=${encodeURIComponent(searchTerm)}&` : '';
        const { data } = await API.get(`/places?${query}limit=20`);
        setSearchResults(data.places || []);
        // Always show dropdown if we have results and the input is focused, but since we can't cleanly check focus here, we just set it true
        if (data.places && data.places.length > 0) {
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Failed to fetch places", error);
      } finally {
        setIsSearching(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchPlaces();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelectPlace = (place) => {
    // Prevent duplicates
    if (!selectedPlaces.find(p => p._id === place._id)) {
      setSelectedPlaces([...selectedPlaces, place]);
    }
    // Don't close dropdown or clear search term immediately so they can add multiple
  };

  const handleRemovePlace = (placeId) => {
    setSelectedPlaces(selectedPlaces.filter(p => p._id !== placeId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (selectedPlaces.length === 0) return;

    onSubmit({
      name: name.trim(),
      isPublic,
      placeIds: selectedPlaces.map(p => p._id),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Bucket List' : 'Create Bucket List'} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-1">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
            Bucket List Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Summer 2026 Europe, Honeymoon"
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            maxLength={100}
            required
          />
        </div>

        {/* Places Multi-Select Field */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
            Places <span className="text-red-500">*</span>
          </label>
          
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center border border-zinc-300 rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all">
              <Search className="w-5 h-5 text-zinc-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search places to add..."
                className="w-full outline-none text-sm bg-transparent"
              />
              {isSearching && <Loader2 className="w-4 h-4 text-zinc-400 animate-spin ml-2" />}
            </div>

            {/* Dropdown Results */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50 py-1">
                {searchResults.map((place) => {
                  const isSelected = selectedPlaces.some(p => p._id === place._id);
                  return (
                    <button
                      type="button"
                      key={place._id}
                      onClick={() => handleSelectPlace(place)}
                      disabled={isSelected}
                      className={`w-full text-left px-4 py-3 flex flex-col border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors ${isSelected ? 'opacity-50 cursor-not-allowed bg-zinc-50' : ''}`}
                    >
                      <span className="font-semibold text-zinc-900 text-sm flex items-center justify-between">
                        {place.name}
                        {isSelected && <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded">Added</span>}
                      </span>
                      <span className="text-xs text-zinc-500 flex items-center mt-0.5">
                        <MapPin className="w-3 h-3 mr-1" />
                        {[place.state, place.country].filter(Boolean).join(', ')}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Places Chips */}
          {selectedPlaces.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
              {selectedPlaces.map(place => (
                <div key={place._id} className="flex items-center gap-1 bg-white border border-zinc-200 shadow-sm px-2.5 py-1.5 rounded-md text-sm">
                  <span className="font-medium text-zinc-800">{place.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePlace(place._id)}
                    className="text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 ml-1 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {selectedPlaces.length === 0 && (
            <p className="text-xs text-red-500 mt-2">At least one place is required.</p>
          )}
        </div>

        {/* Public Toggle */}
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4 text-primary-600 bg-zinc-100 border-zinc-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="isPublic" className="ml-2 text-sm font-medium text-zinc-700">
            Make this bucket list public (shareable)
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="btn-secondary px-5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || !name.trim() || selectedPlaces.length === 0}
            className="btn-primary px-6"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Bucket List'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BucketListFormModal;
