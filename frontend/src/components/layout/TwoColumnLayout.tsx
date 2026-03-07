import type { ReactNode } from 'react';

interface TwoColumnLayoutProps {
  mainContent: ReactNode;
  sidebar: ReactNode;
  className?: string;
}

export function TwoColumnLayout({ 
  mainContent, 
  sidebar, 
  className = '' 
}: TwoColumnLayoutProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 ${className}`}>
      {/* Main Content - Left Column */}
      <main className="lg:col-span-7 order-1 lg:order-1">
        {mainContent}
      </main>

      {/* Sidebar - Right Column (Sticky) */}
      <aside className="lg:col-span-5 order-2 lg:order-2">
        <div className="lg:sticky lg:top-8 self-start">
          {sidebar}
        </div>
      </aside>
    </div>
  );
}
