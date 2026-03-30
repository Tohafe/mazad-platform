import {ContentPageLayout} from "../../components/ContentPageLayout.tsx";

export default function HelpCenter() {
    return (
        <ContentPageLayout
            title="Help Center"
            subtitle="Frequently asked questions and support"
        >
            <p>
                Welcome to the Mazad Help Center. Here you can find answers to the most common questions about buying, selling, and managing your account on our platform.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4 text-black">Frequently Asked Questions</h3>

            <div className="space-y-6">
                <div>
                    <h4 className="text-xl font-medium text-black">How do I create an account?</h4>
                    <p className="mt-2">
                        Click on the "Sign Up" button in the top right corner. You'll need to provide a valid email address and create a secure password to get started.
                    </p>
                </div>

                <div>
                    <h4 className="text-xl font-medium text-black">Are there any fees for listing an item?</h4>
                    <p className="mt-2">
                        Currently, listing items on Mazad is completely free. We designed this platform to provide a seamless and accessible auction experience.
                    </p>
                </div>

                <div>
                    <h4 className="text-xl font-medium text-black">How do I know if I won an auction?</h4>
                    <p className="mt-2">
                        If you are the highest bidder when the auction timer expires, you will receive an immediate notification in your Inbox confirming your winning bid.
                    </p>
                </div>
            </div>
        </ContentPageLayout>
    );
}