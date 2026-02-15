import { useCalendarStore } from '@/store/calendar-store';
import { formatPeriodLabel } from '@/utils/date';
import clsx from 'clsx';

const views = ['day', 'week', 'month'] as const;

export default function CalendarHeader() {
   const { currentDate, currentView, goNext, goPrev, goToday, setCurrentView } = useCalendarStore();

   return (
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-neutral-900">
         {/* navigation */}
         <div className="flex items-center gap-2">
            <button onClick={goPrev}>‹</button>
            <button onClick={goToday}>Today</button>
            <button onClick={goNext}>›</button>
         </div>

         {/* label */}
         <div className="text-sm font-medium">{formatPeriodLabel(currentView, currentDate)}</div>

         {/* view switcher */}
         <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {views.map((v) => (
               <button
                  key={v}
                  onClick={() => setCurrentView(v)}
                  className={clsx(
                     'px-3 py-1 text-sm rounded-md',
                     currentView === v ? 'bg-white text-black' : 'hover:bg-white/10'
                  )}
               >
                  {v}
               </button>
            ))}
         </div>
      </header>
   );
}
