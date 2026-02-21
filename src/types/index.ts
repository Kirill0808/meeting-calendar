export type CalendarView = 'day' | 'week' | 'month';

export type TimeSlot = {
   start: Date;
   end: Date;
};

export type CalendarEvent = {
   id: string;
   title: string;
   description?: string;
   start: Date;
   end: Date;
   color: string;
};
