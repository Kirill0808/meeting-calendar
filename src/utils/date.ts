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
   format,
} from 'date-fns';

import { uk } from 'date-fns/locale';

import type { CalendarView, TimeSlot, CalendarEvent } from '@/types';

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

/* =========================
   Week helpers
========================= */

export const getWeekDays = (date: Date): Date[] => {
   const { start, end } = getWeekRange(date);
   return getDaysInRange(start, end);
};

/* =========================
   Events
========================= */

export function formatDayHeader(date: Date): string {
   return format(date, 'EEE d');
}

export function getEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
   return events.filter((event) => isSameDay(event.start, day));
}

export function formatPeriodLabel(view: CalendarView, date: Date) {
   switch (view) {
      case 'day':
         return format(date, 'EEEE, d MMMM yyyy', { locale: uk });

      case 'week': {
         const start = startOfWeek(date, { weekStartsOn: 1 });
         const end = endOfWeek(date, { weekStartsOn: 1 });

         return `${format(start, 'd MMM')} – ${format(end, 'd MMM yyyy')}`;
      }

      case 'month':
         return format(date, 'MMMM yyyy', { locale: uk });

      default:
         return '';
   }
}

export function formatTime(date: Date): string {
   return format(date, 'HH:mm');
}

export function parseTime(baseDate: Date, time: string): Date {
   const [hours, minutes] = time.split(':').map(Number);

   const result = new Date(baseDate);
   result.setHours(hours, minutes, 0, 0);

   return result;
}

export function addHoursToTime(time: string, hours: number): string {
   const [h, m] = time.split(':').map(Number);

   const date = new Date();
   date.setHours(h, m, 0, 0);
   date.setHours(date.getHours() + hours);

   return format(date, 'HH:mm');
}

export function addMinutesToTime(time: string, minutes: number): string {
   const [h, m] = time.split(':').map(Number);

   const date = new Date();
   date.setHours(h, m, 0, 0);
   date.setMinutes(date.getMinutes() + minutes);

   return format(date, 'HH:mm');
}
