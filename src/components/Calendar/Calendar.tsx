import { useCalendarStore } from '@/store/calendar-store';
import WeekView from './WeekView';
import DayView from './DayView';
import MonthView from './MonthView';
import CalendarHeader from './CalendarHeader';
import WeekDaysHeader from './WeekDaysHeader';
import EventModal from '../../features/event-form/EventModal';
import CalendarLayout from './CalendarLayout';

export default function Calendar() {
   const currentView = useCalendarStore((s) => s.currentView);
   const isModalOpen = useCalendarStore((s) => s.isModalOpen);
   const closeModal = useCalendarStore((s) => s.closeModal);

   return (
      <CalendarLayout>
         <CalendarHeader />

         {currentView === 'week' && <WeekDaysHeader />}

         <div className="flex-1 flex overflow-y-auto">
            {currentView === 'week' && <WeekView />}
            {currentView === 'day' && <DayView />}
            {currentView === 'month' && <MonthView />}
         </div>

         <EventModal isOpen={isModalOpen} onClose={closeModal} />
      </CalendarLayout>
   );
}
