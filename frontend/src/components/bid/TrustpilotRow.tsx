import {BiStar} from "react-icons/bi";

interface TrustpilotRowProps {
  rating: string;
  reviewCount: string;
}

export function TrustpilotRow({ rating, reviewCount }: TrustpilotRowProps) {
  return (
    <div className="flex items-start gap-3 py-4 border-t border-gray-100">
      <BiStar className="w-4 h-4 text-green-500 fill-green-500 mt-0.5" />
      <div>
        <p className="text-sm text-gray-900">
          <span className="font-semibold">Trustpilot {rating}</span>
          <span className="text-gray-500"> | {reviewCount} reviews</span>
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          Rated Excellent on{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Trustpilot
          </a>
        </p>
      </div>
    </div>
  );
}
