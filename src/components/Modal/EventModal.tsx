import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useCalendarStore } from '@/store/calendar-store';

import TimePicker from './TimePicker';
import ColorPicker from './ColorPicker';

const COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#a855f7'];

export default function EventModal() {
   const { closeModal, editingEventId, selectedSlot, events, addEvent, updateEvent, deleteEvent } =
      useCalendarStore();

   const editingEvent = events.find((e) => e.id === editingEventId);
   const isEditMode = Boolean(editingEvent);

   const [title, setTitle] = useState('');
   const [color, setColor] = useState(COLORS[0]);
   const [startTime, setStartTime] = useState('09:00');
   const [endTime, setEndTime] = useState('10:00');

   // helpers
   const formatTime = (date: Date) => new Date(date).toTimeString().slice(0, 5);

   const parseTime = (baseDate: Date, time: string) => {
      const [h, m] = time.split(':').map(Number);
      const d = new Date(baseDate);
      d.setHours(h, m, 0, 0);
      return d;
   };

   // 🔹 Pre-fill logic
   useEffect(() => {
      if (isEditMode && editingEvent) {
         setTitle(editingEvent.title);
         setColor(editingEvent.color);
         setStartTime(formatTime(editingEvent.start));
         setEndTime(formatTime(editingEvent.end));
      } else if (selectedSlot) {
         setTitle('');
         setColor(COLORS[0]);
         setStartTime(formatTime(selectedSlot));
         setEndTime('10:00');
      }
   }, [editingEvent, selectedSlot]);

   const handleSubmit = () => {
      if (!title.trim()) return;

      const baseDate = editingEvent?.start || selectedSlot;
      if (!baseDate) return;

      const start = parseTime(baseDate, startTime);
      const end = parseTime(baseDate, endTime);

      if (end <= start) return;

      if (isEditMode && editingEvent) {
         updateEvent(editingEvent.id, {
            title,
            start,
            end,
            color,
         });
      } else {
         addEvent({
            title,
            start,
            end,
            color,
         });
      }

      closeModal();
   };

   const handleDelete = () => {
      if (!editingEvent) return;

      if (confirm('Delete this event?')) {
         deleteEvent(editingEvent.id);
         closeModal();
      }
   };

   return (
      <div
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
         onClick={closeModal}
      >
         <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
         >
            {/* Close */}
            <button
               onClick={closeModal}
               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
               <X size={20} />
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
               {isEditMode ? 'Edit event' : 'Create event'}
            </h2>

            {/* Time */}
            <TimePicker
               startTime={startTime}
               endTime={endTime}
               onStartChange={setStartTime}
               onEndChange={setEndTime}
            />

            {/* Event title */}
            <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-1">Event title</label>
               <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
               />
            </div>

            {/* Color */}
            <div className="mb-6">
               <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>

               <ColorPicker colors={COLORS} selected={color} onChange={setColor} />
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center">
               {isEditMode && (
                  <button onClick={handleDelete} className="text-red-500 text-sm hover:underline">
                     Delete
                  </button>
               )}

               <div className="ml-auto flex gap-3">
                  <button
                     onClick={closeModal}
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
