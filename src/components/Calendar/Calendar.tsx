import { useCalendarStore } from '@/store/calendar-store';
import WeekView from './WeekView';
import DayView from './DayView';
import MonthView from './MonthView';
import WeekDaysHeader from './WeekDaysHeader';
import EventModal from '../../features/event-form/EventModal';
import CalendarLayout from './CalendarLayout';

export default function Calendar() {
   const currentView = useCalendarStore((s) => s.currentView);
   const isModalOpen = useCalendarStore((s) => s.isModalOpen);
   const closeModal = useCalendarStore((s) => s.closeModal);

   return (
      <CalendarLayout>
         {currentView === 'week' && <WeekDaysHeader />}

         {currentView === 'week' && <WeekView />}
         {currentView === 'day' && <DayView />}
         {currentView === 'month' && <MonthView />}

         <EventModal isOpen={isModalOpen} onClose={closeModal} />
      </CalendarLayout>
   );
}
