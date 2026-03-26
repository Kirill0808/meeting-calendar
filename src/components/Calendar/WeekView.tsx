import { useRef, useEffect } from 'react';
import { useCalendarStore } from '@/store/calendar-store';
import DayColumn from './DayColumn';
import TimeColumn from './TimeColumn';
import { START_HOUR, END_HOUR } from '@/constants/calendar';
import { scrollToCurrentTime } from '@/utils/scrollToCurrentTime';

import {
   addDays,
   startOfWeek,
   startOfDay,
   isSameDay,
   differenceInCalendarDays,
   getDay,
} from 'date-fns';

import type { CalendarEvent } from '@/types';

export default function WeekView() {
   const currentDate = useCalendarStore((s) => s.currentDate);
   const events = useCalendarStore((s) => s.events);

   const openCreateModal = useCalendarStore((s) => s.openCreateModal);
   const openEditModal = useCalendarStore((s) => s.openEditModal);

   const containerRef = useRef<HTMLDivElement | null>(null);

   const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
   const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

   const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);

   const handleSlotClick = (date: Date, hour: number) => {
      const start = new Date(date);
      start.setHours(hour, 0, 0, 0);
      openCreateModal(start);
   };

   // 🔹 автоскролл к текущему времени
   useEffect(() => {
      scrollToCurrentTime(containerRef.current);
   }, []);

   // 🔹 helper для генерации occurrence
   const buildOccurrence = (event: CalendarEvent, targetDate: Date): CalendarEvent => {
      const start = new Date(targetDate);
      start.setHours(event.start.getHours(), event.start.getMinutes(), 0, 0);

      const end = new Date(targetDate);
      end.setHours(event.end.getHours(), event.end.getMinutes(), 0, 0);

      return { ...event, start, end };
   };

   // 🔹 события для конкретного дня
   const getEventsForDay = (day: Date): CalendarEvent[] => {
      return events.flatMap((event) => {
         const eventStart = new Date(event.start);
         const eventEnd = new Date(event.end);

         if (isNaN(eventStart.getTime())) return [];

         if (!event.repeat) {
            return isSameDay(eventStart, day)
               ? [{ ...event, start: eventStart, end: eventEnd }]
               : [];
         }

         const diffFromStart = differenceInCalendarDays(startOfDay(day), startOfDay(eventStart));

         if (diffFromStart < 0) return [];

         if (event.repeat === 'weekly') {
            const sameWeekday = getDay(day) === getDay(eventStart);

            if (sameWeekday) {
               return [buildOccurrence({ ...event, start: eventStart, end: eventEnd }, day)];
            }
         }

         if (event.repeat === 'daily') {
            if (event.repeatUntil) {
               const diffUntil = differenceInCalendarDays(
                  startOfDay(day),
                  startOfDay(new Date(event.repeatUntil))
               );

               if (diffUntil > 0) return [];
            }

            return [buildOccurrence(event, day)];
         }

         return [];
      });
   };

   return (
      <div
         className="
         flex flex-1 min-h-0 overflow-hidden
         bg-[var(--bg)]
         text-[var(--text)]
         transition-colors
      "
      >
         <div ref={containerRef} className="flex flex-1 min-h-0 overflow-y-auto">
            <TimeColumn hours={hours} />

            <div
               className="
               grid grid-cols-7 flex-1
               border-l
               border-[var(--border)]
            "
            >
               {days.map((day) => {
                  const eventsForDay = getEventsForDay(day);

                  return (
                     <DayColumn
                        key={day.toISOString()}
                        date={day}
                        hours={hours}
                        events={eventsForDay}
                        onSlotClick={handleSlotClick}
                        onEventClick={(event) => openEditModal(event.id)}
                     />
                  );
               })}
            </div>
         </div>
      </div>
   );
}
