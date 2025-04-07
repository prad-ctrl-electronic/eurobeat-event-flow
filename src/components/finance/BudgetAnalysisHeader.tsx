
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, Plus } from "lucide-react";
import { useSelectedEventName } from "@/contexts/EventContext";

export interface BudgetAnalysisHeaderProps {
  onAddCostClick: () => void;
  onAddRevenueClick: () => void;
}

const BudgetAnalysisHeader: React.FC<BudgetAnalysisHeaderProps> = ({ 
  onAddCostClick, 
  onAddRevenueClick 
}) => {
  const selectedEventName = useSelectedEventName();

  return (
    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4 items-start md:items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Budget Analysis</h2>
        <p className="text-muted-foreground">{selectedEventName} financial planning and tracking</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
        
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Import
        </Button>
        
        <Button
          size="sm" 
          className="flex items-center gap-2"
          onClick={onAddCostClick}
        >
          <Plus className="h-4 w-4" />
          Add Cost
        </Button>
        
        <Button
          size="sm" 
          variant="secondary" 
          className="flex items-center gap-2"
          onClick={onAddRevenueClick}
        >
          <Plus className="h-4 w-4" />
          Add Revenue
        </Button>
      </div>
    </div>
  );
};

export default BudgetAnalysisHeader;
