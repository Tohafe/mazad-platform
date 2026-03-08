import {BiShield} from "react-icons/bi";

interface BuyerProtectionProps {
  title?: string;
  description?: string;
  linkText?: string;
  linkHref?: string;
}

export function BuyerProtection({
  title = 'Catawiki Buyer Protection',
  description = 'Your payment is safe with us until you receive your object.',
  linkText = 'View details',
  linkHref = '#',
}: BuyerProtectionProps) {
  return (
    <div className="flex items-start gap-3 py-4 border-t border-gray-100">
      <div className="p-1.5 bg-red-100 rounded-full">
        <BiShield className="w-4 h-4 text-red-500" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {description}{' '}
          <a href={linkHref} className="text-blue-600 hover:underline">
            {linkText}
          </a>
        </p>
      </div>
    </div>
  );
}
