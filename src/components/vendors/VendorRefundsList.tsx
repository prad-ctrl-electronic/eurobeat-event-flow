
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
import { Plus, AlertCircle } from "lucide-react";
import { vendorRefunds } from "@/data/vendorData";
import { useEvent } from "@/contexts/EventContext";
import { toast } from "sonner";

interface VendorRefundsListProps {
  vendorId: string;
  selectedEventId: string;
}

const VendorRefundsList: React.FC<VendorRefundsListProps> = ({ vendorId, selectedEventId }) => {
  const { events } = useEvent();
  
  // Filter refunds by vendor and event
  const refunds = vendorRefunds.filter(refund => {
    const vendorMatch = refund.vendorId === vendorId;
    const eventMatch = selectedEventId === "all" || refund.eventId === selectedEventId;
    return vendorMatch && eventMatch;
  });
  
  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processed':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case 'pending':
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case 'rejected':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };
  
  const handleAddRefund = () => {
    toast.info("Add refund functionality is not implemented yet");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddRefund}>
          <Plus className="h-4 w-4 mr-2" /> Add Refund
        </Button>
      </div>
      
      <div className="border rounded-md overflow-x-auto">
        {refunds.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Related Invoice</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refunds.map((refund) => {
                const event = events.find(e => e.id === refund.eventId);
                return (
                  <TableRow key={refund.id}>
                    <TableCell>{new Date(refund.date).toLocaleDateString()}</TableCell>
                    <TableCell>{event?.name || refund.eventId}</TableCell>
                    <TableCell className="font-medium">
                      {refund.currency} {refund.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{refund.reason}</TableCell>
                    <TableCell>
                      {refund.relatedInvoiceId ? refund.relatedInvoiceId : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={getStatusBadgeClass(refund.status)}
                      >
                        {refund.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10">
            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No refunds recorded</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorRefundsList;
