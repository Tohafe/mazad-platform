import type { PaymentType } from '../../types';
import { PaymentIcon } from '../ui';

interface PaymentOptionsProps {
  types?: PaymentType[];
}

const defaultPaymentTypes: PaymentType[] = [
  'mastercard', 
  'visa', 
  'applepay', 
  'gpay', 
  'paypal', 
  'buysafe'
];

export function PaymentOptions({ types = defaultPaymentTypes }: PaymentOptionsProps) {
  return (
    <div className="py-4 border-t border-gray-100">
      <p className="text-xs text-gray-500 mb-2">Payment options</p>
      <div className="flex gap-1.5">
        {types.map((type) => (
          <PaymentIcon key={type} type={type} />
        ))}
      </div>
    </div>
  );
}
