
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import FinancialOverview from "@/components/dashboard/FinancialOverview";
import RevenueChart from "@/components/dashboard/RevenueChart";
import EventsList from "@/components/dashboard/EventsList";
import FinancialTasks from "@/components/dashboard/FinancialTasks";
import VendorOverview from "@/components/dashboard/VendorOverview";
import StaffingWidget from "@/components/dashboard/StaffingWidget";
import EventFilter from "@/components/EventFilter";
import { useEvent } from "@/contexts/EventContext";
import { useEventOperations } from "@/contexts/EventsContext";
import { useExpenseOperations } from "@/contexts/ExpensesContext";
import { useStaffMemberOperations } from "@/contexts/StaffMembersContext";

const DashboardPage = () => {
  const { selectedEventId, setSelectedEventId } = useEvent();
  
  // Fetch all necessary data from contexts to ensure the dashboard has access to synchronized data
  const { getActiveEvents } = useEventOperations();
  const { getActiveExpenses } = useExpenseOperations();
  const { getActiveStaffMembers } = useStaffMemberOperations();
  
  // This ensures that if any of these items are updated elsewhere in the app,
  // the dashboard will re-render with the latest data
  const events = getActiveEvents();
  const expenses = getActiveExpenses();
  const staffMembers = getActiveStaffMembers();

  return (
    <PageLayout
      title="Dashboard"
      filters={
        <EventFilter 
          selectedEvent={selectedEventId}
          onEventChange={setSelectedEventId}
          className="w-full md:w-auto"
        />
      }
    >
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
          <div className="space-y-6">
            <VendorOverview />
            <StaffingWidget />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;
