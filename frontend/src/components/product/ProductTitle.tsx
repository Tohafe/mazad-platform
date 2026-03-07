import { HeartIcon, ShareIcon } from '../ui/icons';

interface ProductTitleProps {
  title: string;
  favoriteCount?: number;
}

export function ProductTitle({ title, favoriteCount = 0 }: ProductTitleProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4">
      <h1 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
        {title}
      </h1>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <HeartIcon />
        </button>
        <span className="text-sm text-gray-500">{favoriteCount}</span>
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ShareIcon />
        </button>
      </div>
    </div>
  );
}
