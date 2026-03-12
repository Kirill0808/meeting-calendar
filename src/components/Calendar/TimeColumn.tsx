import { HOUR_HEIGHT } from '@/constants/calendar';

interface TimeColumnProps {
   hours: number[];
}

export default function TimeColumn({ hours }: TimeColumnProps) {
   return (
      <div className="w-14 shrink-0 border-r border-gray-200 dark:border-gray-700">
         {hours.map((hour) => (
            <div
               key={hour}
               style={{ height: HOUR_HEIGHT }}
               className="
                           flex items-center justify-end pr-2
                           text-xs text-gray-500 dark:text-gray-400
                        "
            >
               {hour}:00
            </div>
         ))}
      </div>
   );
}
