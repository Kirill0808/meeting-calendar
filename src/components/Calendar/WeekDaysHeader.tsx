import { startOfWeek, addDays, format, isSameDay } from 'date-fns';
import clsx from 'clsx';
import { useCalendarStore } from '@/store/calendar-store';

export default function WeekDaysHeader() {
   const { currentDate } = useCalendarStore();

   const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
   const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

   return (
      <div
         className="
         grid grid-cols-[56px_repeat(7,1fr)]
         border-b
         bg-[var(--bg)]
         border-[var(--border)]
         transition-colors
      "
      >
         {/* empty cell for time column */}
         <div />

         {days.map((day) => {
            const isToday = isSameDay(day, new Date());

            return (
               <div
                  key={day.toISOString()}
                  className={clsx(
                     'py-3 text-center text-xs uppercase tracking-wide transition',
                     isToday ? 'text-blue-500 font-semibold' : 'text-[var(--text-secondary)]'
                  )}
               >
                  <div>{format(day, 'EEE')}</div>

                  <div
                     className="
                     text-sm
                     text-[var(--text)]
                  "
                  >
                     {format(day, 'd')}
                  </div>
               </div>
            );
         })}
      </div>
   );
}
