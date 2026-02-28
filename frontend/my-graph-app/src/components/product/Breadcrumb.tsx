import type { BreadcrumbItem } from '../../types';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="text-xs text-gray-400 uppercase tracking-wide overflow-x-auto whitespace-nowrap pb-2 -mb-2">
      {items.map((item, index) => (
        <span key={index}>
          <span className="hover:text-gray-700 cursor-pointer transition-colors">
            {item.label}
          </span>
          {index < items.length - 1 && (
            <span className="mx-2 text-gray-300">›</span>
          )}
        </span>
      ))}
    </nav>
  );
}
