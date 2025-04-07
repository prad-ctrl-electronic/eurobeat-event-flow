
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "@/pages/Index";
import Finance from "@/pages/Finance";
import Events from "@/pages/Events";
import Tasks from "@/pages/Tasks";
import Reports from "@/pages/Reports";
import Staffing from "@/pages/Staffing";
import StaffProfile from "@/pages/StaffProfile";
import VendorManagement from "@/pages/VendorManagement";
import VendorDetail from "@/pages/VendorDetail";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import VerifyEmail from "@/pages/VerifyEmail";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { EventProvider } from "@/contexts/EventContext";
import { StaffingProvider } from "@/contexts/StaffingContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <StaffingProvider>
          <Router>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/events" element={<Events />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/staffing" element={<Staffing />} />
              <Route path="/staffing/:id" element={<StaffProfile />} />
              <Route path="/vendors" element={<VendorManagement />} />
              <Route path="/vendors/:id" element={<VendorDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster position="top-right" richColors />
        </StaffingProvider>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;
