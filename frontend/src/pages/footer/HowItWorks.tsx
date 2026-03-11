import {ContentPageLayout} from "../../components/ContentPageLayout.tsx";

export default function HowItWorksPage() {
    return (
        <ContentPageLayout
            title="How Auctions Work"
            subtitle="A step-by-step guide for buyers and sellers"
        >
            <ol className="list-decimal list-inside ml-4 space-y-3">
                <li>Sellers create a listing by providing item details and starting price.</li>
                <li>Buyers browse active auctions and place bids on items they want.</li>
                <li>The auction runs until the end time, and the highest bidder wins.</li>
                <li>After the auction ends, the winner can arrange payment and shipping with the seller.</li>
            </ol>
            <p className="mt-4">
                All auctions are time-bound, and users can see current bids in real time. This ensures a fair and engaging experience for everyone.
            </p>
        </ContentPageLayout>
    );
}