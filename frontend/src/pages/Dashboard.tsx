import Tab from "../components/Card/Tab.tsx";
import Divider from "../components/Divider.tsx";
import {type ReactNode, useEffect, useState} from "react";
import {useCancelAuction, useMyAuctions} from "../hooks/useAuctions.ts";
import Pagination from "../components/Pagination.tsx";
import Button from "../components/Button/Button.tsx";
import type {AuctionStatus, AuctionSummary} from "../types/item.ts";
import ConfirmDialog from "../components/Dialog/ConfirmDialog.tsx";
import ItemGrid from "../components/Grid/ItemGrid.tsx";
import ListingCard from "../components/Card/ListingCard.tsx";

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
    return <div
        className="flex justify-center text-primary font-semibold text-lg font-mono items-center w-full h-100">{children}</div>
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


    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedAuctionId, setSelectedAuctionId] = useState<number | null>(null);
    const cancelMutation = useCancelAuction()

    useEffect(() => {
        window.scrollTo({top: 0, behavior: "smooth"});
    }, [page]);

    const handleCancelClick = (auction: AuctionSummary) => {
        setSelectedAuctionId(auction.id);
        setDialogOpen(true)
    }
    const auctions = data?.content ?? [];
    const hasAuctions = auctions.length > 0;

    return <div className="flex flex-col w-full max-w-305">
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
                    <ItemGrid>
                        {auctions.map((auction) => (
                            <ListingCard auction={auction} handleCancelClick={handleCancelClick}/>)
                        )}
                    </ItemGrid>
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


export default Dashboard;