import type { PaymentType } from '../../types';

interface PaymentIconProps {
  type: PaymentType;
}

const configs: Record<PaymentType, { bg: string; text: string; label: string }> = {
  mastercard: { bg: 'bg-orange-500', text: 'text-white', label: 'MC' },
  visa: { bg: 'bg-blue-600', text: 'text-white', label: 'VISA' },
  applepay: { bg: 'bg-black', text: 'text-white', label: '' },
  gpay: { bg: 'bg-white border border-gray-300', text: 'text-gray-700', label: 'G' },
  paypal: { bg: 'bg-blue-700', text: 'text-white', label: 'PP' },
  buysafe: { bg: 'bg-green-600', text: 'text-white', label: 'BS' },
};

export function PaymentIcon({ type }: PaymentIconProps) {
  const config = configs[type];

  return (
    <div
      className={`w-10 h-6 ${config.bg} rounded flex items-center justify-center`}
    >
      {type === 'applepay' ? (
        <span className="text-white text-[10px] font-medium">Pay</span>
      ) : (
        <span className={`text-[9px] font-bold ${config.text}`}>{config.label}</span>
      )}
    </div>
  );
}
