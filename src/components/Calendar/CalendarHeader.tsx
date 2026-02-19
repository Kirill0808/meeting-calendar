import { useCalendarStore } from '@/store/calendar-store';
import { formatPeriodLabel } from '@/utils/date';
import clsx from 'clsx';

const views = ['day', 'week', 'month'] as const;

export default function CalendarHeader() {
   const { currentDate, currentView, goNext, goPrev, goToday, setCurrentView } = useCalendarStore();

   return (
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
         {/* navigation */}
         <div className="flex items-center gap-2">
            <button className="px-2 py-1 rounded hover:bg-gray-100" onClick={goPrev}>
               ‹
            </button>
            <button className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200" onClick={goToday}>
               Today
            </button>
            <button className="px-2 py-1 rounded hover:bg-gray-100" onClick={goNext}>
               ›
            </button>
         </div>

         {/* label */}
         <div className="text-sm font-medium text-gray-900">
            {formatPeriodLabel(currentView, currentDate)}
         </div>

         {/* view switcher */}
         <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {views.map((v) => (
               <button
                  key={v}
                  onClick={() => setCurrentView(v)}
                  className={clsx(
                     'px-3 py-1 text-sm rounded-md transition',
                     currentView === v
                        ? 'bg-white shadow text-gray-900'
                        : 'text-gray-600 hover:bg-gray-200'
                  )}
               >
                  {v}
               </button>
            ))}
         </div>
      </header>
   );
}
