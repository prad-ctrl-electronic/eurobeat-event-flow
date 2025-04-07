
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";

interface BudgetAnalysisHeaderProps {
  viewMode: string;
  onViewModeChange: (value: string) => void;
  onExport?: () => void;
}

const BudgetAnalysisHeader = ({ 
  viewMode, 
  onViewModeChange,
  onExport
}: BudgetAnalysisHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between gap-4">
      <TabsList className="flex-wrap">
        <TabsTrigger 
          value="costs"
          onClick={() => onViewModeChange("costs")}
          data-state={viewMode === "costs" ? "active" : "inactive"}
        >
          Cost Analysis
        </TabsTrigger>
        <TabsTrigger 
          value="revenue"
          onClick={() => onViewModeChange("revenue")}
          data-state={viewMode === "revenue" ? "active" : "inactive"}
        >
          Revenue Analysis
        </TabsTrigger>
        <TabsTrigger 
          value="summary"
          onClick={() => onViewModeChange("summary")}
          data-state={viewMode === "summary" ? "active" : "inactive"}
        >
          P&L Summary
        </TabsTrigger>
        <TabsTrigger 
          value="add-cost"
          onClick={() => onViewModeChange("add-cost")}
          data-state={viewMode === "add-cost" ? "active" : "inactive"}
        >
          Add Cost Item
        </TabsTrigger>
        <TabsTrigger 
          value="add-revenue"
          onClick={() => onViewModeChange("add-revenue")}
          data-state={viewMode === "add-revenue" ? "active" : "inactive"}
        >
          Add Revenue Item
        </TabsTrigger>
      </TabsList>

      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={onExport}
        >
          <FileDown className="h-4 w-4" />
          Export
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>
    </div>
  );
};

export default BudgetAnalysisHeader;
