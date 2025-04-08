
import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import StaffFilters from "@/components/staffing/StaffFilters";
import StaffMetrics from "@/components/staffing/StaffMetrics";
import AddStaffForm from "@/components/staffing/AddStaffForm";
import StaffingHeader from "@/components/staffing/StaffingHeader";
import StaffingTabs from "@/components/staffing/StaffingTabs";
import { Button } from "@/components/ui/button";
import { 
  Download,
  FileSpreadsheet,
  FilePdf
} from "lucide-react";
import { useEvent } from "@/contexts/EventContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { staffMembers } from "@/data/staffingData";
import { exportData } from "@/utils/exportUtils";

const Staffing = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const { selectedEventId } = useEvent();
  
  const handleExport = (format: "excel" | "pdf") => {
    // Export staff data
    const staffData = staffMembers.filter(staff => 
      selectedEventId === "all" || staff.assignedEvents.includes(selectedEventId)
    );
    
    exportData(staffData, {
      format,
      module: "staffing",
      submodule: "employees",
      eventId: selectedEventId !== "all" ? selectedEventId : undefined,
      includeHeaders: true
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <AppHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="container mx-auto py-6 px-4">
          <div className="flex justify-between items-center mb-6">
            <StaffingHeader onAddStaff={() => setShowAddStaffForm(true)} />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Staff Data
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("excel")}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export to Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  <FilePdf className="h-4 w-4 mr-2" />
                  Export to PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
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
