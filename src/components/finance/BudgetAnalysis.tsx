
import React, { useState } from "react";
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
import { costsData, revenueData, calculateSummary } from "@/components/finance/budget/budgetData";
import { useEvent } from "@/contexts/EventContext";

// Budget analysis component
const BudgetAnalysis: React.FC = () => {
  // State for managing visibility of forms
  const [showAddCostForm, setShowAddCostForm] = useState(false);
  const [showAddRevenueForm, setShowAddRevenueForm] = useState(false);
  const [costs, setCosts] = useState<CostItem[]>(costsData);
  const [revenues, setRevenues] = useState<RevenueItem[]>(revenueData);
  const [activeTab, setActiveTab] = useState("costs");

  // Get selected event context
  const { selectedEventId, events } = useEvent();

  // Filter data based on selected event
  const filteredCosts = selectedEventId === "all"
    ? costs
    : costs.filter(cost => cost.event === selectedEventId);

  const filteredRevenues = selectedEventId === "all"
    ? revenues
    : revenues.filter(revenue => revenue.event === selectedEventId);

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

  // Calculate summary data for the selected event
  const summary = calculateSummary(filteredCosts, filteredRevenues);

  return (
    <div className="space-y-6">
      <BudgetAnalysisHeader
        onAddCost={() => setShowAddCostForm(true)}
        onAddRevenue={() => setShowAddRevenueForm(true)}
      />

      <BudgetFilter />

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
            <ProfitLossSummary summary={summary} />
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="costs">Costs Analysis</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="costs">
          <CostsAnalysisTable costs={filteredCosts} />
        </TabsContent>
        <TabsContent value="revenue">
          <RevenueAnalysisTable revenues={filteredRevenues} />
        </TabsContent>
      </Tabs>

      {/* Forms for adding new budget items */}
      <AddCostForm
        open={showAddCostForm}
        onOpenChange={setShowAddCostForm}
        onSave={handleAddCost}
      />
      <AddRevenueForm
        open={showAddRevenueForm}
        onOpenChange={setShowAddRevenueForm}
        onSave={handleAddRevenue}
      />
    </div>
  );
};

export default BudgetAnalysis;
