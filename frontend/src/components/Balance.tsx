import {BiWallet} from "react-icons/bi";
import {useWallet} from "../hooks/useWallet.ts";
import {formatPrice} from "../utils/currency.ts";
import {useBalanceUpdate} from "../hooks/useAuctionsUpdates.ts";
import {useMemo} from "react";

export default function Balance() {
    useBalanceUpdate()
    const {data: wallet, isLoading} = useWallet()
    const formattedBalance = useMemo(() =>
        formatPrice(wallet?.availableBalance || 0, "compact")
    , [wallet])

    return (
        <div className="flex items-center bg-white ">

            <div className="flex items-center gap-2 py-1.5">
                <BiWallet size={24} className="shrink-0 text-brand"/>
                {isLoading ? <span>Loading...</span> :
                    <span className="w-full block  truncate  font-bold font-nunito text-sm max-w-20 line-clamp-1">
                        {formattedBalance}
                    </span>
                }
            </div>
        </div>
    );
}
