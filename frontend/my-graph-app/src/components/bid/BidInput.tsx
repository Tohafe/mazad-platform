import { useState } from 'react';

interface BidInputProps {
  minBid: string;
  currentBidNumeric: number;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

function parseBidValue(raw: string): number {
  // Strip everything except digits → parse as integer
  const cleaned = raw.replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
}

export function BidInput({ minBid, currentBidNumeric, value, onChange, error }: BidInputProps) {
  const [touched, setTouched] = useState(false);

  const minRequired = currentBidNumeric + 1;
  const numericValue = parseBidValue(value);
  const showValidation = touched && value.length > 0;
  const isValid = numericValue >= minRequired;
  const isWholeNumber = /^\d+$/.test(value);
  const validationError = showValidation
    ? !isWholeNumber
      ? 'Please enter a whole number (no decimals)'
      : !isValid
        ? `Minimum bid is ${minRequired}`
        : null
    : null;

  const displayError = error || validationError;

  return (
    <div className="mb-3">
      <div className={`bg-gray-100 px-4 py-2.5 flex items-center gap-2 border ${
        displayError ? 'border-red-400' : isValid && showValidation ? 'border-green-400' : 'border-transparent'
      } transition-colors`}>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            // Only allow digits
            const filtered = e.target.value.replace(/[^0-9]/g, '');
            onChange(filtered);
            if (!touched) setTouched(true);
          }}
          onBlur={() => setTouched(true)}
          placeholder={minBid}
          className="w-full bg-transparent text-sm text-gray-700 outline-none"
        />
      </div>
      {displayError && (
        <p className="text-xs text-red-500 mt-1 px-1">{displayError}</p>
      )}
    </div>
  );
}

export { parseBidValue };
