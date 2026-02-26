interface TimePickerProps {
   startTime: string;
   endTime: string;
   onStartChange: (value: string) => void;
   onEndChange: (value: string) => void;
}

export default function TimePicker({
   startTime,
   endTime,
   onStartChange,
   onEndChange,
}: TimePickerProps) {
   return (
      <div className="flex gap-2 mb-4">
         <input
            type="time"
            value={startTime}
            onChange={(e) => onStartChange(e.target.value)}
            className="border px-2 py-1 rounded-lg"
         />
         <input
            type="time"
            value={endTime}
            onChange={(e) => onEndChange(e.target.value)}
            className="border px-2 py-1 rounded-lg"
         />
      </div>
   );
}
