
interface SellerDescriptionProps {
  description: string;
  startingPrice?: number;
}

export function SellerDescription({ 
  description, 
  startingPrice = 0 
}: SellerDescriptionProps) {
  return (
    <div className="pb-2">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
        Description from the seller
      </h2>
      <p className="text-sm text-black mb-2">{description}</p>
      {startingPrice === 0 && (
        <p className="text-sm text-secondary italic mb-3">No starting price</p>
      )}
      <div className="flex items-center gap-4">
      </div>
    </div>
  );
}
