
import React from "react";
import { 
  Bell, 
  Search, 
  Settings, 
  User,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppHeaderProps {
  toggleSidebar: () => void;
}

const AppHeader = ({ toggleSidebar }: AppHeaderProps) => {
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden md:flex items-center relative ml-4">
          <Search className="h-4 w-4 absolute left-2.5 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="rounded-full h-9 w-[200px] lg:w-[300px] pl-9 pr-4 bg-muted/50 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary-purple"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-accent-pink animate-pulse"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>App Settings</DropdownMenuItem>
            <DropdownMenuItem>Language & Region</DropdownMenuItem>
            <DropdownMenuItem>Organization</DropdownMenuItem>
            <DropdownMenuItem>API Keys</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-purple flex items-center justify-center text-primary-foreground font-medium">
                BT
              </div>
              <span className="font-medium hidden md:inline-block">
                BeatTech
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;
