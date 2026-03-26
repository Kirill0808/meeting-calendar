import { HOUR_HEIGHT } from '@/constants/calendar';

interface TimeColumnProps {
   hours: number[];
}

export default function TimeColumn({ hours }: TimeColumnProps) {
   return (
      <div className="w-14 shrink-0 border-r" style={{ borderColor: 'var(--border)' }}>
         {hours.map((hour) => (
            <div
               key={hour}
               style={{
                  height: HOUR_HEIGHT,
                  color: 'var(--text-secondary)',
               }}
               className="flex items-center justify-end pr-2 text-xs"
            >
               {hour}:00
            </div>
         ))}
      </div>
   );
}
