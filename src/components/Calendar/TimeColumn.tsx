interface TimeColumnProps {
   hours: number[];
}

export default function TimeColumn({ hours }: TimeColumnProps) {
   return (
      <div className="w-14 shrink-0 border-r border-white/10">
         {hours.map((hour) => (
            <div key={hour} className="h-16 pr-2 text-right text-xs text-white/60 leading-[4rem]">
               {hour}:00
            </div>
         ))}
      </div>
   );
}
