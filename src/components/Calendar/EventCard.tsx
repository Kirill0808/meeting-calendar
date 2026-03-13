import type { CalendarEvent } from '@/types';
import { formatTime } from '@/utils/date';
import { useCalendarStore } from '@/store/calendar-store';
import { Repeat } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

import { START_HOUR, END_HOUR, HOUR_HEIGHT, STEP_MINUTES } from '@/constants/calendar';

const PIXELS_PER_MINUTE = HOUR_HEIGHT / 60;

interface EventCardProps {
   event: CalendarEvent;
   top: number;
   height: number;
   onClick?: (event: CalendarEvent) => void;
}

export default function EventCard({ event, top, height, onClick }: EventCardProps) {
   const setActiveDragEvent = useCalendarStore((s) => s.setActiveDragEvent);
   const updateEventTime = useCalendarStore((s) => s.updateEventTime);

   const [isResizing, setIsResizing] = useState(false);
   const [wasDragging, setWasDragging] = useState(false);

   const startResize = (e: React.MouseEvent, direction: 'top' | 'bottom') => {
      e.stopPropagation();
      e.preventDefault();

      setIsResizing(true);
      setWasDragging(true);

      const element = e.currentTarget.parentElement as HTMLElement;
      const startY = e.clientY;

      const originalStartMinutes =
         (event.start.getHours() - START_HOUR) * 60 + event.start.getMinutes();

      const originalEndMinutes = (event.end.getHours() - START_HOUR) * 60 + event.end.getMinutes();

      let newStartMinutes = originalStartMinutes;
      let newEndMinutes = originalEndMinutes;

      const startHeight = element.offsetHeight;

      const onMouseMove = (moveEvent: MouseEvent) => {
         const deltaY = moveEvent.clientY - startY;

         const deltaMinutes =
            Math.round(deltaY / (PIXELS_PER_MINUTE * STEP_MINUTES)) * STEP_MINUTES;

         if (direction === 'bottom') {
            newEndMinutes = originalEndMinutes + deltaMinutes;

            if (newEndMinutes <= originalStartMinutes) return;
            if (newEndMinutes > END_HOUR * 60) return;

            const MIN_HEIGHT = 20;

            const newHeight = (newEndMinutes - originalStartMinutes) * PIXELS_PER_MINUTE;

            element.style.height = `${Math.max(MIN_HEIGHT, newHeight)}px`;
         }

         if (direction === 'top') {
            newStartMinutes = originalStartMinutes + deltaMinutes;

            if (newStartMinutes >= originalEndMinutes) return;
            if (newStartMinutes < START_HOUR * 60) return;

            const offsetMinutes = newStartMinutes - originalStartMinutes;
            const offsetPixels = offsetMinutes * PIXELS_PER_MINUTE;

            const MIN_HEIGHT = 20;

            element.style.top = `${top + offsetPixels}px`;
            element.style.height = `${Math.max(MIN_HEIGHT, startHeight - offsetPixels)}px`;
         }
      };

      const onMouseUp = () => {
         setIsResizing(false);

         const newStart = new Date(event.start);
         newStart.setHours(START_HOUR, 0, 0, 0);
         newStart.setMinutes(newStartMinutes);

         const newEnd = new Date(event.start);
         newEnd.setHours(START_HOUR, 0, 0, 0);
         newEnd.setMinutes(newEndMinutes);

         updateEventTime(event.id, newStart, newEnd);

         element.style.height = '';
         element.style.top = '';

         window.removeEventListener('mousemove', onMouseMove);
         window.removeEventListener('mouseup', onMouseUp);

         setTimeout(() => {
            setWasDragging(false);
         }, 0);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
   };

   return (
      <div
         draggable={!isResizing}
         onDragStart={(e) => {
            setWasDragging(true);

            e.dataTransfer.setData('eventId', event.id);
            e.dataTransfer.effectAllowed = 'move';
            setActiveDragEvent(event);
         }}
         onDragEnd={() => {
            setActiveDragEvent(null);

            setTimeout(() => {
               setWasDragging(false);
            }, 0);
         }}
         onClick={(e) => {
            e.stopPropagation();

            if (wasDragging || isResizing) return;

            onClick?.(event);
         }}
         style={{
            top,
            height,
            backgroundColor: event.color || '#2563eb',
            width: 'calc(100% - 4px)',
            left: '2px',
         }}
         className={clsx(
            'absolute rounded-lg px-2 py-1 text-xs text-white',
            'cursor-pointer overflow-hidden',
            'shadow-sm hover:shadow-md transition-all',
            'hover:brightness-110',
            'pointer-events-auto'
         )}
      >
         {/* TOP RESIZE */}
         <div
            className="
                        absolute top-0 left-0 right-0 h-2
                        cursor-ns-resize
                        opacity-0 hover:opacity-100
                        transition
                        bg-white/40 dark:bg-black/40
                        rounded-t-lg"
            onMouseDown={(e) => startResize(e, 'top')}
         />

         {/* BOTTOM RESIZE */}
         <div
            className="
                        absolute bottom-0 left-0 right-0 h-2
                        cursor-ns-resize
                        opacity-0 hover:opacity-100
                        transition
                        bg-white/40 dark:bg-black/40
                        rounded-b-lg"
            onMouseDown={(e) => startResize(e, 'bottom')}
         />

         {event.seriesId && (
            <div
               className="absolute top-1 right-1 text-white/80"
               title="Part of recurring event series"
            >
               <Repeat size={12} />
            </div>
         )}

         <div className="font-medium truncate pr-4">{event.title}</div>

         <div className="opacity-90 text-[10px]">
            {formatTime(event.start)} – {formatTime(event.end)}
         </div>
      </div>
   );
}
