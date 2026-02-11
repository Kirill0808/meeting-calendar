import type { CalendarEvent } from '@/types';

const DAY_START_HOUR = 8;
const SLOT_HEIGHT = 64;

export function getEventPosition(event: CalendarEvent) {
   const startMinutes = event.start.getHours() * 60 + event.start.getMinutes();

   const endMinutes = event.end.getHours() * 60 + event.end.getMinutes();

   const top = ((startMinutes - DAY_START_HOUR * 60) / 60) * SLOT_HEIGHT;

   const height = ((endMinutes - startMinutes) / 60) * SLOT_HEIGHT;

   return { top, height };
}

/** пересечение */
function isOverlapping(a: CalendarEvent, b: CalendarEvent) {
   return a.start < b.end && b.start < a.end;
}

/** группировка пересечений */
function groupOverlappingEvents(events: CalendarEvent[]) {
   const groups: CalendarEvent[][] = [];

   events.forEach((event) => {
      let placed = false;

      for (const group of groups) {
         if (group.some((e) => isOverlapping(e, event))) {
            group.push(event);
            placed = true;
            break;
         }
      }

      if (!placed) {
         groups.push([event]);
      }
   });

   return groups;
}

/** финальный layout */
export function calculateEventLayout(events: CalendarEvent[]) {
   const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());

   const groups = groupOverlappingEvents(sorted);

   return groups.flatMap((group) => {
      const columns: CalendarEvent[][] = [];
      const result: {
         event: CalendarEvent;
         column: number;
         totalColumns: number;
      }[] = [];

      for (const event of group) {
         let placed = false;

         for (let i = 0; i < columns.length; i++) {
            const last = columns[i][columns[i].length - 1];
            if (last.end <= event.start) {
               columns[i].push(event);
               result.push({ event, column: i, totalColumns: 0 });
               placed = true;
               break;
            }
         }

         if (!placed) {
            columns.push([event]);
            result.push({
               event,
               column: columns.length - 1,
               totalColumns: 0,
            });
         }
      }

      const totalColumns = columns.length;
      return result.map((r) => ({
         ...r,
         totalColumns,
      }));
   });
}
