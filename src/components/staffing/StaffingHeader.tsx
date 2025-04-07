
import React from "react";
import { Button } from "@/components/ui/button";
import { BadgePlus } from "lucide-react";

interface StaffingHeaderProps {
  onAddStaff: () => void;
}

const StaffingHeader: React.FC<StaffingHeaderProps> = ({ onAddStaff }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 className="text-3xl font-bold tracking-tight">Staffing</h1>
      <Button className="gap-2" onClick={onAddStaff}>
        <BadgePlus className="h-4 w-4" /> Add Staff
      </Button>
    </div>
  );
};

export default StaffingHeader;
