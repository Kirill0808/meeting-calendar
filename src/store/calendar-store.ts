import type { CalendarView, CalendarEvent } from '@/types';

export type CalendarState = {
   view: CalendarView;
   currentDate: Date;
   events: CalendarEvent[];

   setView: (view: CalendarView) => void;
};
