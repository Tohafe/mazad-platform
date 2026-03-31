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

            <h3 className="text-2xl font-semibold mt-8 mb-4">Our Team & Contributions</h3>
            <ul className="space-y-4">
                <li>
                    <strong>nhimad</strong> - Product Owner (PO)
                    <div className="ml-4 text-gray-600">
                        <p className="mb-1">Full Stack contributions:</p>
                        <ul className="list-disc list-inside ml-2">
                            <li><strong>Frontend:</strong> Developed the Auction Details Page</li>
                            <li><strong>Backend:</strong> Implemented the Bidding and Wallet services</li>
                            <li><strong>Security & Infrastructure:</strong> Set up secure connections by implementing HTTPS and managing SSL/TLS certificates.</li>
                        </ul>
                    </div>
                </li>
                <li>
                    <strong>ajbari</strong> - Project Manager (PM)
                    <div className="ml-4 text-gray-600">
                        <p className="mb-1">Full Stack contributions:</p>
                        <ul className="list-disc list-inside ml-2">
                            <li><strong>Frontend:</strong> Built the real-time Chat Page interface.</li>
                            <li><strong>Backend:</strong> Developed the underlying Chat Service.</li>
                        </ul>
                    </div>
                </li>
                <li>
                    <strong>helarras</strong> - Tech Lead
                    <div className="ml-4 text-gray-600">
                        <p className="mb-1">Full Stack contributions:</p>
                        <ul className="list-disc list-inside ml-2">
                            <li><strong>Frontend:</strong> Developed the User Dashboard, Home page, and the Categories & Search pages with advanced filtering.</li>
                            <li><strong>Backend:</strong> Engineered the Item Service, designed the Public API, and configured the API Gateway.</li>
                        </ul>
                    </div>
                </li>
                <li>
                    <strong>arekoune</strong> - Developer
                    <div className="ml-4 text-gray-600">
                        <p className="mb-1">Full Stack Contributions:</p>
                        <ul className="list-disc list-inside ml-2">
                            <li><strong>Frontend:</strong> Built the Login and Registration pages, as well as the User Profile and Settings interfaces.</li>
                            <li><strong>Backend:</strong> Implemented the Auth and User services, integrated OAuth 2.0, and contributed to the API Gateway.</li>
                        </ul>
                    </div>
                </li>
                <li>
                    <strong>haouky</strong> - Developer
                    <div className="ml-4 text-gray-600">
                        <p className="mb-1">Full Stack Contributions:</p>
                        <ul className="list-disc list-inside ml-2">
                            <li><strong>Frontend:</strong> Built the Notifications UI and Auction Listing page.</li>
                            <li><strong>Backend:</strong> Developed the Upload, MinIO, and Notification services, and integrated AI Content Moderation.</li>
                        </ul>
                    </div>
                </li>
            </ul>
        </ContentPageLayout>
    );
}