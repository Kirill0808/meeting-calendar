import { useCalendarStore } from '@/store/calendar-store';
import { formatPeriodLabel } from '@/utils/date';
import clsx from 'clsx';
import ThemeToggle from '@/components/ui/ThemeToggle';

const views = ['day', 'week', 'month'] as const;

export default function CalendarHeader() {
   const { currentDate, currentView, goNext, goPrev, goToday, setCurrentView } = useCalendarStore();

   return (
      <header
         className="
            flex items-center justify-between px-4 py-3
            border-b
            border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900
            transition-colors duration-300
         "
      >
         {/* navigation */}
         <div className="flex items-center gap-2">
            <button
               className="
                  px-2 py-1 rounded
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  transition
               "
               onClick={goPrev}
            >
               ‹
            </button>

            <button
               className="
                  px-3 py-1 rounded
                  bg-gray-100 dark:bg-gray-800
                  hover:bg-gray-200 dark:hover:bg-gray-700
                  transition
               "
               onClick={goToday}
            >
               Today
            </button>

            <button
               className="
                  px-2 py-1 rounded
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  transition
               "
               onClick={goNext}
            >
               ›
            </button>
         </div>

         {/* label */}
         <div className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors">
            {formatPeriodLabel(currentView, currentDate)}
         </div>

         {/* right side */}
         <div className="flex items-center gap-3">
            {/* view switcher */}
            <div
               className="
                  flex gap-1
                  bg-gray-100 dark:bg-gray-800
                  rounded-lg p-1
                  transition-colors
               "
            >
               {views.map((v) => (
                  <button
                     key={v}
                     onClick={() => setCurrentView(v)}
                     className={clsx(
                        'px-3 py-1 text-sm rounded-md transition',
                        currentView === v
                           ? `
                              bg-white dark:bg-gray-700
                              shadow
                              text-gray-900 dark:text-white
                           `
                           : `
                              text-gray-600 dark:text-gray-300
                              hover:bg-gray-200 dark:hover:bg-gray-700
                           `
                     )}
                  >
                     {v}
                  </button>
               ))}
            </div>

            {/* theme toggle */}
            <ThemeToggle />
         </div>
      </header>
   );
}
