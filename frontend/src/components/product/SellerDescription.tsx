import { GlobeIcon } from '../ui/icons';

interface SellerDescriptionProps {
  description: string;
  startingPrice?: number;
}

export function SellerDescription({ 
  description, 
  startingPrice = 0 
}: SellerDescriptionProps) {
  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Description from the seller
      </h2>
      <p className="text-sm text-gray-700 mb-2">{description}</p>
      {startingPrice === 0 && (
        <p className="text-sm text-gray-500 italic mb-3">No starting price</p>
      )}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <GlobeIcon />
          Translated: Show original
        </button>
        <button
          type="button"
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          Show more
        </button>
      </div>
    </div>
  );
}
