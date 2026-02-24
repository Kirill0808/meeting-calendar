import { startOfMonth, startOfWeek, addDays, isSameMonth, isToday, format } from 'date-fns';
import clsx from 'clsx';
import { useCalendarStore } from '@/store/calendar-store';

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

   return (
      <div className="flex flex-1 flex-col bg-white h-full">
         {/* Days of week */}
         <div className="grid grid-cols-7 border-b bg-white">
            {weekDays.map((day) => (
               <div
                  key={day}
                  className="text-xs font-medium text-gray-500 text-center py-2 border-r last:border-r-0"
               >
                  {day}
               </div>
            ))}
         </div>

         {/* Grid */}
         <div className="grid grid-cols-7 grid-rows-6 flex-1">
            {days.map((day) => {
               const isCurrentMonth = isSameMonth(day, currentDate);
               const today = isToday(day);

               const dayKey = format(day, 'yyyy-MM-dd');

               const dayEvents = events
                  .filter((event) => format(new Date(event.start), 'yyyy-MM-dd') === dayKey)
                  .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

               const visibleEvents = dayEvents.slice(0, 3);
               const hiddenCount = dayEvents.length - visibleEvents.length;

               return (
                  <div
                     key={day.toISOString()}
                     onClick={() => handleDayClick(day)}
                     className={clsx(
                        'border border-gray-200 p-2 cursor-pointer transition flex flex-col overflow-hidden',
                        'hover:bg-gray-50',
                        !isCurrentMonth && 'bg-gray-50 text-gray-400'
                     )}
                  >
                     {/* Date number */}
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
                              key={event.id}
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
                              className="text-xs text-gray-500 cursor-pointer hover:underline"
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
