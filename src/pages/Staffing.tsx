
import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import StaffFilters from "@/components/staffing/StaffFilters";
import StaffMetrics from "@/components/staffing/StaffMetrics";
import AddStaffForm from "@/components/staffing/AddStaffForm";
import StaffingHeader from "@/components/staffing/StaffingHeader";
import StaffingTabs from "@/components/staffing/StaffingTabs";
import ExportDropdown from "@/components/common/ExportDropdown";
import { useEvent } from "@/contexts/EventContext";
import { exportData } from "@/utils/exportUtils";
import { useStaffMemberOperations } from "@/contexts/StaffMembersContext";

const Staffing = () => {
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const { selectedEventId } = useEvent();
  const { getActiveStaffMembers } = useStaffMemberOperations();
  
  const handleExport = (format: "excel" | "pdf") => {
    // Export staff data using the context data
    const staffData = getActiveStaffMembers();
    
    exportData(staffData, {
      format,
      module: "staffing",
      submodule: "employees",
      eventId: selectedEventId !== "all" ? selectedEventId : undefined,
      includeHeaders: true
    });
  };
  
  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <StaffingHeader onAddStaff={() => setShowAddStaffForm(true)} />
        <ExportDropdown onExport={handleExport} label="Export Staff Data" />
      </div>
      
      <StaffMetrics className="mb-6" />
      <StaffFilters className="mb-6" />
      <StaffingTabs />

      <AddStaffForm open={showAddStaffForm} onOpenChange={setShowAddStaffForm} />
    </PageLayout>
  );
};

export default Staffing;
