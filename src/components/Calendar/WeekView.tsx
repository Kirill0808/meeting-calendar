import { useCalendarStore } from '@/store/calendar-store';
import DayColumn from './DayColumn';
import TimeColumn from './TimeColumn';

import { addDays, startOfWeek } from 'date-fns';

export default function WeekView() {
   const { currentDate, events, addEvent } = useCalendarStore();

   const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
   const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
   const hours = Array.from({ length: 13 }, (_, i) => i + 8);

   const handleSlotClick = (date: Date, hour: number) => {
      const start = new Date(date);
      start.setHours(hour, 0, 0, 0);

      const end = new Date(start);
      end.setHours(start.getHours() + 1);

      addEvent({
         title: 'New event',
         start,
         end,
         color: '#22c55e',
      });
   };

   return (
      <div className="flex flex-1 overflow-hidden">
         <TimeColumn hours={hours} />

         <div className="grid grid-cols-7 flex-1">
            {days.map((day) => (
               <DayColumn
                  key={day.toISOString()}
                  date={day}
                  hours={hours}
                  events={events}
                  onSlotClick={handleSlotClick}
               />
            ))}
         </div>
      </div>
   );
}
