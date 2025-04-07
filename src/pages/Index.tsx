
import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import FinancialOverview from "@/components/dashboard/FinancialOverview";
import RevenueChart from "@/components/dashboard/RevenueChart";
import EventsList from "@/components/dashboard/EventsList";
import FinancialTasks from "@/components/dashboard/FinancialTasks";

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <AppHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="container mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
          
          <div className="space-y-6">
            <FinancialOverview />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RevenueChart />
              </div>
              <div>
                <FinancialTasks />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <EventsList />
              </div>
              <div>
                {/* Placeholder for additional widget */}
                <div className="card-gradient rounded-xl h-full min-h-[200px] flex items-center justify-center">
                  <p className="text-muted-foreground">Additional metrics will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
