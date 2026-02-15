import type { CalendarEvent } from '@/types';
import { isSameDay } from 'date-fns';
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
   const isToday = isSameDay(date, new Date());

   const dayEvents = events.filter((event) => isSameDay(event.start, date));
   const layoutEvents = calculateEventLayout(dayEvents);

   return (
      <div className={clsx('relative border-l border-white/10', isToday && 'bg-white/5')}>
         {/* Time slots */}
         <div className="flex flex-col">
            {hours.map((hour) => (
               <div
                  key={hour}
                  className="h-16 border-t border-white/5 hover:bg-white/10"
                  onClick={() => onSlotClick?.(date, hour)}
               />
            ))}
         </div>

         {/* Events layer */}
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
