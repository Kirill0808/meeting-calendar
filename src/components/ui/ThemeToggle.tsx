import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
   const [dark, setDark] = useState(() => {
      const saved = localStorage.getItem('theme');
      return saved === 'dark';
   });

   useEffect(() => {
      if (dark) {
         document.documentElement.classList.add('dark');
      } else {
         document.documentElement.classList.remove('dark');
      }
   }, [dark]);

   const toggleTheme = () => {
      const html = document.documentElement;

      if (dark) {
         html.classList.remove('dark');
         localStorage.setItem('theme', 'light');
      } else {
         html.classList.add('dark');
         localStorage.setItem('theme', 'dark');
      }

      setDark(!dark);
   };

   return (
      <button
         onClick={toggleTheme}
         className="
            p-2 rounded-lg
            border border-[var(--border)]
            bg-[var(--bg-secondary)]
            text-[var(--text)]
            hover:bg-[var(--bg-hover)]
            transition
         "
      >
         {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
   );
}
