import type { CalendarEvent } from '@/types';
import { formatTime } from '@/utils/date';
import clsx from 'clsx';

interface EventCardProps {
   event: CalendarEvent;
   top: number;
   height: number;
   column: number;
   totalColumns: number;
   onClick?: (event: CalendarEvent) => void;
}

export default function EventCard({
   event,
   top,
   height,
   column,
   totalColumns,
   onClick,
}: EventCardProps) {
   return (
      <div
         onClick={(e) => {
            e.stopPropagation();
            onClick?.(event);
         }}
         style={{
            top,
            height,
            backgroundColor: event.color || '#2563eb',
            width: `calc(${100 / totalColumns}% - 4px)`,
            left: `calc(${(column * 100) / totalColumns}% + 2px)`,
         }}
         className={clsx(
            'absolute rounded-lg px-2 py-1 text-xs text-white',
            'cursor-pointer overflow-hidden',
            'shadow-sm hover:shadow-md transition-all',
            'hover:brightness-110',
            'pointer-events-auto'
         )}
      >
         <div className="font-medium truncate">{event.title}</div>
         <div className="opacity-90 text-[10px]">
            {formatTime(event.start)} – {formatTime(event.end)}
         </div>
      </div>
   );
}
