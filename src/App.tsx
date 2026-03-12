import Calendar from '@/components/Calendar/Calendar';

export default function App() {
   return (
      <div
         className="
         h-screen
         flex flex-col
         bg-white dark:bg-gray-950
         transition-colors duration-300
      "
      >
         <Calendar />
      </div>
   );
}
