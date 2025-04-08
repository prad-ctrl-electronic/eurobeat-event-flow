
import React from "react";
import { useParams } from "react-router-dom";
import { useStaffing } from "@/contexts/StaffingContext";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import ProfileHeader from "@/components/staff/ProfileHeader";
import ProfileSummary from "@/components/staff/ProfileSummary";
import ProfileTabs from "@/components/staff/ProfileTabs";
import StaffNotFound from "@/components/staff/StaffNotFound";
import { useState } from "react";
import { useStaffMemberOperations } from "@/contexts/StaffMembersContext";
import { StaffMember as BudgetStaffMember } from "@/components/finance/budget/types";

const StaffProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { departments } = useStaffing();
  const { getActiveStaffMembers } = useStaffMemberOperations();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const staffMembers = getActiveStaffMembers();
  const staffMember = staffMembers.find(member => member.id.toString() === id);
  
  if (!staffMember) {
    return <StaffNotFound />;
  }
  
  // Convert to the format expected by the ProfileSummary and ProfileTabs components
  const budgetStaffMember: BudgetStaffMember = {
    ...staffMember,
    id: Number(staffMember.id), // Ensure id is a number as expected by components
    // Ensure status is one of the allowed values in BudgetStaffMember type
    status: (staffMember.status === "active" || 
            staffMember.status === "inactive" || 
            staffMember.status === "pending") 
            ? staffMember.status 
            : "inactive", // Default fallback if not matching any expected status
    // Ensure contract is always provided as it's required in BudgetStaffMember
    contract: staffMember.contract || "Standard"
  };
  
  const getDepartmentName = (departmentId: string | undefined): string => {
    if (!departmentId) return "Not Assigned";
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : "Unknown";
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <AppHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="container mx-auto py-6 px-4">
          <ProfileHeader />
          <ProfileSummary 
            staffMember={budgetStaffMember}
            getDepartmentName={getDepartmentName}
          />
          <ProfileTabs staffMember={budgetStaffMember} />
        </main>
      </div>
    </div>
  );
};

export default StaffProfile;
