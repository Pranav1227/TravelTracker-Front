import { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import Modal from '../ui/Modal';
import { useDispatch } from 'react-redux';
import { logMemory } from '../../store/slices/visitSlice';
import toast from 'react-hot-toast';

const LogMemoryModal = ({ isOpen, onClose, place }) => {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!place) return;
    
    setIsSubmitting(true);
    const formData = new FormData();
    if (photo) {
      formData.append('image', photo);
    }
    if (note) {
      formData.append('memoryNote', note);
    }

    try {
      await dispatch(logMemory({ placeId: place._id, formData })).unwrap();
      toast.success('Memory successfully logged!');
      setPhoto(null);
      setPhotoPreview(null);
      setNote('');
      onClose();
    } catch (error) {
      toast.error(error || 'Failed to log memory');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!place) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Log Memory in ${place.name}`} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-2">
        {/* Photo Upload Section */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Upload a Photo <span className="text-zinc-400 font-normal">(Optional)</span>
          </label>
          
          {!photoPreview ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-48 border-2 border-dashed border-zinc-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 hover:border-primary-400 transition-colors"
            >
              <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-500 mb-3">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-zinc-700">Click to upload a photo</p>
              <p className="text-xs text-zinc-500 mt-1">JPG, PNG or WEBP (Max 5MB)</p>
            </div>
          ) : (
            <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-sm group">
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  <X className="w-4 h-4" /> Remove Photo
                </button>
              </div>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            accept="image/jpeg, image/png, image/webp"
            className="hidden"
          />
        </div>

        {/* Note Section */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Add a Journal Note <span className="text-zinc-400 font-normal">(Optional)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What was the highlight of your visit?"
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all resize-none h-28"
            maxLength={1000}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-zinc-100 mt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="btn-secondary px-6"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || (!photo && !note)}
            className="btn-primary px-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Memory'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LogMemoryModal;
