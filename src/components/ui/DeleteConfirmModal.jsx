import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isDeleting }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center p-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <p className="text-zinc-600 mb-8">{message}</p>
        
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 btn-primary bg-red-600 hover:bg-red-700 border-red-600 text-white"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
