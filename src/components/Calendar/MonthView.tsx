import { useState } from 'react';
import type { CalendarEvent } from '@/types';

import {
   startOfMonth,
   startOfWeek,
   addDays,
   isSameMonth,
   isToday,
   format,
   isSameDay,
   startOfDay,
   differenceInCalendarDays,
} from 'date-fns';

import clsx from 'clsx';
import { useCalendarStore } from '@/store/calendar-store';

const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const MAX_VISIBLE_EVENTS = 1;

export default function MonthView() {
   const currentDate = useCalendarStore((s) => s.currentDate);
   const events = useCalendarStore((s) => s.events);
   const openCreateModal = useCalendarStore((s) => s.openCreateModal);
   const openEditModal = useCalendarStore((s) => s.openEditModal);

   const [popoverDay, setPopoverDay] = useState<Date | null>(null);
   const [popoverEvents, setPopoverEvents] = useState<CalendarEvent[]>([]);

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
         }

         return [];
      });
   };

   return (
      <div className="flex flex-1 flex-col h-full min-h-0 bg-white dark:bg-gray-900">
         {/* Week days */}
         <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
            {weekDays.map((day) => (
               <div
                  key={day}
                  className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center py-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0"
               >
                  {day}
               </div>
            ))}
         </div>

         {/* Calendar grid */}
         <div className="grid grid-cols-7 grid-rows-6 flex-1 min-h-0">
            {days.map((day) => {
               const isCurrentMonth = isSameMonth(day, currentDate);
               const today = isToday(day);

               const dayEvents = getEventsForDay(day).sort(
                  (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
               );

               const visibleEvents = dayEvents.slice(0, MAX_VISIBLE_EVENTS);
               const hiddenCount = dayEvents.length - MAX_VISIBLE_EVENTS;

               return (
                  <div
                     key={day.toISOString()}
                     onClick={() => handleDayClick(day)}
                     className={clsx(
                        'border border-gray-200 dark:border-gray-700 p-2 cursor-pointer flex flex-col overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800/60',
                        !isCurrentMonth && 'bg-gray-50 dark:bg-gray-800/40 text-gray-400'
                     )}
                  >
                     {/* Day number */}
                     <div
                        className={clsx(
                           'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1',
                           today && 'bg-blue-600 text-white'
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
                              className="
                                       text-xs px-2 py-1 rounded
                                       text-white shadow-sm cursor-pointer
                                       truncate flex min-w-0
                                    "
                              style={{ backgroundColor: event.color }}
                           >
                              {format(new Date(event.start), 'HH:mm')} {event.title}
                           </div>
                        ))}

                        {hiddenCount > 0 && (
                           <div
                              className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
                              onClick={(e) => {
                                 e.stopPropagation();
                                 setPopoverDay(day);
                                 setPopoverEvents(dayEvents);
                              }}
                           >
                              +{hiddenCount} more
                           </div>
                        )}
                     </div>
                  </div>
               );
            })}
         </div>

         {/* POPUP */}
         {popoverDay && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
               <div className="absolute inset-0 bg-black/20" onClick={() => setPopoverDay(null)} />

               <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-72">
                  <div className="font-semibold mb-3">{format(popoverDay, 'd MMM')}</div>

                  <div className="flex flex-col gap-2">
                     {popoverEvents.map((event) => (
                        <div
                           key={`${event.id}-${event.start}`}
                           onClick={() => {
                              openEditModal(event.id);
                              setPopoverDay(null);
                           }}
                           className="px-2 py-1 rounded text-white text-sm cursor-pointer"
                           style={{ backgroundColor: event.color }}
                        >
                           {format(new Date(event.start), 'HH:mm')} {event.title}
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
