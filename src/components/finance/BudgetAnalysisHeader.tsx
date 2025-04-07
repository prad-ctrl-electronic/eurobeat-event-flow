
import React from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BudgetAnalysisHeaderProps {
  viewMode: string;
  onViewModeChange: (value: string) => void;
}

const BudgetAnalysisHeader = ({ viewMode, onViewModeChange }: BudgetAnalysisHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between gap-4">
      <TabsList className="flex-wrap">
        <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
        <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
        <TabsTrigger value="summary">P&L Summary</TabsTrigger>
        <TabsTrigger value="add-cost">Add Cost Item</TabsTrigger>
        <TabsTrigger value="add-revenue">Add Revenue Item</TabsTrigger>
      </TabsList>

      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
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
