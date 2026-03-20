interface Props {
   children: React.ReactNode;
}

export default function CalendarLayout({ children }: Props) {
   return (
      <div
         className="
            flex flex-col h-full
            bg-[var(--bg)]
            text-[var(--text)]
            transition-colors duration-300
         "
      >
         {children}
      </div>
   );
}
