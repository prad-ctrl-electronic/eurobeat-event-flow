
import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { BadgePlus, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StaffFilters from "@/components/staffing/StaffFilters";
import StaffList from "@/components/staffing/StaffList";
import StaffMetrics from "@/components/staffing/StaffMetrics";
import AddStaffForm from "@/components/staffing/AddStaffForm";

const Staffing = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <AppHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="container mx-auto py-6 px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Staffing</h1>
            <Button className="gap-2" onClick={() => setShowAddStaffForm(true)}>
              <BadgePlus className="h-4 w-4" /> Add Staff
            </Button>
          </div>
          
          <StaffMetrics className="mb-6" />
          
          <StaffFilters className="mb-6" />
          
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
              <div className="grid-card min-h-[400px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
                  <p className="text-muted-foreground">Staff assignments will appear here</p>
                  <Button variant="outline">Create Assignment</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="shifts">
              <div className="grid-card min-h-[400px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
                  <p className="text-muted-foreground">Staff shift planner will appear here</p>
                  <Button variant="outline">Schedule Shifts</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="payments">
              <div className="grid-card min-h-[400px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
                  <p className="text-muted-foreground">Staff payments will appear here</p>
                  <Button variant="outline">Create Payment</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <AddStaffForm open={showAddStaffForm} onOpenChange={setShowAddStaffForm} />
    </div>
  );
};

export default Staffing;
