import { useSeller } from '../../hooks/useSeller';
import { BiChevronRight, BiChevronDown } from "react-icons/bi";
import { Link } from "react-router-dom";

interface SellerRowProps {
  sellerId: string;
  variant?: 'default' | 'detailed';
}

export function SellerRow({ sellerId, variant = 'default' }: SellerRowProps) {
  const { data: seller, isLoading } = useSeller(sellerId);

  if (!sellerId) return null;

  const isDetailed = variant === 'detailed';
  
  const containerClasses = isDetailed 
    ? "flex items-center gap-3 py-3 border-t border-gray-100" 
    : "flex items-center gap-3 py-3";

  const imageSize = isDetailed ? "w-12 h-12" : "w-10 h-10";
  
  const badgeClasses = isDetailed
    ? "absolute -bottom-1 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full"
    : "absolute -bottom-1 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[7px] font-bold px-1.5 py-0.5 rounded";

  if (isLoading) {
    return (
      <div className={containerClasses}>
        <div className={`${imageSize} rounded-full bg-gray-200 animate-pulse`} />
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="relative">
        <img
          src={seller?.image || ''}
          alt={seller?.name || 'Seller'}
          className={`${imageSize} rounded-full object-cover`}
        />
        <span className={badgeClasses}>Seller</span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-sm text-gray-700">
          Sold by <Link to={`/profile/${seller?.name}`}><span className="font-medium">{seller?.name || 'Unknown'}</span></Link>
        </span>
        
        {isDetailed ? (
          <BiChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
        ) : (
          <BiChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </div>
    </div>
  );
}
