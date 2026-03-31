import Button from "../Button/Button";
import { HiOutlineChatBubbleLeftEllipsis } from "react-icons/hi2";

interface ActionButtonsProps {
  onPlaceBid?: () => void;
  onAskSeller?: () => void;
  isLoading?: boolean;
}

export function ActionButtons({ onPlaceBid, onAskSeller, isLoading }: ActionButtonsProps) {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        onClick={onPlaceBid}
        disabled={isLoading}
        className="flex-1 text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Placing…' : 'Place bid'}
      </Button>
      <Button
        onClick={onAskSeller}
        disabled={isLoading}
        icon={HiOutlineChatBubbleLeftEllipsis}
        iconClassName="size-5"
        variant={"secondary"}
        className="flex-1 text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Ask Seller
      </Button>
    </div>
  );
}
