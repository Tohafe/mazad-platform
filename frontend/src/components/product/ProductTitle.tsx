
interface ProductTitleProps {
  title: string;
}

export function ProductTitle({ title }: ProductTitleProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4">
      <h1 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
        {title}
      </h1>
    </div>
  );
}
