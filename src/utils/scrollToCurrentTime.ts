import { START_HOUR, HOUR_HEIGHT } from '@/constants/calendar';

export function scrollToCurrentTime(container: HTMLDivElement | null) {
   if (!container) return;

   const now = new Date();

   const minutesFromStart = now.getHours() * 60 + now.getMinutes() - START_HOUR * 60;

   const scrollPosition = (minutesFromStart / 60) * HOUR_HEIGHT;

   container.scrollTop = scrollPosition;
}
