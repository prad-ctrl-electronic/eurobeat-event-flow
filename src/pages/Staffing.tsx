
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { StaffMember } from "@/types/entities";

const Staffing = () => {
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStaffMember, setSelectedStaffMember] = useState<StaffMember | null>(null);
  const { selectedEventId } = useEvent();
  const { getActiveStaffMembers, deleteStaffMember } = useStaffMemberOperations();
  
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

  const handleDeleteStaffMember = (staffMember: StaffMember) => {
    setSelectedStaffMember(staffMember);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedStaffMember) {
      deleteStaffMember(selectedStaffMember.id);
      toast.success(`Staff member ${selectedStaffMember.name} deleted successfully`);
      setShowDeleteDialog(false);
      setSelectedStaffMember(null);
    }
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the staff member
              {selectedStaffMember ? ` "${selectedStaffMember.name}"` : ""}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default Staffing;
