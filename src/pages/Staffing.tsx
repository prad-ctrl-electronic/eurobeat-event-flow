
import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import StaffFilters from "@/components/staffing/StaffFilters";
import StaffMetrics from "@/components/staffing/StaffMetrics";
import AddStaffForm from "@/components/staffing/AddStaffForm";
import StaffingHeader from "@/components/staffing/StaffingHeader";
import StaffingTabs from "@/components/staffing/StaffingTabs";

const Staffing = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <AppHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="container mx-auto py-6 px-4">
          <StaffingHeader onAddStaff={() => setShowAddStaffForm(true)} />
          
          <StaffMetrics className="mb-6" />
          
          <StaffFilters className="mb-6" />
          
          <StaffingTabs />
        </main>
      </div>

      <AddStaffForm open={showAddStaffForm} onOpenChange={setShowAddStaffForm} />
    </div>
  );
};

export default Staffing;
