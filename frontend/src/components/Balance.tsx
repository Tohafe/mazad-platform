import {BiWallet} from "react-icons/bi";
import {useWallet} from "../hooks/useWallet.ts";
import {formatPrice} from "../utils/currency.ts";
import {useMemo, useState} from "react";
import {useBalanceUpdate} from "../hooks/useAuctionsUpdates.ts";
import {cn} from "../lib/utils.ts";


export default function Balance({className = ""}: {className?: string}) {
    useBalanceUpdate()
    const {data: wallet, isLoading} = useWallet()
    const [showTooltip, setShowTooltip] = useState(false);
    const formattedBalance = useMemo(() =>
        formatPrice(wallet?.availableBalance || 0, "compact")
    , [wallet])

    const fullBalance = useMemo(() =>
            formatPrice(wallet?.availableBalance || 0)
        , [wallet]);

    return (
        <div className={cn("flex items-center bg-white relative group cursor-pointer", className)}
             onClick={() => setShowTooltip(!showTooltip)}
             onMouseEnter={() => setShowTooltip(true)}
             onMouseLeave={() => setShowTooltip(false)}
        >

            <div className="flex items-center gap-2 py-1.5">
                <BiWallet size={24} className="shrink-0 text-brand"/>
                {isLoading ? <span>Loading...</span> :
                    <span className=" hidden w-full sm:block truncate  font-bold font-nunito text-sm max-w-20 line-clamp-1">
                        {formattedBalance}
                    </span>
                }
            </div>

            {/* Tooltip visible only on group hover */}
            {!isLoading && showTooltip && (
                <div className="absolute top-full left-0 mt-1 bg-gray-800 text-white rounded px-2 py-1 z-50 text-xs whitespace-nowrap shadow-lg">
                    {fullBalance}
                </div>
            )}
        </div>
    );
}
