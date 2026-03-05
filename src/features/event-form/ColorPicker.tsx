interface ColorPickerProps {
   colors: string[];
   selected: string;
   onChange: (color: string) => void;
}

export default function ColorPicker({ colors, selected, onChange }: ColorPickerProps) {
   return (
      <div className="flex gap-3">
         {colors.map((c) => (
            <button
               key={c}
               onClick={() => onChange(c)}
               className={`
                  w-9 h-9 rounded-full
                  border-2
                  transition-transform duration-150
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                     selected === c
                        ? 'border-black dark:border-white scale-110'
                        : 'border-transparent hover:scale-105'
                  }
               `}
               style={{ backgroundColor: c }}
            />
         ))}
      </div>
   );
}
