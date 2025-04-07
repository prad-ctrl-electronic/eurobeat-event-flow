
import React from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";

interface ExpenseActionsProps {
  onDownloadReport?: () => void;
  onPrint?: () => void;
}

const ExpenseActions = ({ onDownloadReport, onPrint }: ExpenseActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={onDownloadReport}
      >
        <FileDown className="h-4 w-4" />
        Export
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={onPrint}
      >
        <Printer className="h-4 w-4" />
        Print
      </Button>
    </div>
  );
};

export default ExpenseActions;
