import type { CalendarEvent } from '@/types';
import { formatTime } from '@/utils/date';
import { useCalendarStore } from '@/store/calendar-store';
import { Repeat } from 'lucide-react';
import clsx from 'clsx';
import { useRef } from 'react';

interface EventCardProps {
   event: CalendarEvent;
   top: number;
   height: number;
   column: number;
   totalColumns: number;
   onClick?: (event: CalendarEvent) => void;
}

export default function EventCard({
   event,
   top,
   height,
   column,
   totalColumns,
   onClick,
}: EventCardProps) {
   const setActiveDragEvent = useCalendarStore((s) => s.setActiveDragEvent);
   const updateEventTime = useCalendarStore((s) => s.updateEventTime);

   const isResizing = useRef(false);
   const wasDragging = useRef(false);

   const START_HOUR = 8;
   const END_HOUR = 20;
   const STEP = 15;
   const HOUR_HEIGHT = 64;
   const PIXELS_PER_MINUTE = HOUR_HEIGHT / 60;

   const startResize = (e: React.MouseEvent, direction: 'top' | 'bottom') => {
      e.stopPropagation();
      e.preventDefault();

      isResizing.current = true;
      wasDragging.current = true;

      const element = e.currentTarget.parentElement as HTMLElement;
      const startY = e.clientY;

      const originalStartMinutes = event.start.getHours() * 60 + event.start.getMinutes();

      const originalEndMinutes = event.end.getHours() * 60 + event.end.getMinutes();

      let newStartMinutes = originalStartMinutes;
      let newEndMinutes = originalEndMinutes;

      const startHeight = element.offsetHeight;

      const onMouseMove = (moveEvent: MouseEvent) => {
         const deltaY = moveEvent.clientY - startY;

         const deltaMinutes = Math.round(deltaY / (PIXELS_PER_MINUTE * STEP)) * STEP;

         if (direction === 'bottom') {
            newEndMinutes = originalEndMinutes + deltaMinutes;

            if (newEndMinutes <= originalStartMinutes) return;
            if (newEndMinutes > END_HOUR * 60) return;

            const newHeight = (newEndMinutes - originalStartMinutes) * PIXELS_PER_MINUTE;

            element.style.height = `${newHeight}px`;
         }

         if (direction === 'top') {
            newStartMinutes = originalStartMinutes + deltaMinutes;

            if (newStartMinutes >= originalEndMinutes) return;
            if (newStartMinutes < START_HOUR * 60) return;

            const offsetMinutes = newStartMinutes - originalStartMinutes;

            const offsetPixels = offsetMinutes * PIXELS_PER_MINUTE;

            element.style.transform = `translateY(${offsetPixels}px)`;

            element.style.height = `${startHeight - offsetPixels}px`;
         }
      };

      const onMouseUp = () => {
         isResizing.current = false;

         const newStart = new Date(event.start);
         newStart.setHours(0, 0, 0, 0);
         newStart.setMinutes(newStartMinutes);

         const newEnd = new Date(event.start);
         newEnd.setHours(0, 0, 0, 0);
         newEnd.setMinutes(newEndMinutes);

         updateEventTime(event.id, newStart, newEnd);

         element.style.transform = '';
         element.style.height = '';

         window.removeEventListener('mousemove', onMouseMove);
         window.removeEventListener('mouseup', onMouseUp);

         setTimeout(() => {
            wasDragging.current = false;
         }, 0);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
   };

   return (
      <div
         draggable={!isResizing.current}
         onDragStart={(e) => {
            wasDragging.current = true;

            e.dataTransfer.setData('eventId', event.id);
            e.dataTransfer.effectAllowed = 'move';
            setActiveDragEvent(event);
         }}
         onDragEnd={() => {
            setActiveDragEvent(null);

            setTimeout(() => {
               wasDragging.current = false;
            }, 0);
         }}
         onClick={(e) => {
            e.stopPropagation();

            if (wasDragging.current || isResizing.current) return;

            onClick?.(event);
         }}
         style={{
            top,
            height,
            backgroundColor: event.color || '#2563eb',
            width: `calc(${100 / totalColumns}% - 4px)`,
            left: `calc(${(column * 100) / totalColumns}% + 2px)`,
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

         {event.repeat && (
            <div
               className="absolute top-1 right-1 text-white/80"
               title={event.repeat === 'daily' ? 'Repeats daily' : 'Repeats weekly'}
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
