import {RiAuctionFill} from "react-icons/ri";

interface WatchingBarProps {
  count: number;
}

export function WatchingBar({ count }: WatchingBarProps) {
  return (
    <div className="bg-rose-50 px-3 py-2.5 flex items-center gap-2 mb-4">
      <RiAuctionFill className="w-4 h-4 text-rose-500" />
      <span className="text-sm text-gray-700">
        <span className="font-medium">{count}</span> Total bids
      </span>
    </div>
  );
}
