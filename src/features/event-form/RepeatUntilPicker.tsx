import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface RepeatUntilPickerProps {
   value?: Date;
   onChange: (date?: Date) => void;
}

export default function RepeatUntilPicker({ value, onChange }: RepeatUntilPickerProps) {
   const [open, setOpen] = useState(false);
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
         if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setOpen(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, []);

   return (
      <div ref={containerRef} className="relative mb-4">
         {/* LABEL */}
         <label className="text-sm text-[var(--text-secondary)]">Repeat until</label>

         {/* BUTTON */}
         <button
            type="button"
            onClick={() => setOpen(!open)}
            className="
               mt-1 w-full flex items-center justify-between
               px-3 py-2 rounded-lg
               border border-[var(--border)]
               bg-[var(--bg)]
               text-[var(--text)]
               hover:bg-[var(--bg-secondary)]
               transition
            "
         >
            {value ? format(value, 'dd MMM yyyy') : 'Select date'}
            <Calendar size={16} />
         </button>

         {/* CALENDAR */}
         {open && (
            <div
               className="
                  absolute bottom-full mb-2
                  z-50 p-3 rounded-xl
                  shadow-xl
                  border border-[var(--border)]
                  bg-[var(--bg)]
                  origin-bottom animate-in fade-in zoom-in-95
               "
            >
               <DayPicker
                  mode="single"
                  selected={value}
                  onSelect={(date) => {
                     onChange(date);
                     setOpen(false);
                  }}
               />
            </div>
         )}
      </div>
   );
}
