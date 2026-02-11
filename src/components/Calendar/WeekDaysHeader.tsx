import { startOfWeek, addDays, format, isSameDay } from 'date-fns';
import clsx from 'clsx';
import { useCalendarStore } from '@/store/calendar-store';

export default function WeekDaysHeader() {
   const { currentDate } = useCalendarStore();

   const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
   const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

   return (
      <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-white/10 bg-neutral-900">
         {/* empty cell for time column */}
         <div />

         {days.map((day) => {
            const isToday = isSameDay(day, new Date());

            return (
               <div
                  key={day.toISOString()}
                  className={clsx(
                     'py-2 text-center text-xs uppercase tracking-wide',
                     isToday ? 'text-blue-400 font-semibold' : 'text-white/60'
                  )}
               >
                  <div>{format(day, 'EEE')}</div>
                  <div className="text-sm">{format(day, 'd')}</div>
               </div>
            );
         })}
      </div>
   );
}
