interface ShippingInfoProps {
  info: string;
  location?: string;
  available?: boolean;
}

export function ShippingInfo({ 
  info, 
  location = 'Morocco',
  available = false 
}: ShippingInfoProps) {
  return (
    <div className="border-t border-gray-200 pt-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Shipping
      </h2>
      <p className="text-sm font-medium text-gray-900 mb-1">
        {available ? 'Available' : 'Not available'}
      </p>
      <p className="text-sm text-gray-600 mb-3">Location: {location}</p>
      <p className="text-sm text-gray-500 leading-relaxed">{info}</p>
      <button
        type="button"
        className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium"
      >
        Show more
      </button>
    </div>
  );
}
