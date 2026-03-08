import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useBidApi } from "./useBidApi";
import { parseBidValue } from "../components";

export function usePlaceBid(auctionId: number, minRequired: number) {
    const bidApi = useBidApi();

    const [bidValue, setBidValue] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { mutate: placeBid, isPending } = useMutation({
        mutationFn: (amount: number) =>
            bidApi.placeBid({ auctionId, amount }),
        onSuccess: () => {
            setError(null);
            setSuccess("Bid placed successfully!");
            setBidValue("");
            setTimeout(() => setSuccess(null), 3000);
        },
        onError: (err: any) => {
            setSuccess(null);

            const msg =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                err?.message ||
                "Failed to place bid";

            setError(msg);
        },
    });

    const submitBid = useCallback(() => {
        setError(null);
        setSuccess(null);

        const amount = parseBidValue(bidValue);

        if (amount < minRequired) {
            setError(`Minimum bid is ${minRequired}`);
            return;
        }

        placeBid(amount);
    }, [bidValue, minRequired, placeBid]);

    const quickBid = useCallback(
        (amountStr: string) => {
            setError(null);
            setSuccess(null);

            const amount = parseBidValue(amountStr);
            setBidValue(String(amount));
            },
        [placeBid]
    );

    return {
        bidValue,
        setBidValue,
        error,
        success,
        isPending,
        submitBid,
        quickBid,
    };
}