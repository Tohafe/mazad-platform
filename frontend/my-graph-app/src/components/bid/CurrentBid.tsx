interface CurrentBidProps {
  amount: string;
  hasReservePrice?: boolean;
}

export function CurrentBid({ amount, hasReservePrice = false }: CurrentBidProps) {
  return (
    <div className="mb-1">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Current Bid</p>
      <p className="text-4xl font-bold text-gray-900">{amount}</p>
      {!hasReservePrice && (
        <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full mt-2">
          No reserve price
        </span>
      )}
    </div>
  );
}
