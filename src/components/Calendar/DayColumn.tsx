import { useState } from 'react';
import { Ban } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CalendarEvent } from '@/types';
import { isSameDay, isToday } from 'date-fns';
import { useCalendarStore } from '@/store/calendar-store';
import { getEventPosition, calculateEventLayout } from '@/utils/event';
import EventCard from './EventCard';
import CurrentTimeLine from './CurrentTimeLine';
import clsx from 'clsx';
import { START_HOUR, END_HOUR, HOUR_HEIGHT, STEP_MINUTES } from '@/constants/calendar';

interface DayColumnProps {
   date: Date;
   hours: number[];
   events: CalendarEvent[];
   onSlotClick?: (date: Date, hour: number) => void;
   onEventClick?: (event: CalendarEvent) => void;
}

export default function DayColumn({
   date,
   hours,
   events,
   onSlotClick,
   onEventClick,
}: DayColumnProps) {
   const today = isToday(date);

   const moveEvent = useCalendarStore((s) => s.moveEvent);
   const activeDragEvent = useCalendarStore((s) => s.activeDragEvent);

   const [isDragOver, setIsDragOver] = useState(false);
   const [previewTop, setPreviewTop] = useState<number | null>(null);
   const [previewHeight, setPreviewHeight] = useState<number>(0);
   const [isInvalidDrop, setIsInvalidDrop] = useState(false);

   const PIXELS_PER_MINUTE = HOUR_HEIGHT / 60;

   const dayEvents = events.filter((event) => isSameDay(new Date(event.start), date));

   const layoutEvents = calculateEventLayout(dayEvents);

   return (
      <div
         style={{ height: (END_HOUR - START_HOUR) * HOUR_HEIGHT }}
         onDragOver={(e) => {
            e.preventDefault();
            if (!activeDragEvent) return;

            setIsDragOver(true);

            const rect = e.currentTarget.getBoundingClientRect();
            const offsetY = e.clientY - rect.top;

            // 🔥 snap по 15 минутам
            const snappedMinutes =
               Math.floor(offsetY / (PIXELS_PER_MINUTE * STEP_MINUTES)) * STEP_MINUTES;

            const snappedTop = snappedMinutes * PIXELS_PER_MINUTE;

            const durationMs =
               new Date(activeDragEvent.end).getTime() - new Date(activeDragEvent.start).getTime();

            const durationMinutes = durationMs / (1000 * 60);

            const calculatedHeight = durationMinutes * PIXELS_PER_MINUTE;

            const startHour = START_HOUR + snappedMinutes / 60;

            const invalid = startHour + durationMinutes / 60 > END_HOUR;

            setIsInvalidDrop(invalid);
            setPreviewTop(snappedTop);
            setPreviewHeight(calculatedHeight);
         }}
         onDragLeave={() => {
            setIsDragOver(false);
            setPreviewTop(null);
            setIsInvalidDrop(false);
         }}
         onDrop={(e) => {
            e.preventDefault();
            if (!activeDragEvent) return;

            setIsDragOver(false);

            if (isInvalidDrop) {
               setPreviewTop(null);
               return;
            }

            const rect = e.currentTarget.getBoundingClientRect();
            const offsetY = e.clientY - rect.top;

            const snappedMinutes =
               Math.floor(offsetY / (PIXELS_PER_MINUTE * STEP_MINUTES)) * STEP_MINUTES;

            const newStart = new Date(date);
            newStart.setHours(START_HOUR, 0, 0, 0);
            newStart.setMinutes(snappedMinutes);

            const duration =
               new Date(activeDragEvent.end).getTime() - new Date(activeDragEvent.start).getTime();

            const newEnd = new Date(newStart.getTime() + duration);

            moveEvent(activeDragEvent.id, newStart, newEnd);

            setPreviewTop(null);
            setIsInvalidDrop(false);
         }}
         className={clsx(
            'relative border-l transition-colors',
            'border-[var(--border)]',
            today && 'bg-[var(--today)]'
         )}
      >
         {/* Time slots */}
         <div
            className="relative z-0 flex flex-col"
            style={{ height: (END_HOUR - START_HOUR) * HOUR_HEIGHT }}
         >
            {hours.map((hour) => (
               <div
                  key={hour}
                  style={{ height: HOUR_HEIGHT }}
                  className="
                           border-t border-[var(--border)]
                           hover:bg-[var(--hover)]
                           cursor-pointer
                           transition-colors
                        "
                  onClick={() => onSlotClick?.(date, hour)}
               />
            ))}
         </div>

         {isToday(date) && <CurrentTimeLine />}

         {/* Events */}
         <div className="absolute inset-0 z-10 pointer-events-none">
            <AnimatePresence>
               {layoutEvents.map(({ event, column, totalColumns }) => {
                  const { top, height } = getEventPosition(event);

                  return (
                     <motion.div
                        key={event.id}
                        initial={{
                           opacity: 0,
                           y: 10,
                           scale: 0.98,
                        }}
                        animate={{
                           opacity: 1,
                           y: 0,
                           scale: 1,
                        }}
                        exit={{
                           opacity: 0,
                           y: -10,
                           scale: 0.98,
                        }}
                        transition={{
                           type: 'spring',
                           stiffness: 300,
                           damping: 25,
                        }}
                        style={{
                           position: 'absolute',
                           top,
                           height,
                           left: `${(column / totalColumns) * 100}%`,
                           width: `${100 / totalColumns}%`,
                        }}
                     >
                        <EventCard event={event} top={0} height={height} onClick={onEventClick} />
                     </motion.div>
                  );
               })}
            </AnimatePresence>
         </div>

         {/* Ghost Preview */}
         {isDragOver && previewTop !== null && activeDragEvent && (
            <div
               className={clsx(
                  `
                        absolute left-1 right-1
                        rounded-lg
                        text-white text-xs p-2
                        pointer-events-none
                        shadow-lg backdrop-blur-sm
                        z-20
                        transition-colors
                        `,
                  isInvalidDrop ? 'bg-[var(--danger-soft)]' : 'bg-[var(--primary-soft)]'
               )}
               style={{
                  top: previewTop,
                  height: previewHeight,
               }}
            >
               {isInvalidDrop && (
                  <div className="absolute top-1 right-1 opacity-80">
                     <Ban size={14} />
                  </div>
               )}
               <div className="font-medium">{activeDragEvent.title}</div>
            </div>
         )}
      </div>
   );
}
