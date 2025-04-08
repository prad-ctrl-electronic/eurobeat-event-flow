
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BudgetAnalysisHeader from "@/components/finance/BudgetAnalysisHeader";
import BudgetFilter from "@/components/finance/BudgetFilter";
import ProfitLossSummary from "@/components/finance/budget/ProfitLossSummary";
import CostsAnalysisTable from "@/components/finance/budget/CostsAnalysisTable";
import RevenueAnalysisTable from "@/components/finance/budget/RevenueAnalysisTable";
import AddCostForm from "@/components/finance/budget/AddCostForm";
import AddRevenueForm from "@/components/finance/budget/AddRevenueForm";
import { CostItem, RevenueItem } from "@/components/finance/budget/types";
import { costsData, revenueData, calculateSummary, getUniqueCategories, formatCurrency, getVarianceClass } from "@/components/finance/budget/budgetData";
import { useEvent } from "@/contexts/EventContext";
import { toast } from "sonner";

// Budget analysis component
const BudgetAnalysis: React.FC = () => {
  // State for managing visibility of forms
  const [showAddCostForm, setShowAddCostForm] = useState(false);
  const [showAddRevenueForm, setShowAddRevenueForm] = useState(false);
  const [costs, setCosts] = useState<CostItem[]>(costsData);
  const [revenues, setRevenues] = useState<RevenueItem[]>(revenueData);
  const [activeTab, setActiveTab] = useState("costs");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Get selected event context
  const { selectedEventId, events } = useEvent();
  
  // Get unique categories from the budget data
  const categories = getUniqueCategories();

  // Filter data based on selected event
  let filteredCosts = selectedEventId === "all"
    ? costs
    : costs.filter(cost => cost.event === selectedEventId);

  let filteredRevenues = selectedEventId === "all"
    ? revenues
    : revenues.filter(revenue => revenue.event === selectedEventId);
    
  // Apply search and category filters
  if (searchTerm) {
    filteredCosts = filteredCosts.filter(cost => 
      cost.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cost.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    filteredRevenues = filteredRevenues.filter(revenue => 
      revenue.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      revenue.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (filterCategory !== "all") {
    filteredCosts = filteredCosts.filter(cost => cost.category === filterCategory);
    filteredRevenues = filteredRevenues.filter(revenue => revenue.category === filterCategory);
  }

  // Handle adding new cost
  const handleAddCost = (newCost: CostItem) => {
    setCosts([...costs, newCost]);
    setShowAddCostForm(false);
  };

  // Handle adding new revenue
  const handleAddRevenue = (newRevenue: RevenueItem) => {
    setRevenues([...revenues, newRevenue]);
    setShowAddRevenueForm(false);
  };

  // Handle deleting cost
  const handleDeleteCost = (costId: string) => {
    const costToDelete = costs.find(cost => cost.id === costId);
    if (costToDelete) {
      setCosts(costs.filter(cost => cost.id !== costId));
      toast.success(`Cost item "${costToDelete.description}" deleted successfully`);
    }
  };

  // Handle deleting revenue
  const handleDeleteRevenue = (revenueId: string) => {
    const revenueToDelete = revenues.find(revenue => revenue.id === revenueId);
    if (revenueToDelete) {
      setRevenues(revenues.filter(revenue => revenue.id !== revenueId));
      toast.success(`Revenue item "${revenueToDelete.description}" deleted successfully`);
    }
  };

  // Calculate summary data for the selected event
  const summary = calculateSummary(filteredCosts, filteredRevenues);

  return (
    <div className="space-y-6">
      <BudgetAnalysisHeader
        onAddCostClick={() => setShowAddCostForm(true)}
        onAddRevenueClick={() => setShowAddRevenueForm(true)}
      />

      <BudgetFilter 
        searchTerm={searchTerm}
        filterCategory={filterCategory}
        onSearchChange={setSearchTerm}
        onCategoryChange={setFilterCategory}
        categories={categories}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-3">
          <CardHeader className="pb-3">
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>
              Financial summary for {selectedEventId === "all"
                ? "all events"
                : events.find(e => e.id === selectedEventId)?.name || "unknown event"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="costs">Costs Analysis</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="costs">
          <CostsAnalysisTable 
            filteredCosts={filteredCosts}
            totalActualCost={summary.totalActualCost}
            totalCostVariance={summary.totalCostVariance}
            budgetDataLength={costs.length}
            formatCurrency={formatCurrency}
            getVarianceClass={getVarianceClass}
            onAddCostClick={() => setShowAddCostForm(true)}
            onDeleteCost={handleDeleteCost}
          />
        </TabsContent>
        <TabsContent value="revenue">
          <RevenueAnalysisTable 
            filteredRevenues={filteredRevenues}
            totalActualRevenue={summary.totalActualRevenue}
            totalRevenueVariance={summary.totalRevenueVariance}
            revenueDataLength={revenues.length}
            formatCurrency={formatCurrency}
            getVarianceClass={getVarianceClass}
            onAddRevenueClick={() => setShowAddRevenueForm(true)}
            onDeleteRevenue={handleDeleteRevenue}
          />
        </TabsContent>
      </Tabs>

      {/* Forms for adding new budget items */}
      {showAddCostForm && (
        <AddCostForm
          onSave={handleAddCost}
          onCancel={() => setShowAddCostForm(false)}
        />
      )}
      {showAddRevenueForm && (
        <AddRevenueForm
          onSave={handleAddRevenue}
          onCancel={() => setShowAddRevenueForm(false)}
        />
      )}
    </div>
  );
};

export default BudgetAnalysis;
