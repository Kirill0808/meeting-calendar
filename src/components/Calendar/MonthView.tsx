import { startOfMonth, startOfWeek, addDays, isSameMonth, isToday, format } from 'date-fns';
import clsx from 'clsx';
import { useCalendarStore } from '@/store/calendar-store';

export default function MonthView() {
   const currentDate = useCalendarStore((s) => s.currentDate);
   const openCreateModal = useCalendarStore((s) => s.openCreateModal);

   const monthStart = startOfMonth(currentDate);
   const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });

   const days = Array.from({ length: 42 }, (_, i) => addDays(calendarStart, i));

   const handleDayClick = (date: Date) => {
      const start = new Date(date);
      start.setHours(9, 0, 0, 0);
      openCreateModal(start);
   };

   return (
      <div className="flex flex-1 flex-col bg-white">
         <div className="grid grid-cols-7 grid-rows-6 flex-1">
            {days.map((day) => {
               const isCurrentMonth = isSameMonth(day, currentDate);
               const today = isToday(day);

               return (
                  <div
                     key={day.toISOString()}
                     onClick={() => handleDayClick(day)}
                     className={clsx(
                        'border border-gray-200 p-2 cursor-pointer transition flex flex-col',
                        'hover:bg-gray-50',
                        !isCurrentMonth && 'bg-gray-50 text-gray-400'
                     )}
                  >
                     <div
                        className={clsx(
                           'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full',
                           today && 'bg-blue-600 text-white'
                        )}
                     >
                        {format(day, 'd')}
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
}
