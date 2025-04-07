
import React from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const StaffAssignments: React.FC = () => {
  return (
    <div className="grid-card min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Users className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
        <p className="text-muted-foreground">Staff assignments will appear here</p>
        <Button variant="outline">Create Assignment</Button>
      </div>
    </div>
  );
};

export default StaffAssignments;
