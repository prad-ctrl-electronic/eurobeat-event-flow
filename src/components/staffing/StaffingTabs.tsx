
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StaffList from "@/components/staffing/StaffList";
import StaffAssignments from "@/components/staffing/StaffAssignments";
import StaffShiftPlanner from "@/components/staffing/StaffShiftPlanner";
import StaffPayments from "@/components/staffing/StaffPayments";
import { useStaffMemberOperations } from "@/contexts/StaffMembersContext";
import { StaffMember } from "@/types/entities";
import { useState } from "react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const StaffingTabs: React.FC = () => {
  const { deleteStaffMember } = useStaffMemberOperations();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStaffMember, setSelectedStaffMember] = useState<StaffMember | null>(null);

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
    <>
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-muted/40 mb-4">
          <TabsTrigger value="all">All Staff</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="shifts">Shift Planner</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <StaffList onDeleteStaffMember={handleDeleteStaffMember} />
        </TabsContent>
        
        <TabsContent value="assignments">
          <StaffAssignments />
        </TabsContent>
        
        <TabsContent value="shifts">
          <StaffShiftPlanner />
        </TabsContent>
        
        <TabsContent value="payments">
          <StaffPayments />
        </TabsContent>
      </Tabs>

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
    </>
  );
};

export default StaffingTabs;
