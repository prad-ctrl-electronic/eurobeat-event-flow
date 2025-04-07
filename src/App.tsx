
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthCheck } from "@/components/auth/AuthCheck";
import Index from "./pages/Index";
import Finance from "./pages/Finance";
import Events from "./pages/Events";
import Staffing from "./pages/Staffing";
import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            
            {/* Protected routes */}
            <Route path="/" element={<AuthCheck><Index /></AuthCheck>} />
            <Route path="/finance" element={<AuthCheck><Finance /></AuthCheck>} />
            <Route path="/events" element={<AuthCheck><Events /></AuthCheck>} />
            <Route path="/staffing" element={<AuthCheck><Staffing /></AuthCheck>} />
            <Route path="/tasks" element={<AuthCheck><Tasks /></AuthCheck>} />
            <Route path="/reports" element={<AuthCheck><Reports /></AuthCheck>} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
