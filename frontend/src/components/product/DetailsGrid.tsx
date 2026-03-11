import type { ProductDetail } from '../../types';

interface DetailsGridProps {
  details: ProductDetail[];
  title?: string;
}

export function DetailsGrid({ details, title = 'Details' }: DetailsGridProps) {
  if (!details?.length) return null;

  return (
    <div className="border-t  border-border pt-6">
      <h2 className="text-base font-semibold uppercase tracking-widest text-secondary mb-4">
        {title}
      </h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {details.map((detail, index) => (
          <div key={index}>
            <dt className="text-xs uppercase tracking-wide text-secondary">
              {detail.label}
            </dt>
            <dd className="text-sm text-black font-medium mt-0.5">
              {detail.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
