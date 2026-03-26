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

   /* ========================= Prefill ========================= */

   useEffect(() => {
      if (!isOpen) return;

      setError(null);

      if (editingEvent) {
         setTitle(editingEvent.title);
         setColor(editingEvent.color);
         setStartTime(formatTime(editingEvent.start));
         setEndTime(formatTime(editingEvent.end));
         setRepeat(editingEvent.repeat ?? 'none');
         setRepeatUntil(editingEvent.repeatUntil);
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

   /* ========================= Auto end time ========================= */

   useEffect(() => {
      if (!editingEvent) {
         setEndTime(addHoursToTime(startTime, 1));
      }
   }, [startTime, editingEvent]);

   /* ========================= Submit ========================= */

   const handleSubmit = () => {
      const trimmedTitle = title.trim();

      if (!trimmedTitle) return setError('Event title is required');
      if (trimmedTitle.length > 100) return setError('Title must be less than 100 characters');

      const baseDate = editingEvent?.start ?? selectedSlot;
      if (!baseDate) return setError('Invalid date selected');

      const start = parseTime(baseDate, startTime);
      const end = parseTime(baseDate, endTime);

      if (end <= start) return setError('End time must be after start time');

      if (start < new Date() && !editingEvent) {
         return setError('Cannot create events in the past');
      }

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

      editingEvent ? updateEvent(editingEvent.id, eventData) : addEvent(eventData);

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
            {/* CLOSE */}
            <button
               onClick={onClose}
               className="
                  absolute top-4 right-4
                  text-[var(--text-secondary)]
                  hover:text-[var(--text)]
                  transition
               "
            >
               <X size={20} />
            </button>

            {/* TITLE */}
            <h2 className="text-xl font-semibold text-[var(--text)] mb-4">
               {editingEvent ? 'Edit event' : 'Create event'}
            </h2>

            <TimePicker
               startTime={startTime}
               endTime={endTime}
               onStartChange={(v) => {
                  setStartTime(v);
                  setError(null);
               }}
               onEndChange={(v) => {
                  setEndTime(v);
                  setError(null);
               }}
            />

            {/* TITLE INPUT */}
            <div className="mb-4">
               <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
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
                     border border-[var(--border)]
                     bg-[var(--bg)]
                     text-[var(--text)]
                     placeholder:text-[var(--text-secondary)]
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     transition-colors
                  "
               />

               <p className="text-xs text-[var(--text-secondary)] mt-1 text-right">
                  {title.length}/100
               </p>

               {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>

            {/* COLOR */}
            <div className="mb-4">
               <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Color
               </label>

               <ColorPicker colors={COLORS} selected={color} onChange={setColor} />
            </div>

            {/* REPEAT */}
            <div className="mb-6">
               <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Repeat
               </label>

               <select
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value as any)}
                  className="
                     w-full px-3 py-2 rounded-lg
                     border border-[var(--border)]
                     bg-[var(--bg)]
                     text-[var(--text)]
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     transition-colors
                  "
               >
                  <option value="none">Does not repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
               </select>

               {repeat !== 'none' && (
                  <div className="mt-4">
                     <RepeatUntilPicker value={repeatUntil} onChange={setRepeatUntil} />

                     <p className="text-xs text-[var(--text-secondary)] mt-2">
                        {repeat === 'daily' && 'Repeats every day until selected date'}
                        {repeat === 'weekly' && 'Repeats every week until selected date'}
                     </p>
                  </div>
               )}
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between items-center">
               {editingEvent && (
                  <button
                     onClick={() => setShowDeleteConfirm(true)}
                     className="text-red-500 text-sm hover:underline"
                  >
                     Delete
                  </button>
               )}

               <div className="ml-auto flex gap-3">
                  <button
                     onClick={onClose}
                     className="
                        px-4 py-2 rounded-lg
                        border border-[var(--border)]
                        text-[var(--text-secondary)]
                        hover:bg-[var(--bg-secondary)]
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
