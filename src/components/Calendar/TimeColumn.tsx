interface TimeColumnProps {
   hours: number[];
}

export default function TimeColumn({ hours }: TimeColumnProps) {
   return (
      <div className="w-14 shrink-0 border-r border-gray-200 bg-gray-50">
         {hours.map((hour) => (
            <div key={hour} className="h-16 pr-3 text-right text-xs text-gray-500 leading-[4rem]">
               {hour}:00
            </div>
         ))}
      </div>
   );
}
