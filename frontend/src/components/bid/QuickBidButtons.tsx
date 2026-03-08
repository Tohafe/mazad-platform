interface QuickBidButtonsProps {
  amounts: string[];
  onBidClick?: (amount: string) => void;
}

export function QuickBidButtons({ amounts, onBidClick }: QuickBidButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 my-3">
      {amounts.map((amount, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onBidClick?.(amount)}
          className="flex-1 min-w-20 py-2 px-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:border-gray-400 transition-colors cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {amount}
        </button>
      ))}
    </div>
  );
}
