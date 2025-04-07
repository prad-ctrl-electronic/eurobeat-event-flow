
import React from "react";
import { Button } from "@/components/ui/button";
import { Users, Clock, Calendar } from "lucide-react";

const StaffShiftPlanner: React.FC = () => {
  return (
    <div className="grid-card min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center space-x-2">
          <Users className="h-12 w-12 text-muted-foreground opacity-50" />
          <Clock className="h-12 w-12 text-muted-foreground opacity-50" />
          <Calendar className="h-12 w-12 text-muted-foreground opacity-50" />
        </div>
        <p className="text-muted-foreground">Staff shift planner will appear here</p>
        <Button variant="outline">Schedule Shifts</Button>
      </div>
    </div>
  );
};

export default StaffShiftPlanner;
