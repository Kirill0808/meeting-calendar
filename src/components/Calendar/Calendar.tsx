import { useCalendarStore } from '@/store/calendar-store';
import WeekView from './WeekView';
import DayView from './DayView';
import MonthView from './MonthView';
import CalendarHeader from './CalendarHeader';
import WeekDaysHeader from './WeekDaysHeader';
import EventModal from '../Modal/EventModal';

export default function Calendar() {
   const currentView = useCalendarStore((s) => s.currentView);
   const isModalOpen = useCalendarStore((s) => s.isModalOpen);
   const closeModal = useCalendarStore((s) => s.closeModal);

   return (
      <div className="flex flex-col h-full">
         <CalendarHeader />

         {currentView === 'week' && <WeekDaysHeader />}

         <div className="flex-1">
            {currentView === 'week' && <WeekView />}
            {currentView === 'day' && <DayView />}
            {currentView === 'month' && <MonthView />}
         </div>

         <EventModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
   );
}
