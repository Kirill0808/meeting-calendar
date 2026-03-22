import type { ReactNode } from 'react';
import CalendarHeader from './CalendarHeader';

interface Props {
   children: ReactNode;
}

export default function CalendarLayout({ children }: Props) {
   return (
      <div
         className="
            flex flex-col flex-1 min-h-0
            bg-[var(--bg)]
            text-[var(--text)]
            transition-colors duration-300
         "
      >
         <CalendarHeader />

         <div className="flex-1 min-h-0 overflow-hidden flex flex-col">{children}</div>
      </div>
   );
}
