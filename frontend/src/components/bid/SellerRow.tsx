import { useSeller } from '../../hooks/useSeller';
import {BiChevronRight} from "react-icons/bi";

interface SellerRowProps {
  sellerId: string;
}

export function SellerRow({ sellerId }: SellerRowProps) {
  const { data: seller, isLoading } = useSeller(sellerId);

  if (!sellerId) return null;

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="relative">
        <img
          src={seller?.image || ''}
          alt={seller?.name || 'Seller'}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://img.freepik.com/premium-photo/beautiful-tree-yellow-flower-blossom-with-milky-way-star-night_1003721-860.jpg';
          }}
        />
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[7px] font-bold px-1.5 py-0.5 rounded">
          Seller
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-sm text-gray-700">
          Sold by <span className="font-medium">{seller?.name || 'Unknown'}</span>
        </span>
        <BiChevronRight className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
}
