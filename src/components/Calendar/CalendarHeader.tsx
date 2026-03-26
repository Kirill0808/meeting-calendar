import { useCalendarStore } from '@/store/calendar-store';
import { formatPeriodLabel } from '@/utils/date';
import { cn } from '@/utils/cn';
import ThemeToggle from '@/components/ui/ThemeToggle';

const views = ['day', 'week', 'month'] as const;

export default function CalendarHeader() {
   const { currentDate, currentView, goNext, goPrev, goToday, setCurrentView } = useCalendarStore();

   return (
      <header
         className="
            flex items-center justify-between px-4 py-3
            border-b border-[var(--border)]
            bg-[var(--bg)]
            transition-colors duration-300
         "
      >
         {/* navigation */}
         <div className="flex items-center gap-2">
            <button
               className="
                  px-2 py-1 rounded
                  hover:bg-[var(--bg-hover)]
                  transition
               "
               onClick={goPrev}
            >
               ‹
            </button>

            <button
               className="
                  px-3 py-1 rounded
                  bg-[var(--bg-secondary)]
                  hover:bg-[var(--bg-hover)]
                  transition
               "
               onClick={goToday}
            >
               Today
            </button>

            <button
               className="
                  px-2 py-1 rounded
                  hover:bg-[var(--bg-hover)]
                  transition
               "
               onClick={goNext}
            >
               ›
            </button>
         </div>

         {/* label */}
         <div className="text-sm font-medium text-[var(--text)]">
            {formatPeriodLabel(currentView, currentDate)}
         </div>

         {/* right side */}
         <div className="flex items-center gap-3">
            {/* view switcher */}
            <div
               className="
                  flex gap-1
                  bg-[var(--bg-secondary)]
                  rounded-lg p-1
               "
            >
               {views.map((v) => (
                  <button
                     key={v}
                     onClick={() => setCurrentView(v)}
                     className={cn(
                        'px-3 py-1 text-sm rounded-md transition',
                        currentView === v
                           ? 'bg-[var(--bg)] shadow text-[var(--text)]'
                           : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                     )}
                  >
                     {v}
                  </button>
               ))}
            </div>

            <ThemeToggle />
         </div>
      </header>
   );
}
