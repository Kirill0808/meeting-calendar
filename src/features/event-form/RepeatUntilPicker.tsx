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
         <label className="text-sm text-gray-600 dark:text-gray-300">Repeat until</label>

         <button
            type="button"
            onClick={() => setOpen(!open)}
            className="
               mt-1
               w-full
               flex items-center justify-between
               px-3 py-2
               rounded-lg
               border border-gray-200 dark:border-gray-700
               bg-white dark:bg-gray-800
               text-gray-900 dark:text-gray-100
               hover:bg-gray-50 dark:hover:bg-gray-700
               transition
            "
         >
            {value ? format(value, 'dd MMM yyyy') : 'Select date'}
            <Calendar size={16} />
         </button>

         {open && (
            <div
               className="
                  absolute bottom-full mb-2
                  z-50
                  p-3
                  rounded-xl
                  shadow-xl
                  border border-gray-200 dark:border-gray-700
                  bg-white dark:bg-gray-800
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
