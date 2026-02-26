import { useCalendarStore } from '@/store/calendar-store';
import DayColumn from './DayColumn';
import TimeColumn from './TimeColumn';

import { addDays, startOfWeek } from 'date-fns';

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

   return (
      <div className="flex flex-1 overflow-hidden bg-white text-gray-900">
         <TimeColumn hours={hours} />

         <div className="grid grid-cols-7 flex-1 border-l border-gray-200">
            {days.map((day) => (
               <DayColumn
                  key={day.toISOString()}
                  date={day}
                  hours={hours}
                  events={events}
                  onSlotClick={handleSlotClick}
                  onEventClick={(event) => openEditModal(event.id)}
               />
            ))}
         </div>
      </div>
   );
}
