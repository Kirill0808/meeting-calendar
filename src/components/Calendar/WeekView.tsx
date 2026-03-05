import { useCalendarStore } from '@/store/calendar-store';
import DayColumn from './DayColumn';
import TimeColumn from './TimeColumn';

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

   const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
   const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

   const hours = Array.from({ length: 13 }, (_, i) => i + 8);

   const handleSlotClick = (date: Date, hour: number) => {
      const start = new Date(date);
      start.setHours(hour, 0, 0, 0);
      openCreateModal(start);
   };

   // 🔹 helper для генерации occurrence на конкретный день
   const buildOccurrence = (event: CalendarEvent, targetDate: Date): CalendarEvent => {
      const start = new Date(targetDate);
      start.setHours(event.start.getHours(), event.start.getMinutes(), 0, 0);

      const end = new Date(targetDate);
      end.setHours(event.end.getHours(), event.end.getMinutes(), 0, 0);

      return { ...event, start, end };
   };

   // 🔹 функция получения событий для конкретного дня
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
            if (diffFromStart < 0) return [];

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
         flex flex-1 overflow-hidden
         bg-white dark:bg-gray-900
         text-gray-900 dark:text-gray-100
         transition-colors
      "
      >
         <TimeColumn hours={hours} />

         <div
            className="
            grid grid-cols-7 flex-1
            border-l border-gray-200 dark:border-gray-700
            transition-colors
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
   );
}
