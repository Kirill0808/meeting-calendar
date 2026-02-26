import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
   children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
   useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
         if (e.key === 'Escape') {
            onClose();
         }
      };

      if (isOpen) {
         document.addEventListener('keydown', handleEsc);
      }

      return () => {
         document.removeEventListener('keydown', handleEsc);
      };
   }, [isOpen, onClose]);

   if (!isOpen) return null;

   return (
      <div
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
         onClick={onClose}
      >
         <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
         >
            {children}
         </div>
      </div>
   );
}
