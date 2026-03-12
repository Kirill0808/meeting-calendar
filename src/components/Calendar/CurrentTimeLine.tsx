import { useEffect, useState } from 'react';
import { START_HOUR, HOUR_HEIGHT } from '@/constants/calendar';

export default function CurrentTimeLine() {
   const [top, setTop] = useState<number | null>(null);

   const updatePosition = () => {
      const now = new Date();

      const minutesFromStart = now.getHours() * 60 + now.getMinutes() - START_HOUR * 60;

      if (minutesFromStart < 0) {
         setTop(null);
         return;
      }

      const position = (minutesFromStart / 60) * HOUR_HEIGHT;

      setTop(position);
   };

   useEffect(() => {
      updatePosition();

      const interval = setInterval(updatePosition, 60000);

      return () => clearInterval(interval);
   }, []);

   if (top === null) return null;

   return (
      <div className="absolute left-0 right-0 z-30 pointer-events-none" style={{ top }}>
         <div className="relative flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full -ml-1" />
            <div className="flex-1 border-t-2 border-red-500" />
         </div>
      </div>
   );
}
