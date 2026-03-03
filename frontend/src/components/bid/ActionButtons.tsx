interface ActionButtonsProps {
  onPlaceBid?: () => void;
  onSetMaxBid?: () => void;
  isLoading?: boolean;
}

export function ActionButtons({ onPlaceBid, onSetMaxBid, isLoading }: ActionButtonsProps) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        type="button"
        onClick={onPlaceBid}
        disabled={isLoading}
        className="flex-1 py-3 px-4 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Placing…' : 'Place bid'}
      </button>
      <button
        type="button"
        onClick={onSetMaxBid}
        disabled={isLoading}
        className="flex-1 py-3 px-4 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Set max bid
      </button>
    </div>
  );
}
