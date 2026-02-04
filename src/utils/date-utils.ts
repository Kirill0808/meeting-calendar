import {
   startOfDay,
   endOfDay,
   startOfWeek,
   endOfWeek,
   startOfMonth,
   endOfMonth,
   addDays,
   addMinutes,
   isSameDay,
} from 'date-fns';

import type { CalendarView, TimeSlot } from '@/types';

/* =========================
   Base helpers
========================= */

export const getDayRange = (date: Date) => ({
   start: startOfDay(date),
   end: endOfDay(date),
});

export const getWeekRange = (date: Date) => ({
   start: startOfWeek(date, { weekStartsOn: 1 }),
   end: endOfWeek(date, { weekStartsOn: 1 }),
});

export const getMonthRange = (date: Date) => ({
   start: startOfMonth(date),
   end: endOfMonth(date),
});

/* =========================
   View helpers
========================= */

export const getViewRange = (view: CalendarView, date: Date) => {
   switch (view) {
      case 'day':
         return getDayRange(date);
      case 'week':
         return getWeekRange(date);
      case 'month':
         return getMonthRange(date);
      default:
         return getWeekRange(date);
   }
};

/* =========================
   Days generation
========================= */

export const getDaysInRange = (start: Date, end: Date): Date[] => {
   const days: Date[] = [];
   let current = start;

   while (current <= end) {
      days.push(current);
      current = addDays(current, 1);
   }

   return days;
};

/* =========================
   Time slots
========================= */

export const generateTimeSlots = (
   date: Date,
   startHour = 8,
   endHour = 18,
   stepMinutes = 30
): TimeSlot[] => {
   const slots: TimeSlot[] = [];

   let current = addMinutes(startOfDay(date), startHour * 60);
   const end = addMinutes(startOfDay(date), endHour * 60);

   while (current < end) {
      const slotEnd = addMinutes(current, stepMinutes);

      slots.push({
         start: current,
         end: slotEnd,
      });

      current = slotEnd;
   }

   return slots;
};

/* =========================
   Comparisons
========================= */

export const isToday = (date: Date) => {
   return isSameDay(date, new Date());
};
