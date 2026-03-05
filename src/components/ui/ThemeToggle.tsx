import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
   const [dark, setDark] = useState(false);

   useEffect(() => {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') {
         document.documentElement.classList.add('dark');
         setDark(true);
      }
   }, []);

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
         className="p-2 rounded-lg border border-gray-300 dark:border-gray-600
         bg-white dark:bg-gray-800
         text-gray-700 dark:text-gray-200
         hover:bg-gray-100 dark:hover:bg-gray-700
         transition"
      >
         {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
   );
}
