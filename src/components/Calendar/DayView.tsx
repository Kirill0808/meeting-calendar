import { useCalendarStore } from '@/store/calendar-store';
import DayColumn from './DayColumn';
import TimeColumn from './TimeColumn';

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

   return (
      <div className="flex flex-1 overflow-hidden bg-white text-gray-900">
         <TimeColumn hours={hours} />

         <div className="flex-1 border-l border-gray-200">
            <DayColumn
               date={currentDate}
               hours={hours}
               events={events}
               onSlotClick={handleSlotClick}
               onEventClick={(event) => openEditModal(event.id)}
            />
         </div>
      </div>
   );
}
