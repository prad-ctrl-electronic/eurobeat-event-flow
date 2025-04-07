
import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import FinancialOverview from "@/components/dashboard/FinancialOverview";
import RevenueChart from "@/components/dashboard/RevenueChart";
import EventsList from "@/components/dashboard/EventsList";
import FinancialTasks from "@/components/dashboard/FinancialTasks";
import VendorOverview from "@/components/dashboard/VendorOverview";
import EventFilter from "@/components/EventFilter";
import { useEvent } from "@/contexts/EventContext";

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedEventId, setSelectedEventId } = useEvent();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <AppHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            
            <EventFilter 
              selectedEvent={selectedEventId}
              onEventChange={setSelectedEventId}
              className="w-full md:w-auto"
            />
          </div>
          
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
                <VendorOverview />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
