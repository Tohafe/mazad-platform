
interface SellerDescriptionProps {
  description: string;
  startingPrice?: number;
}

export function SellerDescription({ 
  description,
}: SellerDescriptionProps) {
  return (
    <div className="border-t  border-border pt-6">
      <h2 className="text-base font-semibold uppercase tracking-widest text-secondary mb-3">
        Description from the seller
      </h2>
      <p className="text-base text-black mb-2">{description}</p>
      <div className="flex items-center gap-4">
      </div>
    </div>
  );
}
