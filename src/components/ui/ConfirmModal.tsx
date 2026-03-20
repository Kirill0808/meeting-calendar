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
            bg-black/40 backdrop-blur-sm
         "
      >
         <div
            className="
               w-96 relative p-6 rounded-2xl
               bg-[var(--bg)]
               text-[var(--text)]
               border border-[var(--border)]
               shadow-xl
               animate-in fade-in zoom-in-95
            "
         >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
               <div
                  className={clsx(
                     'p-2 rounded-full',
                     isDanger ? 'bg-[rgba(239,68,68,0.15)]' : 'bg-[rgba(59,130,246,0.15)]'
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

               <h3 className="text-lg font-semibold">{title}</h3>
            </div>

            {description && (
               <p className="text-sm text-[var(--text-secondary)] mb-6">{description}</p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
               <button
                  onClick={onCancel}
                  className="
                     px-4 py-2 rounded-lg border
                     border-[var(--border)]
                     hover:bg-[var(--bg-secondary)]
                     transition
                  "
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
