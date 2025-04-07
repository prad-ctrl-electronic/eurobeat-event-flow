
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { useStaffing } from "@/contexts/StaffingContext";
import EventFilter from "@/components/EventFilter";
import { useEvent } from "@/contexts/EventContext";
import { Button } from "@/components/ui/button";

interface StaffFiltersProps {
  className?: string;
}

const StaffFilters: React.FC<StaffFiltersProps> = ({ className = "" }) => {
  const { 
    searchTerm, 
    setSearchTerm, 
    departmentFilter, 
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    payrollTypeFilter,
    setPayrollTypeFilter,
    departments
  } = useStaffing();
  
  const { selectedEventId, setSelectedEventId } = useEvent();
  
  const handleClearFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("");
    setStatusFilter("");
    setPayrollTypeFilter("");
    setSelectedEventId("all");
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <EventFilter
          selectedEvent={selectedEventId}
          onEventChange={setSelectedEventId}
          className="w-full md:w-auto"
        />

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleClearFilters}
          className="w-full md:w-auto"
        >
          Clear Filters
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Department" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={payrollTypeFilter} onValueChange={setPayrollTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Contract Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Contract Types</SelectItem>
            <SelectItem value="B2B">B2B</SelectItem>
            <SelectItem value="UoD">UoD</SelectItem>
            <SelectItem value="UoP">UoP</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StaffFilters;
