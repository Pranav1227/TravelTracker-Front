import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Modal Content */}
      <div
        className={`relative w-full ${maxWidth} bg-white border border-zinc-200 rounded-xl p-6 animate-scale-in max-h-[90vh] overflow-y-auto shadow-xl`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <HiXMark className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Body */}
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
