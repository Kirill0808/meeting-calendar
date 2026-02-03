import type { CalendarEvent } from '@/types';
import { setHours, setMinutes } from 'date-fns';
import type { EventFormData } from './types';

export function formDataToEvent(data: EventFormData): Omit<CalendarEvent, 'id'> {
   const [startHour, startMin] = data.startTime.split(':').map(Number);
   const [endHour, endMin] = data.endTime.split(':').map(Number);

   return {
      title: data.title,
      description: data.description,
      start: setMinutes(setHours(data.date, startHour), startMin),
      end: setMinutes(setHours(data.date, endHour), endMin),
      color: data.color,
   };
}
