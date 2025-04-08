
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/Index";
import Events from "./pages/Events";
import Finance from "./pages/Finance";
import Staffing from "./pages/Staffing";
import StaffProfile from "./pages/StaffProfile";
import { EventProvider } from "./contexts/EventContext";
import { EventsProvider } from "./contexts/EventsContext";
import { StaffingProvider } from "./contexts/StaffingContext";
import { CoreEntityProvider } from "./contexts/EntityContext";
import NotificationSystem from "./components/common/NotificationSystem";
import { Toaster } from "./components/ui/sonner";
import { ExpensesProvider } from "./contexts/ExpensesContext";
import { StaffMembersProvider } from "./contexts/StaffMembersContext";
import Reports from "./pages/Reports";
import Tasks from "./pages/Tasks";

const App: React.FC = () => {
  return (
    <CoreEntityProvider>
      <EventsProvider>
        <EventProvider>
          <ExpensesProvider>
            <StaffMembersProvider>
              <StaffingProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/finance" element={<Finance />} />
                    <Route path="/staffing" element={<Staffing />} />
                    <Route path="/staff/:id" element={<StaffProfile />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="*" element={<DashboardPage />} />
                  </Routes>
                </BrowserRouter>
                <Toaster />
                <NotificationSystem />
              </StaffingProvider>
            </StaffMembersProvider>
          </ExpensesProvider>
        </EventProvider>
      </EventsProvider>
    </CoreEntityProvider>
  );
};

export default App;
