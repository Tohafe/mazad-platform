
interface ShippingInfoProps {
  info: string;
}

export function ShippingInfo({ 
  info, 
}: ShippingInfoProps) {
  return (
    <div className="border-t border-border pt-6">
      <h2 className="text-base font-semibold uppercase tracking-widest text-secondary mb-3">
        Shipping
      </h2>
      <p className="text-sm font-medium text-black mb-1">
        {info ? info : 'Not available'}
      </p>
    </div>
  );
}
