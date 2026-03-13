import {ContentPageLayout} from "../../components/ContentPageLayout.tsx";

export default function AboutPage() {
    return (
        <ContentPageLayout
            title="About Us"
            subtitle="Learn more about our auction platform and our mission"
        >
            <p>
                This auction platform is a school project designed to demonstrate modern web development using React, TypeScript, and Spring Boot.
                Our goal is to create a fully functional auction system that users can interact with in real time.
            </p>
            <p>
                Users can create auctions, place bids, and track the bidding activity seamlessly. We focused on building a responsive interface and a robust backend that simulates real-world auction functionality.
            </p>
            <h3 className="text-2xl font-semibold mt-6 mb-2">Our Mission</h3>
            <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Provide a realistic auction experience for learning purposes.</li>
                <li>Explore frontend-backend integration using modern technologies.</li>
                <li>Practice building a structured, professional project layout.</li>
            </ul>
        </ContentPageLayout>
    );
}