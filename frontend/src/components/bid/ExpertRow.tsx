import { ChevronRight } from 'lucide-react';
import type { Curator } from '../../types';

interface ExpertRowProps {
  curator: Curator;
}

export function ExpertRow({ curator }: ExpertRowProps) {
  if (!curator) return null;

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="relative">
        <img
          src={curator.image}
          alt={curator.name}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/40x40/e5e7eb/9ca3af?text=?'; }}
        />
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[7px] font-bold px-1.5 py-0.5 rounded">
          Expert
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-sm text-gray-700">
          Selected by <span className="font-medium">{curator.name}</span>
        </span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
}
