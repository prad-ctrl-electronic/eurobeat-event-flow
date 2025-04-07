
import React from "react";
import { 
  Table, 
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase } from "lucide-react";
import { vendorAssignments } from "@/data/vendorData";
import { useEvent } from "@/contexts/EventContext";
import { toast } from "sonner";

interface VendorAssignmentListProps {
  vendorId: string;
  selectedEventId: string;
}

const VendorAssignmentList: React.FC<VendorAssignmentListProps> = ({ vendorId, selectedEventId }) => {
  const { events } = useEvent();
  
  // Filter assignments by vendor and event
  const assignments = vendorAssignments.filter(assignment => {
    const vendorMatch = assignment.vendorId === vendorId;
    const eventMatch = selectedEventId === "all" || assignment.eventId === selectedEventId;
    return vendorMatch && eventMatch;
  });
  
  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case 'confirmed':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case 'assigned':
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case 'canceled':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };
  
  const handleAddAssignment = () => {
    toast.info("Add assignment functionality is not implemented yet");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddAssignment}>
          <Plus className="h-4 w-4 mr-2" /> Add Assignment
        </Button>
      </div>
      
      <div className="border rounded-md overflow-x-auto">
        {assignments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Budgeted Amount</TableHead>
                <TableHead className="text-right">Actual Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => {
                const event = events.find(e => e.id === assignment.eventId);
                return (
                  <TableRow key={assignment.id}>
                    <TableCell>{event?.name || assignment.eventId}</TableCell>
                    <TableCell className="font-medium">{assignment.role}</TableCell>
                    <TableCell className="text-right">
                      EUR {assignment.budgetedAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {assignment.actualAmount 
                        ? `EUR ${assignment.actualAmount.toLocaleString()}`
                        : "-"
                      }
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={getStatusBadgeClass(assignment.status)}
                      >
                        {assignment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {assignment.notes || "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10">
            <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No assignments recorded</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorAssignmentList;
