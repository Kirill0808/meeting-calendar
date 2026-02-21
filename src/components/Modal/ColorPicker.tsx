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
               className={`w-8 h-8 rounded-full border-2 transition
            ${selected === c ? 'border-black scale-110' : 'border-transparent'}
          `}
               style={{ backgroundColor: c }}
            />
         ))}
      </div>
   );
}
