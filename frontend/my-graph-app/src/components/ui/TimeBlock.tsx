interface TimeBlockProps {
  value: number;
  label: string;
}

export function TimeBlock({ value, label }: TimeBlockProps) {
  return (
    <div className="text-center px-2">
      <p className="text-2xl font-bold text-gray-900">
        {value.toString().padStart(2, '0')}
      </p>
      <p className="text-[9px] uppercase text-gray-400 tracking-wide">{label}</p>
    </div>
  );
}
