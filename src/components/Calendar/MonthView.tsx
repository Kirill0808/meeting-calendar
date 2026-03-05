import { startOfMonth, startOfWeek, addDays, isSameMonth, isToday, format } from 'date-fns';
import clsx from 'clsx';
import { useCalendarStore } from '@/store/calendar-store';
import { isSameDay, startOfDay, differenceInCalendarDays } from 'date-fns';

const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function MonthView() {
   const currentDate = useCalendarStore((s) => s.currentDate);
   const events = useCalendarStore((s) => s.events);
   const openCreateModal = useCalendarStore((s) => s.openCreateModal);
   const openEditModal = useCalendarStore((s) => s.openEditModal);

   const monthStart = startOfMonth(currentDate);
   const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });

   const days = Array.from({ length: 42 }, (_, i) => addDays(calendarStart, i));

   const handleDayClick = (date: Date) => {
      const start = new Date(date);
      start.setHours(9, 0, 0, 0);
      openCreateModal(start);
   };

   const buildOccurrence = (event: any, targetDate: Date) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);

      const start = new Date(targetDate);
      start.setHours(eventStart.getHours(), eventStart.getMinutes(), 0, 0);

      const end = new Date(targetDate);
      end.setHours(eventEnd.getHours(), eventEnd.getMinutes(), 0, 0);

      return { ...event, start, end };
   };

   const getEventsForDay = (day: Date) => {
      return events.flatMap((event) => {
         const eventStart = new Date(event.start);
         const eventEnd = new Date(event.end);

         if (!event.repeat) {
            return isSameDay(eventStart, day)
               ? [{ ...event, start: eventStart, end: eventEnd }]
               : [];
         }

         const diffFromStart = differenceInCalendarDays(startOfDay(day), startOfDay(eventStart));

         if (diffFromStart < 0) return [];

         if (event.repeatUntil) {
            const diffUntil = differenceInCalendarDays(
               startOfDay(day),
               startOfDay(new Date(event.repeatUntil))
            );

            if (diffUntil > 0) return [];
         }

         if (event.repeat === 'daily') {
            return [buildOccurrence(event, day)];
         }

         if (event.repeat === 'weekly') {
            const diff = differenceInCalendarDays(startOfDay(day), startOfDay(eventStart));

            if (diff % 7 === 0) {
               return [buildOccurrence(event, day)];
            }

            return [];
         }

         return [];
      });
   };

   return (
      <div
         className="
                     flex flex-1 flex-col h-full
                     bg-white dark:bg-gray-900
                     text-gray-900 dark:text-gray-100
                     transition-colors"
      >
         {/* Days of week */}
         <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            {weekDays.map((day) => (
               <div
                  key={day}
                  className="
                     text-xs font-medium text-gray-500 dark:text-gray-400
                     text-center py-2
                     border-r border-gray-200 dark:border-gray-700
                     last:border-r-0"
               >
                  {day}
               </div>
            ))}
         </div>

         {/* Grid */}
         <div className="grid grid-cols-7 grid-rows-6 flex-1 h-full">
            {days.map((day) => {
               const isCurrentMonth = isSameMonth(day, currentDate);
               const today = isToday(day);

               const dayEvents = getEventsForDay(day).sort(
                  (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
               );

               const visibleEvents = dayEvents.slice(0, 3);
               const hiddenCount = dayEvents.length - visibleEvents.length;

               return (
                  <div
                     key={day.toISOString()}
                     onClick={() => handleDayClick(day)}
                     className={clsx(
                        `
                                 border border-gray-200 dark:border-gray-700
                                 p-2 cursor-pointer transition
                                 flex flex-col overflow-hidden
                                 hover:bg-gray-50 dark:hover:bg-gray-800/60`,
                        !isCurrentMonth &&
                           'bg-gray-50 dark:bg-gray-800/40 text-gray-400 dark:text-gray-500'
                     )}
                  >
                     {/* Date number */}
                     <div
                        className={clsx(
                           'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1',
                           today && 'bg-blue-600 dark:bg-blue-500 text-white'
                        )}
                     >
                        {format(day, 'd')}
                     </div>

                     {/* Events */}
                     <div className="flex flex-col gap-1">
                        {visibleEvents.map((event) => (
                           <div
                              key={`${event.id}-${event.start}`}
                              onClick={(e) => {
                                 e.stopPropagation();
                                 openEditModal(event.id);
                              }}
                              title={event.title}
                              className="text-xs px-2 py-1 rounded truncate text-white shadow-sm cursor-pointer hover:opacity-90 transition"
                              style={{ backgroundColor: event.color }}
                           >
                              {event.title}
                           </div>
                        ))}

                        {hiddenCount > 0 && (
                           <div
                              className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:underline"
                              onClick={(e) => e.stopPropagation()}
                           >
                              +{hiddenCount} more
                           </div>
                        )}
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
}
