import { TranslateIcon } from '../ui/icons';

interface ProductDescriptionProps {
  description: string;
  showTranslation?: boolean;
}

export function ProductDescription({ 
  description, 
  showTranslation = true 
}: ProductDescriptionProps) {
  return (
    <div className="border-b border-gray-200 pb-6">
      <p className="text-sm text-gray-700 leading-relaxed">
        {description}
      </p>
      {showTranslation && (
        <button
          type="button"
          className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          <TranslateIcon />
          AI-translated summary
        </button>
      )}
    </div>
  );
}
