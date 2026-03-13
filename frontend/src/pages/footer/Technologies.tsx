import {ContentPageLayout} from "../../components/ContentPageLayout.tsx";

export default function TechnologiesPage() {
    return (
        <ContentPageLayout
            title="Technologies Used"
            subtitle="A look at the stack behind our auction platform"
        >
            <p>
                This project leverages modern web development technologies to provide a responsive and interactive user experience:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Frontend:</strong> React, TypeScript, Tailwind CSS</li>
                <li><strong>Backend:</strong> Spring Boot, Java, Apache Kafka</li>
                <li><strong>Database:</strong> PostgreSQL</li>
                <li><strong>API Documentation:</strong> Swagger UI</li>
            </ul>
            <p>
                By combining these technologies, we ensure a maintainable, professional-looking application that follows best practices for both frontend and backend development.
            </p>
        </ContentPageLayout>
    );
}