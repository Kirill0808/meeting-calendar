import { useRef, useEffect } from 'react';
import { useCalendarStore } from '@/store/calendar-store';
import DayColumn from './DayColumn';
import TimeColumn from './TimeColumn';
import { START_HOUR, END_HOUR } from '@/constants/calendar';
import { scrollToCurrentTime } from '@/utils/scrollToCurrentTime';

import { isSameDay, differenceInCalendarDays } from 'date-fns';
import type { CalendarEvent } from '@/types';

export default function DayView() {
   const currentDate = useCalendarStore((s) => s.currentDate);
   const events = useCalendarStore((s) => s.events);
   const openCreateModal = useCalendarStore((s) => s.openCreateModal);
   const openEditModal = useCalendarStore((s) => s.openEditModal);

   const containerRef = useRef<HTMLDivElement | null>(null);

   const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);

   const handleSlotClick = (date: Date, hour: number) => {
      const start = new Date(date);
      start.setHours(hour, 0, 0, 0);
      openCreateModal(start);
   };

   /* =========================
      Autoscroll to current time
   ========================= */

   useEffect(() => {
      scrollToCurrentTime(containerRef.current);
   }, []);

   /* =========================
      Build occurrence for day
   ========================= */

   const buildOccurrence = (event: CalendarEvent): CalendarEvent => {
      const start = new Date(currentDate);
      start.setHours(event.start.getHours(), event.start.getMinutes(), 0, 0);

      const end = new Date(currentDate);
      end.setHours(event.end.getHours(), event.end.getMinutes(), 0, 0);

      return { ...event, start, end };
   };

   /* =========================
      Generate events for day
   ========================= */

   const eventsForCurrentDay = events.flatMap((event) => {
      if (!event.repeat) {
         return isSameDay(event.start, currentDate) ? [event] : [];
      }

      const diffFromStart = differenceInCalendarDays(currentDate, event.start);
      if (diffFromStart < 0) return [];

      const repeatUntilDate = event.repeatUntil ? new Date(event.repeatUntil) : null;

      if (!repeatUntilDate) return [];

      const diffUntil = differenceInCalendarDays(currentDate, repeatUntilDate);

      if (diffUntil > 0) return [];

      if (event.repeat === 'daily') {
         return diffFromStart >= 0 ? [buildOccurrence(event)] : [];
      }

      if (event.repeat === 'weekly') {
         const isCorrectWeekDay = currentDate.getDay() === event.start.getDay();

         return isCorrectWeekDay ? [buildOccurrence(event)] : [];
      }

      return [];
   });

   return (
      <div
         className="
                  flex flex-1 overflow-hidden
                  bg-[var(--bg)]
                  text-[var(--text)]
                  transition-colors duration-300
               "
      >
         <div ref={containerRef} className="flex flex-1 overflow-y-auto items-start">
            <TimeColumn hours={hours} />

            <div
               className="
                     flex-1
                     border-l border-[var(--border)]
                     transition-colors
                  "
            >
               <DayColumn
                  date={currentDate}
                  hours={hours}
                  events={eventsForCurrentDay}
                  onSlotClick={handleSlotClick}
                  onEventClick={(event) => openEditModal(event.id)}
               />
            </div>
         </div>
      </div>
   );
}
