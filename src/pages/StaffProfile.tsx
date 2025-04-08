
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
            staffMember={staffMember}
            getDepartmentName={getDepartmentName}
          />
          <ProfileTabs staffMember={staffMember} />
        </main>
      </div>
    </div>
  );
};

export default StaffProfile;
