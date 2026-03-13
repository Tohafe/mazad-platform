import Button from "../Button/Button";

interface ActionButtonsProps {
  onPlaceBid?: () => void;
  onSetMaxBid?: () => void;
  isLoading?: boolean;
}

export function ActionButtons({ onPlaceBid, onSetMaxBid, isLoading }: ActionButtonsProps) {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        onClick={onPlaceBid}
        disabled={isLoading}
        variant="secondary"
        className="flex-1 text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Placing…' : 'Place bid'}
      </Button>
      <Button
        onClick={onSetMaxBid}
        disabled={isLoading}
        className="flex-1 text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Set max bid
      </Button>
    </div>
  );
}
