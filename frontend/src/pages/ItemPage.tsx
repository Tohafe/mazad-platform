import {useParams} from 'react-router-dom';
import {TwoColumnLayout, MainContent, BidSidebar} from '../components';
import {useProduct} from '../hooks/';
import ItemCarousel from "../components/Carousel/ItemCarousel.tsx";
import {useAuctions} from "../hooks/useAuctions.ts";
import useSeller from "../hooks/useSeller.ts";
import {useEffect} from "react";

function ItemPage() {
    const {productId} = useParams<{ productId: string }>();
    const numericProductId = Number(productId);
    const {data, isLoading, isError, error} = useProduct(numericProductId);
    const {data: auctions} = useAuctions({size: 10, sellerId: data?.raw.sellerId})
    const {data: seller} = useSeller(data?.raw.sellerId);

    const otherAuctions = auctions?.content.filter(auction => auction.id !== data?.raw.id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [data]);

    if (isLoading) { 
        return (
            <div className="min-h-screen bg-white">
                {/* <Header /> */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"/>
                    </div>
                </main>
            </div>
        );
    }

    if (isError) {
        console.error('Auction fetch error:', error);
        return (
            <div className="min-h-screen bg-white">
                {/* <Header /> */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
                    <div className="flex flex-col items-center justify-center h-96 text-center">
                        <p className="text-error text-lg font-medium mb-2">Failed to load auction</p>
                        <p className="text-secondary text-sm">{String(error?.message || error || 'Please try again later')}</p>
                    </div>
                </main>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <div className="max-w-305 w-full min-h-screen bg-white">
            {/* <Header /> */}

            {/* Main Content */}
            <main className="max-w-305 w-full py-4 sm:py-8">
                <TwoColumnLayout
                    mainContent={
                        <MainContent
                            title={data.product.title}
                            images={data.product.images}
                            description={data.product.description}
                            sellerDescription={data.product.sellerDescription}
                            details={data.product.details}
                            shippingInfo={data.product.shippingInfo}
                        />
                    }
                    sidebar={<BidSidebar data={data.bidData} auctionId={numericProductId}/>}
                />
                {otherAuctions && seller && otherAuctions.length > 0 &&
                    <ItemCarousel className="pt-15" carouselTitle={`Other auctions from ${seller?.name}`} auctions={otherAuctions}/>}
            </main>
        </div>
    );
}

export default ItemPage;
