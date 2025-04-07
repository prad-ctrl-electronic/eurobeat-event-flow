
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, Plus, FileText, BarChart4 } from "lucide-react";
import { useSelectedEventName } from "@/contexts/EventContext";
import { toast } from "sonner";

export interface BudgetAnalysisHeaderProps {
  onAddCostClick: () => void;
  onAddRevenueClick: () => void;
}

const BudgetAnalysisHeader: React.FC<BudgetAnalysisHeaderProps> = ({ 
  onAddCostClick, 
  onAddRevenueClick 
}) => {
  const selectedEventName = useSelectedEventName();

  const handleExport = () => {
    // In a real app, this would trigger a file download
    const budgetData = {
      event: selectedEventName,
      exportDate: new Date().toISOString(),
      exportType: "budget-analysis"
    };
    
    // Convert to JSON and create blob
    const jsonData = JSON.stringify(budgetData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Create download link and trigger click
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedEventName.replace(/\s+/g, '-').toLowerCase()}-budget-analysis.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Budget data exported successfully");
  };

  const handleImport = () => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,.csv';
    
    // Handle file selection
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        toast.success(`Importing budget data from ${file.name}`);
        // In a real app, we would read and parse the file here
      }
    };
    
    // Trigger file dialog
    fileInput.click();
  };

  const handleGenerateReport = () => {
    // In a real app, this would generate a comprehensive report
    toast.success(`Generating comprehensive financial report for ${selectedEventName}`);
    
    // Simulate report generation delay
    setTimeout(() => {
      toast.success("Financial report ready for download");
    }, 1500);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4 items-start md:items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Budget Analysis</h2>
        <p className="text-muted-foreground">{selectedEventName} financial planning and tracking</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={handleImport}
        >
          <Upload className="h-4 w-4" />
          Import
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleGenerateReport}
        >
          <FileText className="h-4 w-4" />
          Generate Report
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
