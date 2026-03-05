import Tab from "../components/Card/Tab.tsx";
import Divider from "../components/Divider.tsx";
import {type HTMLAttributes, type ReactNode, useEffect, useMemo, useState} from "react";
import {useCancelAuction, useMyAuctions} from "../hooks/useAuctions.ts";
import Pagination from "../components/Pagination.tsx";
import Button from "../components/Button/Button.tsx";
import {cn} from "../lib/utils.ts";
import type {AuctionStatus, AuctionSummary} from "../types/item.ts";
import IconButton from "../components/Button/IconButton.tsx";
import {MdCancel} from "react-icons/md";
import {formatTimeLeft} from "../lib/timeFormater.ts";
import ConfirmDialog from "../components/Dialog/ConfirmDialog.tsx";

interface TabInfo {
    title: string;
    status?: AuctionStatus;
}

const tabs: TabInfo[] = [
    {title: "Overview"},
    {title: "Selling", status: "ACTIVE"},
    {title: "Sold", status: "SOLD"},
    {title: "Expired", status: "EXPIRED"},
    {title: "Cancelled", status: "CANCELLED"},
]

const Empty = ({children}: { children: ReactNode }) => {
    return <div className="flex justify-center text-primary font-semibold text-lg font-mono items-center w-full h-100">{children}</div>
}

const EmptyState = ({tab}: { tab: TabInfo }) => {
    if (!tab.status) return <Empty>You haven’t created any auctions yet.</Empty>;
    if (tab.status === "ACTIVE") return <Empty>You don’t have any active auctions right now.</Empty>;
    if (tab.status === "SOLD") return <Empty>No sold auctions yet. Your sales will appear here.</Empty>;
    if (tab.status === "EXPIRED") return <Empty>No expired auctions. Ended listings will show up here.</Empty>;
    if (tab.status === "CANCELLED") return <Empty>No cancelled auctions. Cancelled listings will appear here.</Empty>;
    return <Empty>Nothing to show here yet.</Empty>;
};

const Dashboard = () => {
    const [selectedTab, setSelectedTab] = useState<TabInfo>(tabs[0]);
    const [page, setPage] = useState(0);
    const {data, isLoading, isError} = useMyAuctions({page: page, size: 8, status: selectedTab.status});

    useEffect(() => {
        window.scrollTo({top: 0, behavior: "smooth"});
    }, [page]);

    const auctions = data?.content ?? [];
    const hasAuctions = auctions.length > 0;


    return <div className="flex flex-col w-full max-w-305">
        <div className="flex w-full items-center justify-between">
            <h1 className="font-serif text-5xl py-12 font-semibold">My Auctions</h1>
            <Button link="/listing">List an item</Button>
        </div>
        <div className="flex gap-2 items-center justify-start">
            {tabs.map((tabInfo) =>
                <Tab
                    className="py-3"
                    variant={`${selectedTab === tabInfo ? "selected" : "unselected"}`}
                    onClick={() => setSelectedTab(tabInfo)}
                >{tabInfo.title}</Tab>)}
        </div>
        <Divider/>
        <div className="flex flex-col w-full gap-10 mt-10">
            {isLoading ? (
                    <div>Loading...</div>
                )
                : isError ? (
                    <div>Failed to load auctions.</div>
                ) : hasAuctions ? (
                    <DashboardGrid auctions={auctions}/>
                ) : (
                    <EmptyState tab={selectedTab}/>
                )}

            {data && data.page.totalPages > 1 && (
                <Pagination
                    page={data.page.number + 1}
                    totalPages={data.page.totalPages}
                    onPageChange={(pageNum) => setPage(pageNum - 1)}
                />
            )}
        </div>
    </div>
}

interface DashboardItemProps extends HTMLAttributes<HTMLDivElement> {
    auction: AuctionSummary
    className?: string
    imgClassName?: string
}


const DashboardItem = ({className = "", imgClassName = "", auction, ...props}: DashboardItemProps) => {
    const baseStyles = "flex flex-col w-full aspect-square justify-center gap-2 shrink-0 cursor-pointer";
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(id);
    }, []);

    const timeLeftLabel = useMemo(() => {
        return formatTimeLeft(auction.endsAt, now, "long");
    }, [auction.endsAt, now]);
    return (
        <div className={cn(baseStyles, className)} {...props}>
            <div className={cn("relative w-full h-full", imgClassName)}>
                <img src={auction.thumbnail} alt="Not Found" className="w-full h-full object-cover"/>
                <IconButton className="absolute top-3 left-3 bg-main" variant="outlined"
                            iconClassName="text-brand">{mapStatus(auction.status)}</IconButton>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex flex-col start-0 pt-1">
                    <label className="text-muted font-mono tracking-widest text-[12px]">CURRENT BID</label>
                    <label className="text-black font-medium text-xl text-start">{auction.currentBid}</label>
                </div>
                {auction.status === "ACTIVE" && <Button className="" variant="danger" icon={MdCancel}
                                                        iconClassName="">Cancel</Button>}
            </div>
            <label className="text-muted font-medium text-sm font-noto">{timeLeftLabel}</label>

        </div>
    )
}

const DashboardGrid = ({auctions, className = ""}: { auctions: AuctionSummary[], className?: string }) => {
    const baseStyles = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xl:gap-6";
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedAuctionId, setSelectedAuctionId] = useState<number | null>(null);
    const cancelMutation = useCancelAuction()
    return (
        <div className={cn(baseStyles, className)}>
            <ConfirmDialog
                dialogInfo={
                    {
                        title: "Auction Cancellation",
                        message: "Are you sure you want to cancel this auction?",
                        note: "Note that this operation is not reversible."
                    }
                }
                open={dialogOpen}
                onConfirm={() => {
                    if (!selectedAuctionId) return
                    cancelMutation.mutate(selectedAuctionId);
                }} onClose={() => {
                setDialogOpen(false);
            }}
            />
            {auctions.map((item) => <DashboardItem onClick={() => {
                setSelectedAuctionId(item.id)
                setDialogOpen(true)
            }} key={item.id} className="pt-2"
                                                   auction={item}/>)}
        </div>
    );
};


function mapStatus(status: AuctionStatus): String {
    if (status === "ACTIVE") return "Live";
    if (status === "SOLD") return "Sold";
    if (status === "EXPIRED") return "Expired";
    if (status === "CANCELLED") return "Cancelled";
    return "";
}

export default Dashboard;