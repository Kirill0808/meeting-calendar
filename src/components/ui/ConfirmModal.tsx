import type { ReactNode } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface ConfirmModalProps {
   isOpen: boolean;
   title: string;
   description?: string;
   confirmText?: string;
   cancelText?: string;
   variant?: 'default' | 'danger';
   onConfirm: () => void;
   onCancel: () => void;
   icon?: ReactNode;
}

export default function ConfirmModal({
   isOpen,
   title,
   description,
   confirmText = 'Confirm',
   cancelText = 'Cancel',
   variant = 'default',
   onConfirm,
   onCancel,
   icon,
}: ConfirmModalProps) {
   if (!isOpen) return null;

   const isDanger = variant === 'danger';

   return (
      <div
         className="
                  fixed inset-0 z-[60] flex items-center justify-center
                  bg-black/40 dark:bg-black/60
                  backdrop-blur-sm"
      >
         <div
            className="
                  w-96 relative p-6 rounded-2xl
                  bg-white dark:bg-gray-900
                  text-gray-900 dark:text-gray-100
                  border border-gray-200 dark:border-gray-700
                  shadow-xl dark:shadow-black/40
                  animate-in fade-in zoom-in-95
                  transition-colors"
         >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
               <div
                  className={clsx(
                     'p-2 rounded-full',
                     isDanger ? 'bg-red-100 dark:bg-red-900/40' : 'bg-blue-100 dark:bg-blue-900/40'
                  )}
               >
                  {icon ? (
                     icon
                  ) : isDanger ? (
                     <Trash2 size={18} className="text-red-500" />
                  ) : (
                     <AlertTriangle size={18} className="text-blue-500" />
                  )}
               </div>

               <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
            </div>

            {description && (
               <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{description}</p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
               <button
                  onClick={onCancel}
                  className="
                              px-4 py-2 rounded-lg border
                              border-gray-200 dark:border-gray-700
                              hover:bg-gray-100 dark:hover:bg-gray-800
                              transition"
               >
                  {cancelText}
               </button>

               <button
                  onClick={onConfirm}
                  className={clsx(
                     'px-4 py-2 rounded-lg text-white transition shadow-sm',
                     isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
                  )}
               >
                  {confirmText}
               </button>
            </div>
         </div>
      </div>
   );
}
