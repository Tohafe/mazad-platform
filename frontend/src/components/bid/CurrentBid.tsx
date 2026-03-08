interface CurrentBidProps {
  amount: string;
  startingPrice?: number;
}

export function CurrentBid({ amount, startingPrice = 0 }: CurrentBidProps) {
  return (
    <div className="mb-1">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Current Bid</p>
      <p className="text-4xl font-bold text-gray-900">{amount}</p>
      {startingPrice === 0 ? (
        <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full mt-2">
          No starting price
        </span>
      ) : (
        <span className="inline-block bg-[#edf4e6] text-[#11a88a] px-3 py-1 text-xs font-semibold  mt-2">
          Starting price: ${startingPrice.toLocaleString()}
        </span>
      )}
    </div>
  );
}
