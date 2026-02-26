import type { CalendarEvent } from '@/types';
import { isSameDay, isToday } from 'date-fns';
import clsx from 'clsx';

import EventCard from './EventCard';
import { getEventPosition, calculateEventLayout } from '@/utils/event';

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

   const dayEvents = events.filter((event) => isSameDay(new Date(event.start), date));

   const layoutEvents = calculateEventLayout(dayEvents);

   return (
      <div className={clsx('relative border-l border-gray-200', today ? 'bg-blue-50' : 'bg-white')}>
         {/* Time slots */}
         <div className="relative z-0 flex flex-col">
            {hours.map((hour) => (
               <div
                  key={hour}
                  className="h-16 border-b border-gray-200 hover:bg-blue-100 cursor-pointer transition"
                  onClick={() => onSlotClick?.(date, hour)}
               />
            ))}
         </div>

         {/* Events */}
         <div className="absolute inset-0 z-10 pointer-events-none">
            {layoutEvents.map(({ event, column, totalColumns }) => {
               const { top, height } = getEventPosition(event);

               return (
                  <EventCard
                     key={event.id}
                     event={event}
                     top={top}
                     height={height}
                     column={column}
                     totalColumns={totalColumns}
                     onClick={onEventClick}
                  />
               );
            })}
         </div>
      </div>
   );
}
