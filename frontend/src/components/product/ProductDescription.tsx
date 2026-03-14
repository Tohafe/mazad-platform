
interface ProductDescriptionProps {
  description: string;
  showTranslation?: boolean;
}

export function ProductDescription({ 
  // description,
  showTranslation = true
}: ProductDescriptionProps) {
  return (
    <div className="pb-6">
      {showTranslation && (
        <button
          type="button"
          className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
        </button>
      )}
    </div>
  );
}
