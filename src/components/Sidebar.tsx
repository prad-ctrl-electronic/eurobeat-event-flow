
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Receipt, 
  BarChart3, 
  FileText, 
  CheckSquare,
  Settings,
  ChevronLeft,
  Music
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
}

const NavItem = ({ icon, label, to, isActive }: NavItemProps) => (
  <NavLink 
    to={to}
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
      isActive 
        ? "text-primary-foreground bg-primary/90" 
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    )}
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar transition-transform duration-300 border-r border-border transform lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary-purple flex items-center justify-center animate-pulse-glow">
              <Music className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-foreground">exist.pl</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-col gap-1 p-2 overflow-y-auto">
          <NavItem 
            icon={<LayoutDashboard className="h-5 w-5" />} 
            label="Dashboard" 
            to="/" 
          />
          <NavItem 
            icon={<Receipt className="h-5 w-5" />} 
            label="Finance" 
            to="/finance" 
          />
          <NavItem 
            icon={<Calendar className="h-5 w-5" />} 
            label="Events" 
            to="/events" 
          />
          <NavItem 
            icon={<Users className="h-5 w-5" />} 
            label="Staffing" 
            to="/staffing" 
          />
          <NavItem 
            icon={<CheckSquare className="h-5 w-5" />} 
            label="Tasks" 
            to="/tasks" 
          />
          <NavItem 
            icon={<BarChart3 className="h-5 w-5" />} 
            label="Reports" 
            to="/reports" 
          />
          <NavItem 
            icon={<FileText className="h-5 w-5" />} 
            label="Documents" 
            to="/documents" 
          />
        </div>
        
        <div className="mt-auto p-4 border-t border-border">
          <NavItem 
            icon={<Settings className="h-5 w-5" />} 
            label="Settings" 
            to="/settings" 
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
