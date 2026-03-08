import {BiPackage, BiShield} from "react-icons/bi";

interface InfoRowsProps {
  buyerProtectionFee: string;
  shippingLocation: string;
  shippingAvailable?: boolean;
}

export function InfoRows({ 
  buyerProtectionFee, 
  shippingLocation, 
  shippingAvailable = false 
}: InfoRowsProps) {
  return (
    <div className="space-y-3 py-4 border-t border-gray-100">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <BiShield className="w-4 h-4 text-green-600" />
        <span>Buyer Protection fee: {buyerProtectionFee}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <BiPackage className="w-4 h-4 text-gray-400" />
        <span>
          {shippingAvailable 
            ? `Shipping available to ${shippingLocation}` 
            : `Shipping unavailable to ${shippingLocation}`
          }
        </span>
      </div>
    </div>
  );
}
