import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useCalendarStore } from '@/store/calendar-store';
import { formatTime, parseTime, addHoursToTime } from '@/utils/date';

import TimePicker from './TimePicker';
import ColorPicker from './ColorPicker';

const COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#a855f7'];

interface EventModalProps {
   isOpen: boolean;
   onClose: () => void;
}

export default function EventModal({ isOpen, onClose }: EventModalProps) {
   const { editingEventId, selectedSlot, events, addEvent, updateEvent, deleteEvent } =
      useCalendarStore();

   const editingEvent = events.find((e) => e.id === editingEventId);
   const isEditMode = Boolean(editingEvent);

   const [title, setTitle] = useState('');
   const [color, setColor] = useState(COLORS[0]);
   const [startTime, setStartTime] = useState('09:00');
   const [endTime, setEndTime] = useState(() => addHoursToTime('09:00', 1));

   const [error, setError] = useState<string | null>(null);

   /* =========================
      Prefill logic
   ========================= */

   useEffect(() => {
      if (!isOpen) return;

      setError(null);

      if (isEditMode && editingEvent) {
         setTitle(editingEvent.title);
         setColor(editingEvent.color);
         setStartTime(formatTime(editingEvent.start));
         setEndTime(formatTime(editingEvent.end));
      } else if (selectedSlot) {
         setTitle('');
         setColor(COLORS[0]);

         const formattedStart = formatTime(selectedSlot);
         setStartTime(formattedStart);
         setEndTime(addHoursToTime(formattedStart, 1));
      }
   }, [isOpen, editingEvent, selectedSlot, isEditMode]);

   /* =========================
      Auto update endTime
   ========================= */

   useEffect(() => {
      if (!isEditMode) {
         setEndTime(addHoursToTime(startTime, 1));
      }
   }, [startTime, isEditMode]);

   /* =========================
      Handlers
   ========================= */

   const handleSubmit = () => {
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
         setError('Event title is required');
         return;
      }

      if (trimmedTitle.length > 100) {
         setError('Title must be less than 100 characters');
         return;
      }

      const baseDate = editingEvent?.start || selectedSlot;

      if (!baseDate) {
         setError('Invalid date selected');
         return;
      }

      const start = parseTime(baseDate, startTime);
      const end = parseTime(baseDate, endTime);

      if (end <= start) {
         setError('End time must be after start time');
         return;
      }

      setError(null);

      if (isEditMode && editingEvent) {
         updateEvent(editingEvent.id, {
            title: trimmedTitle,
            start,
            end,
            color,
         });
      } else {
         addEvent({
            title: trimmedTitle,
            start,
            end,
            color,
         });
      }

      onClose();
   };

   const handleDelete = () => {
      if (!editingEvent) return;

      if (confirm('Delete this event?')) {
         deleteEvent(editingEvent.id);
         onClose();
      }
   };

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
            <button
               onClick={onClose}
               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
               <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
               {isEditMode ? 'Edit event' : 'Create event'}
            </h2>

            <TimePicker
               startTime={startTime}
               endTime={endTime}
               onStartChange={(value) => {
                  setStartTime(value);
                  setError(null);
               }}
               onEndChange={(value) => {
                  setEndTime(value);
                  setError(null);
               }}
            />

            <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-1">Event title</label>
               <input
                  type="text"
                  value={title}
                  maxLength={100}
                  onChange={(e) => {
                     setTitle(e.target.value);
                     setError(null);
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
               />

               <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/100</p>

               {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>

            <div className="mb-6">
               <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
               <ColorPicker
                  colors={COLORS}
                  selected={color}
                  onChange={(value) => {
                     setColor(value);
                     setError(null);
                  }}
               />
            </div>

            <div className="flex justify-between items-center">
               {isEditMode && (
                  <button onClick={handleDelete} className="text-red-500 text-sm hover:underline">
                     Delete
                  </button>
               )}

               <div className="ml-auto flex gap-3">
                  <button
                     onClick={onClose}
                     className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
                  >
                     Cancel
                  </button>

                  <button
                     onClick={handleSubmit}
                     className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                     {isEditMode ? 'Save changes' : 'Create event'}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
