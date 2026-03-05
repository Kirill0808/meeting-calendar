import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

   return (
      <AnimatePresence>
         {isOpen && (
            <motion.div
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.2 }}
               onClick={onClose}
            >
               <motion.div
                  className="
                           relative w-full max-w-md p-6
                           rounded-2xl
                           bg-white dark:bg-gray-900
                           text-gray-900 dark:text-gray-100
                           border border-gray-200 dark:border-gray-700
                           shadow-2xl dark:shadow-black/40
                           transition-colors"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{
                     type: 'spring',
                     stiffness: 260,
                     damping: 20,
                  }}
                  onClick={(e) => e.stopPropagation()}
               >
                  {children}
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
   );
}
