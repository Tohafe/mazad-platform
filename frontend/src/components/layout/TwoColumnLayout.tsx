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
    <div className={`flex flex-col lg:flex-row w-full gap-6 px-2 lg:gap-10 ${className}`}>
      {/* Main Content - Left Column */}
      <main className="flex-2 w-full">
        {mainContent}
      </main>

      {/* Sidebar - Right Column (Sticky) */}
      {/*<aside className="lg:col-span-5 order-2 lg:order-2">*/}
        <div className="flex-1 w-full max-w-160">
          {sidebar}
        </div>
      {/*</aside>*/}
    </div>
  );
}
