import { useCalendarStore } from '@/store/calendar-store';
import DayColumn from './DayColumn';
import TimeColumn from './TimeColumn';
import { isSameDay, differenceInCalendarDays } from 'date-fns';
import type { CalendarEvent } from '@/types';

export default function DayView() {
   const currentDate = useCalendarStore((s) => s.currentDate);
   const events = useCalendarStore((s) => s.events);
   const openCreateModal = useCalendarStore((s) => s.openCreateModal);
   const openEditModal = useCalendarStore((s) => s.openEditModal);

   const hours = Array.from({ length: 13 }, (_, i) => i + 8);

   const handleSlotClick = (date: Date, hour: number) => {
      const start = new Date(date);
      start.setHours(hour, 0, 0, 0);
      openCreateModal(start);
   };

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
         bg-white dark:bg-gray-900
         text-gray-900 dark:text-gray-100
         transition-colors duration-300
      "
      >
         <TimeColumn hours={hours} />

         <div
            className="
            flex-1
            border-l border-gray-200 dark:border-gray-700
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
   );
}
