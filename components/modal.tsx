'use client'; // Required for App Router if using interactivity

import { useEffect } from 'react';
import { Button } from './ui/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  onDelete: () => void;
  title: string;
  children: React.ReactNode;
  showPrimaryButton?: boolean;
  showSecondaryButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  onCancel,
  onDelete,
  children,
  title,
  showPrimaryButton = true,
  showSecondaryButton = true,
}: ModalProps) {
  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Modal content */}
        <div
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-md"
          onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
        >
          <div className="p-6 text-black">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            {children}

            <div className="mt-6 flex justify-end">
              {showSecondaryButton && (
                <Button
                  onClick={onCancel}
                  variant="secondary"
                  className="px-4 py-2 mr-2"
                >
                  Cancel
                </Button>
              )}
              {showPrimaryButton && (
                <Button onClick={onDelete} className="px-4 py-2 ">
                  Confirm
                </Button>
              )}
            </div>
            {/* Close button */}
          </div>
          <button
            onClick={onClose}
            className="absolute top-0 right-0 p-4 text-gray-500 hover:text-gray-700 bg-white"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
