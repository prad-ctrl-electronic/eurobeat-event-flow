
import React from "react";
import { Button } from "@/components/ui/button";
import { Calculator, BarChart4, Plus } from "lucide-react";
import EventFilter from "@/components/EventFilter";
import { useEvent } from "@/contexts/EventContext";

interface FinanceHeaderProps {
  onAddExpense: () => void;
  onShowTaxCalculator: () => void;
}

const FinanceHeader: React.FC<FinanceHeaderProps> = ({ 
  onAddExpense, 
  onShowTaxCalculator 
}) => {
  const { selectedEventId, setSelectedEventId } = useEvent();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
      
      <EventFilter 
        selectedEvent={selectedEventId}
        onEventChange={setSelectedEventId}
        className="w-full md:w-auto"
      />
      
      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        <Button variant="outline" className="gap-2" onClick={onShowTaxCalculator}>
          <Calculator className="h-4 w-4" /> Tax Calculator
        </Button>
        <Button variant="outline" className="gap-2">
          <BarChart4 className="h-4 w-4" /> Budget Report
        </Button>
        <Button className="gap-2" onClick={onAddExpense}>
          <Plus className="h-4 w-4" /> Add Expense
        </Button>
      </div>
    </div>
  );
};

export default FinanceHeader;
