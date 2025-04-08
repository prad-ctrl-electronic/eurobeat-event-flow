
import React, { useState, ReactNode } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
  filters?: ReactNode;
}

const PageLayout = ({ 
  children, 
  title, 
  actions,
  filters 
}: PageLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <AppHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="container mx-auto py-6 px-4">
          {(title || actions || filters) && (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
              
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                {filters}
                {actions && (
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
