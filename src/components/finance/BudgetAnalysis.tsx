
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, Printer, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import CostsAnalysisTable from "./budget/CostsAnalysisTable";
import RevenueAnalysisTable from "./budget/RevenueAnalysisTable";
import ProfitLossSummary from "./budget/ProfitLossSummary";
import AddCostForm from "./budget/AddCostForm";
import AddRevenueForm from "./budget/AddRevenueForm";
import { 
  budgetData, 
  revenueData, 
  CostItem, 
  RevenueItem, 
  getUniqueCategories,
  formatCurrency,
  getVarianceClass,
  calculateSummary
} from "./budget/budgetData";
import { handleCostChange, handleRevenueChange } from "./budget/budgetFormUtils";
import { useEvent } from "@/contexts/EventContext";
import EventFilter from "@/components/EventFilter";

const BudgetAnalysis: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"costs" | "revenue" | "summary" | "add-cost" | "add-revenue">("costs");
  const { selectedEventId } = useEvent();
  
  const [newCostItem, setNewCostItem] = useState<Partial<CostItem>>({
    category: "",
    description: "",
    planned: 0,
    actual: 0,
    notes: "",
    event: selectedEventId !== "all" ? selectedEventId : ""
  });
  
  const [newRevenueItem, setNewRevenueItem] = useState<Partial<RevenueItem>>({
    category: "",
    description: "",
    planned: 0,
    actual: 0,
    notes: "",
    event: selectedEventId !== "all" ? selectedEventId : ""
  });

  // Update new items event when selectedEventId changes
  React.useEffect(() => {
    if (selectedEventId !== "all") {
      setNewCostItem(prev => ({ ...prev, event: selectedEventId }));
      setNewRevenueItem(prev => ({ ...prev, event: selectedEventId }));
    }
  }, [selectedEventId]);
  
  const filteredCosts = budgetData.filter(
    (item) =>
      (filterCategory === "all" || item.category === filterCategory) &&
      (item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedEventId === "all" || item.event === selectedEventId)
  );

  const filteredRevenue = revenueData.filter(
    (item) =>
      (filterCategory === "all" || item.category === filterCategory) &&
      (item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedEventId === "all" || item.event === selectedEventId)
  );

  const summary = calculateSummary(
    selectedEventId === "all" ? undefined : selectedEventId
  );
  const uniqueCategories = getUniqueCategories();
  
  const handleCostItemChange = (field: keyof CostItem, value: any) => {
    handleCostChange(field, value, newCostItem, setNewCostItem);
  };

  const handleRevenueItemChange = (field: keyof RevenueItem, value: any) => {
    handleRevenueChange(field, value, newRevenueItem, setNewRevenueItem);
  };

  const submitCostItem = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Cost item added successfully!");
    setViewMode("costs");
    
    setNewCostItem({
      category: "",
      description: "",
      planned: 0,
      actual: 0,
      notes: "",
      event: selectedEventId !== "all" ? selectedEventId : ""
    });
  };

  const submitRevenueItem = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Revenue item added successfully!");
    setViewMode("revenue");
    
    setNewRevenueItem({
      category: "",
      description: "",
      planned: 0,
      actual: 0,
      notes: "",
      event: selectedEventId !== "all" ? selectedEventId : ""
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="w-full">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
            <TabsTrigger value="summary">P&L Summary</TabsTrigger>
            <TabsTrigger value="add-cost">Add Cost Item</TabsTrigger>
            <TabsTrigger value="add-revenue">Add Revenue Item</TabsTrigger>
          </TabsList>

          <EventFilter 
            selectedEvent={selectedEventId}
            onEventChange={evt => {}}
            className="w-full md:w-auto"
            showAllOption={true}
          />
        </div>
        
        {(viewMode === "costs" || viewMode === "revenue") && (
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select
              value={filterCategory}
              onValueChange={setFilterCategory}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <TabsContent value="costs" className="mt-6">
          <CostsAnalysisTable 
            filteredCosts={filteredCosts} 
            totalActualCost={summary.totalActualCost} 
            totalCostVariance={summary.totalCostVariance}
            budgetDataLength={budgetData.length}
            formatCurrency={formatCurrency}
            getVarianceClass={getVarianceClass}
            onAddCostClick={() => setViewMode("add-cost")}
          />
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <RevenueAnalysisTable
            filteredRevenue={filteredRevenue}
            totalActualRevenue={summary.totalActualRevenue}
            totalRevenueVariance={summary.totalRevenueVariance}
            revenueDataLength={revenueData.length}
            formatCurrency={formatCurrency}
            getVarianceClass={getVarianceClass}
            onAddRevenueClick={() => setViewMode("add-revenue")}
          />
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <ProfitLossSummary
            totalActualRevenue={summary.totalActualRevenue}
            totalActualCost={summary.totalActualCost}
            actualProfit={summary.actualProfit}
            profitMarginActual={summary.profitMarginActual}
            totalPlannedRevenue={summary.totalPlannedRevenue}
            totalRevenueVariance={summary.totalRevenueVariance}
            totalPlannedCost={summary.totalPlannedCost}
            totalCostVariance={summary.totalCostVariance}
            profitVariance={summary.profitVariance}
            formatCurrency={formatCurrency}
            getVarianceClass={getVarianceClass}
          />
        </TabsContent>

        <TabsContent value="add-cost" className="mt-6">
          <AddCostForm
            newCostItem={newCostItem}
            handleCostChange={handleCostItemChange}
            submitCostItem={submitCostItem}
            onCancel={() => setViewMode("costs")}
          />
        </TabsContent>

        <TabsContent value="add-revenue" className="mt-6">
          <AddRevenueForm
            newRevenueItem={newRevenueItem}
            handleRevenueChange={handleRevenueItemChange}
            submitRevenueItem={submitRevenueItem}
            onCancel={() => setViewMode("revenue")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetAnalysis;
