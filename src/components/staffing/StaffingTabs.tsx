
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StaffList from "@/components/staffing/StaffList";
import StaffAssignments from "@/components/staffing/StaffAssignments";
import StaffShiftPlanner from "@/components/staffing/StaffShiftPlanner";
import StaffPayments from "@/components/staffing/StaffPayments";

const StaffingTabs: React.FC = () => {
  return (
    <Tabs defaultValue="all" className="space-y-6">
      <TabsList className="bg-muted/40 mb-4">
        <TabsTrigger value="all">All Staff</TabsTrigger>
        <TabsTrigger value="assignments">Assignments</TabsTrigger>
        <TabsTrigger value="shifts">Shift Planner</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <StaffList />
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
  );
};

export default StaffingTabs;
