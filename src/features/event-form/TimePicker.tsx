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
      <div className="flex gap-3 mb-4">
         <input
            type="time"
            value={startTime}
            onChange={(e) => onStartChange(e.target.value)}
            className="
               px-3 py-2 rounded-lg
               border border-gray-200 dark:border-gray-700
               bg-white dark:bg-gray-800
               text-gray-900 dark:text-gray-100
               focus:outline-none focus:ring-2 focus:ring-blue-500
               transition-colors
            "
         />

         <input
            type="time"
            value={endTime}
            onChange={(e) => onEndChange(e.target.value)}
            className="
               px-3 py-2 rounded-lg
               border border-gray-200 dark:border-gray-700
               bg-white dark:bg-gray-800
               text-gray-900 dark:text-gray-100
               focus:outline-none focus:ring-2 focus:ring-blue-500
               transition-colors
            "
         />
      </div>
   );
}
