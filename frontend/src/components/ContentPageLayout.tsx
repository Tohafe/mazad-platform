interface ContentPageLayoutProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export function ContentPageLayout({ title, subtitle, children }: ContentPageLayoutProps) {
    return (
        <div className="w-full xl:w-305 py-12 mx-auto">
            {/* Page title */}
            <h1 className="text-6xl font-semibold font-serif text-brand mb-4">{title}</h1>

            {/* Page subtitle / short description */}
            {subtitle && (
                <h2 className="text-5xl font-medium text-black mb-8">{subtitle}</h2>
            )}

            {/* Content area */}
            <div className="max-w-250 space-y-6 text-secondary text-lg">
                {children}
            </div>
        </div>
    );
}