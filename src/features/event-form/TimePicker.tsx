import { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerProps {
   startTime: string;
   endTime: string;
   onStartChange: (time: string) => void;
   onEndChange: (time: string) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = ['00', '15', '30', '45'];

function TimeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
   const [open, setOpen] = useState(false);

   const containerRef = useRef<HTMLDivElement>(null);
   const hoursRef = useRef<HTMLDivElement>(null);

   const [h, m] = value.split(':');

   const setHour = (hour: string) => {
      onChange(`${hour}:${m}`);
   };

   const setMinute = (minute: string) => {
      onChange(`${h}:${minute}`);
      setOpen(false);
   };

   // Close on outside click
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

   // Scroll to selected hour
   useEffect(() => {
      if (open && hoursRef.current) {
         const index = hours.findIndex((hour) => hour === h);
         const el = hoursRef.current.children[index] as HTMLElement;

         if (el) {
            el.scrollIntoView({
               block: 'center',
            });
         }
      }
   }, [open]);

   return (
      <div ref={containerRef} className="relative">
         <button
            onClick={() => setOpen(!open)}
            className="
               flex items-center gap-2
               px-3 py-2
               rounded-lg
               border border-gray-200 dark:border-gray-700
               bg-white dark:bg-gray-800
               text-gray-800 dark:text-gray-100
               hover:bg-gray-50 dark:hover:bg-gray-700
               transition
            "
         >
            <Clock size={16} />
            {value}
         </button>

         {open && (
            <div
               className="
                  absolute z-50 mt-2
                  flex gap-4
                  p-4
                  rounded-xl
                  shadow-lg
                  border border-gray-200 dark:border-gray-700
                  bg-white dark:bg-gray-800
               "
            >
               {/* Hours */}
               <div ref={hoursRef} className="flex flex-col max-h-48 overflow-y-auto pr-2">
                  <span className="text-xs text-gray-400 mb-2">Hours</span>

                  {hours.map((hour) => (
                     <button
                        key={hour}
                        onClick={() => setHour(hour)}
                        className={`
                           px-3 py-1 rounded-md text-sm transition
                           ${
                              hour === h
                                 ? 'bg-blue-500 text-white'
                                 : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                           }
                        `}
                     >
                        {hour}
                     </button>
                  ))}
               </div>

               {/* Minutes */}
               <div className="flex flex-col">
                  <span className="text-xs text-gray-400 mb-2">Min</span>

                  {minutes.map((minute) => (
                     <button
                        key={minute}
                        onClick={() => setMinute(minute)}
                        className={`
                           px-3 py-1 rounded-md text-sm transition
                           ${
                              minute === m
                                 ? 'bg-blue-500 text-white'
                                 : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                           }
                        `}
                     >
                        {minute}
                     </button>
                  ))}
               </div>
            </div>
         )}
      </div>
   );
}

export default function TimePicker({
   startTime,
   endTime,
   onStartChange,
   onEndChange,
}: TimePickerProps) {
   return (
      <div className="flex gap-3 mb-4">
         <TimeSelect value={startTime} onChange={onStartChange} />
         <TimeSelect value={endTime} onChange={onEndChange} />
      </div>
   );
}
