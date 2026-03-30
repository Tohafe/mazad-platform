import { ContentPageLayout } from "../../components/ContentPageLayout.tsx";

export default function BiddingGuide() {
    return (
        <ContentPageLayout
            title="Bidding Guide"
            subtitle="Everything you need to know to win your next auction"
        >
            <p>
                Bidding on Mazad is designed to be fast, fair, and exciting. Follow this guide to understand how our real-time bidding system works and how to increase your chances of winning.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4 text-black">How to Place a Bid</h3>
            <ol className="list-decimal list-inside ml-4 space-y-4">
                <li>
                    <strong>Find an item:</strong> Browse our categories or use the search bar to find an active auction you are interested in.
                </li>
                <li>
                    <strong>Check the current bid:</strong> Ensure you are aware of the current highest bid and the minimum increment required to take the lead.
                </li>
                <li>
                    <strong>Enter your amount:</strong> Type your maximum bid into the input field. Our system will automatically process it in real-time.
                </li>
                <li>
                    <strong>Monitor the auction:</strong> Keep an eye on the countdown timer. If someone outbids you, you will be notified instantly so you can bid again.
                </li>
            </ol>

            <div className="bg-gray-50 p-6 mt-8 border border-border">
                <h4 className="text-xl font-medium text-black mb-2">Pro Tip</h4>
                <p>
                    Make sure you are logged in and have a stable connection during the final minutes of an auction, as this is when the most intense bidding activity usually occurs!
                </p>
            </div>
        </ContentPageLayout>
    );
}