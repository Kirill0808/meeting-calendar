import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useCalendarStore } from '@/store/calendar-store';
import { formatTime, parseTime, addHoursToTime } from '@/utils/date';

import TimePicker from './TimePicker';
import ColorPicker from './ColorPicker';
import RepeatUntilPicker from './RepeatUntilPicker';

const COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#a855f7'];

interface EventModalProps {
   isOpen: boolean;
   onClose: () => void;
}

export default function EventModal({ isOpen, onClose }: EventModalProps) {
   const { editingEventId, selectedSlot, events, addEvent, updateEvent, deleteEvent } =
      useCalendarStore();

   const editingEvent = events.find((e) => e.id === editingEventId);

   const [title, setTitle] = useState('');
   const [color, setColor] = useState(COLORS[0]);
   const [startTime, setStartTime] = useState('09:00');
   const [endTime, setEndTime] = useState(() => addHoursToTime('09:00', 1));

   const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly'>('none');
   const [repeatUntil, setRepeatUntil] = useState<Date | undefined>();

   const [error, setError] = useState<string | null>(null);
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

   /* =========================
      Prefill logic
   ========================= */

   useEffect(() => {
      if (!isOpen) return;

      setError(null);

      if (editingEvent) {
         setTitle(editingEvent.title);
         setColor(editingEvent.color);
         setStartTime(formatTime(editingEvent.start));
         setEndTime(formatTime(editingEvent.end));
         setRepeat(editingEvent.repeat ?? 'none');

         if (editingEvent.repeatUntil) {
            setRepeatUntil(editingEvent.repeatUntil);
         } else {
            setRepeatUntil(undefined);
         }
      } else if (selectedSlot) {
         const formattedStart = formatTime(selectedSlot);

         setTitle('');
         setColor(COLORS[0]);
         setStartTime(formattedStart);
         setEndTime(addHoursToTime(formattedStart, 1));
         setRepeat('none');
         setRepeatUntil(undefined);
      }
   }, [isOpen, editingEvent, selectedSlot]);

   /* =========================
      Auto update endTime
   ========================= */

   useEffect(() => {
      if (!editingEvent) {
         setEndTime(addHoursToTime(startTime, 1));
      }
   }, [startTime, editingEvent]);

   /* =========================
      Submit handler
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

      const baseDate = editingEvent?.start ?? selectedSlot;

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

      const eventData = {
         title: trimmedTitle,
         start,
         end,
         color,
         repeat: repeat === 'none' ? undefined : repeat,
         repeatUntil:
            repeat === 'none'
               ? undefined
               : repeatUntil
                 ? new Date(repeatUntil.setHours(23, 59, 59, 999))
                 : undefined,
      };

      if (editingEvent) {
         updateEvent(editingEvent.id, eventData);
      } else {
         addEvent(eventData);
      }

      onClose();
   };

   const handleDeleteConfirm = () => {
      if (!editingEvent) return;

      deleteEvent(editingEvent.id);
      setShowDeleteConfirm(false);
      onClose();
   };

   return (
      <>
         <Modal isOpen={isOpen} onClose={onClose}>
            <button
               onClick={onClose}
               className="
                           absolute top-4 right-4
                           text-gray-400 dark:text-gray-500
                           hover:text-gray-600 dark:hover:text-gray-300
                           transition
                        "
            >
               <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
               {editingEvent ? 'Edit event' : 'Create event'}
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

            {/* Title */}
            <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Event title
               </label>

               <input
                  type="text"
                  value={title}
                  maxLength={100}
                  onChange={(e) => {
                     setTitle(e.target.value);
                     setError(null);
                  }}
                  className="
                              w-full px-3 py-2 rounded-lg
                              border border-gray-200 dark:border-gray-700
                              bg-white dark:bg-gray-800
                              text-gray-900 dark:text-gray-100
                              placeholder-gray-400 dark:placeholder-gray-500
                              focus:outline-none focus:ring-2 focus:ring-blue-500
                              transition-colors
                           "
               />

               <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">
                  {title.length}/100
               </p>

               {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>

            {/* Color */}
            <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
               </label>

               <ColorPicker
                  colors={COLORS}
                  selected={color}
                  onChange={(value) => {
                     setColor(value);
                     setError(null);
                  }}
               />
            </div>

            {/* Repeat */}
            <div className="mb-6">
               <label className="block text-sm font-medium text-gray-700 mb-2">Repeat</label>

               <select
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value as 'none' | 'daily' | 'weekly')}
                  className="
                              w-full px-3 py-2 rounded-lg
                              border border-gray-200 dark:border-gray-700
                              bg-white dark:bg-gray-800
                              text-gray-900 dark:text-gray-100
                              focus:outline-none
                              focus:ring-2 focus:ring-blue-500
                              transition-colors
                           "
               >
                  <option value="none">Does not repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
               </select>

               {repeat !== 'none' && (
                  <div className="mt-4">
                     <RepeatUntilPicker
                        value={repeatUntil}
                        onChange={(date) => {
                           setRepeatUntil(date);
                           setError(null);
                        }}
                     />

                     <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {repeat === 'daily' &&
                           'Event will repeat every day until this date (inclusive).'}
                        {repeat === 'weekly' &&
                           'Event will repeat every week until this date (inclusive).'}
                     </p>
                  </div>
               )}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
               {editingEvent && (
                  <button
                     onClick={() => setShowDeleteConfirm(true)}
                     className="text-red-500 text-sm hover:underline dark:text-red-400"
                  >
                     Delete
                  </button>
               )}

               <div className="ml-auto flex gap-3">
                  <button
                     onClick={onClose}
                     className="
                                 px-4 py-2 rounded-lg
                                 border border-gray-200 dark:border-gray-700
                                 text-gray-600 dark:text-gray-300
                                 hover:bg-gray-50 dark:hover:bg-gray-800
                                 transition
                              "
                  >
                     Cancel
                  </button>

                  <button
                     onClick={handleSubmit}
                     className="
                                 px-4 py-2 rounded-lg
                                 bg-blue-600 hover:bg-blue-700
                                 text-white
                                 transition shadow-sm
                              "
                  >
                     {editingEvent ? 'Save changes' : 'Create event'}
                  </button>
               </div>
            </div>
         </Modal>

         <ConfirmModal
            isOpen={showDeleteConfirm}
            title="Delete event?"
            description="This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            variant="danger"
            onCancel={() => setShowDeleteConfirm(false)}
            onConfirm={handleDeleteConfirm}
         />
      </>
   );
}
