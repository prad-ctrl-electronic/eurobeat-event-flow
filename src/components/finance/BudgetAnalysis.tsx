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

// Sample budget data based on the CSV file
const budgetData = [
  {
    id: "1",
    category: "Venue",
    description: "Main Hall Rental",
    planned: 15000,
    actual: 16200,
    variance: -1200,
    notes: "Price increase due to extended hours"
  },
  {
    id: "2",
    category: "Technical",
    description: "Sound System",
    planned: 8500,
    actual: 8500,
    variance: 0,
    notes: "As per quote"
  },
  {
    id: "3",
    category: "Technical",
    description: "Lighting Equipment",
    planned: 6800,
    actual: 7200,
    variance: -400,
    notes: "Added extra fixtures"
  },
  {
    id: "4",
    category: "Artists",
    description: "Headliner Fee",
    planned: 25000,
    actual: 25000,
    variance: 0,
    notes: "Contract fulfilled"
  },
  {
    id: "5",
    category: "Artists",
    description: "Supporting Acts",
    planned: 12000,
    actual: 10800,
    variance: 1200,
    notes: "One act canceled, partial refund"
  },
  {
    id: "6",
    category: "Marketing",
    description: "Social Media Campaign",
    planned: 5000,
    actual: 6250,
    variance: -1250,
    notes: "Added extra promotion week"
  },
  {
    id: "7",
    category: "Staff",
    description: "Security Personnel",
    planned: 4500,
    actual: 4950,
    variance: -450,
    notes: "Added 3 extra guards"
  },
  {
    id: "8",
    category: "Staff",
    description: "Bar Staff",
    planned: 3800,
    actual: 3800,
    variance: 0,
    notes: "As planned"
  },
  {
    id: "9",
    category: "Permits",
    description: "Alcohol License",
    planned: 1200,
    actual: 1200,
    variance: 0,
    notes: "Standard fee"
  },
  {
    id: "10",
    category: "Miscellaneous",
    description: "Insurance",
    planned: 2800,
    actual: 2800,
    variance: 0,
    notes: "Annual policy"
  }
];

// Revenue data
const revenueData = [
  {
    id: "1",
    category: "Ticket Sales",
    description: "Pre-sale Tickets",
    planned: 45000,
    actual: 48200,
    variance: 3200,
    notes: "Higher than expected sales"
  },
  {
    id: "2",
    category: "Ticket Sales",
    description: "Door Sales",
    planned: 15000,
    actual: 12800,
    variance: -2200,
    notes: "Bad weather affected walk-ins"
  },
  {
    id: "3",
    category: "Bar",
    description: "Drink Sales",
    planned: 35000,
    actual: 42500,
    variance: 7500,
    notes: "Higher consumption than projected"
  },
  {
    id: "4",
    category: "Merchandise",
    description: "Event Merchandise",
    planned: 8000,
    actual: 9400,
    variance: 1400,
    notes: "New t-shirt design sold well"
  },
  {
    id: "5",
    category: "Sponsorships",
    description: "Main Sponsor",
    planned: 20000,
    actual: 20000,
    variance: 0,
    notes: "Contract fulfilled"
  }
];

interface CostItem {
  id: string;
  category: string;
  description: string;
  planned: number;
  actual: number;
  variance: number;
  notes: string;
}

interface RevenueItem {
  id: string;
  category: string;
  description: string;
  planned: number;
  actual: number;
  variance: number;
  notes: string;
}

const BudgetAnalysis: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"costs" | "revenue" | "summary" | "add-cost" | "add-revenue">("costs");
  
  const [newCostItem, setNewCostItem] = useState<Partial<CostItem>>({
    category: "",
    description: "",
    planned: 0,
    actual: 0,
    notes: ""
  });
  
  const [newRevenueItem, setNewRevenueItem] = useState<Partial<RevenueItem>>({
    category: "",
    description: "",
    planned: 0,
    actual: 0,
    notes: ""
  });
  
  const filteredCosts = budgetData.filter(
    (item) =>
      (filterCategory === "all" || item.category === filterCategory) &&
      (item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredRevenue = revenueData.filter(
    (item) =>
      (filterCategory === "all" || item.category === filterCategory) &&
      (item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPlannedCost = budgetData.reduce((sum, item) => sum + item.planned, 0);
  const totalActualCost = budgetData.reduce((sum, item) => sum + item.actual, 0);
  const totalCostVariance = budgetData.reduce((sum, item) => sum + item.variance, 0);
  
  const totalPlannedRevenue = revenueData.reduce((sum, item) => sum + item.planned, 0);
  const totalActualRevenue = revenueData.reduce((sum, item) => sum + item.actual, 0);
  const totalRevenueVariance = revenueData.reduce((sum, item) => sum + item.variance, 0);
  
  const plannedProfit = totalPlannedRevenue - totalPlannedCost;
  const actualProfit = totalActualRevenue - totalActualCost;
  const profitVariance = totalRevenueVariance - totalCostVariance;
  
  const profitMarginPlanned = ((plannedProfit / totalPlannedRevenue) * 100).toFixed(2);
  const profitMarginActual = ((actualProfit / totalActualRevenue) * 100).toFixed(2);
  
  const uniqueCategories = [...new Set([
    ...budgetData.map(item => item.category),
    ...revenueData.map(item => item.category)
  ])];
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2 
    }).format(amount);
  };

  const getVarianceClass = (variance: number) => {
    return variance < 0 
      ? "text-red-500" 
      : variance > 0 
        ? "text-green-500" 
        : "text-muted-foreground";
  };

  const handleCostChange = (field: keyof CostItem, value: any) => {
    setNewCostItem(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'planned' || field === 'actual') {
        const planned = field === 'planned' ? parseFloat(value) || 0 : parseFloat(prev.planned as any) || 0;
        const actual = field === 'actual' ? parseFloat(value) || 0 : parseFloat(prev.actual as any) || 0;
        updated.variance = planned - actual;
      }
      
      return updated;
    });
  };

  const handleRevenueChange = (field: keyof RevenueItem, value: any) => {
    setNewRevenueItem(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'planned' || field === 'actual') {
        const planned = field === 'planned' ? parseFloat(value) || 0 : parseFloat(prev.planned as any) || 0;
        const actual = field === 'actual' ? parseFloat(value) || 0 : parseFloat(prev.actual as any) || 0;
        updated.variance = planned - actual;
      }
      
      return updated;
    });
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
      notes: ""
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
      notes: ""
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
        
        {(viewMode === "costs" || viewMode === "revenue") && (
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative min-w-[200px]">
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
            totalActualCost={totalActualCost} 
            totalCostVariance={totalCostVariance}
            budgetDataLength={budgetData.length}
            formatCurrency={formatCurrency}
            getVarianceClass={getVarianceClass}
            onAddCostClick={() => setViewMode("add-cost")}
          />
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <RevenueAnalysisTable
            filteredRevenue={filteredRevenue}
            totalActualRevenue={totalActualRevenue}
            totalRevenueVariance={totalRevenueVariance}
            revenueDataLength={revenueData.length}
            formatCurrency={formatCurrency}
            getVarianceClass={getVarianceClass}
            onAddRevenueClick={() => setViewMode("add-revenue")}
          />
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <ProfitLossSummary
            totalActualRevenue={totalActualRevenue}
            totalActualCost={totalActualCost}
            actualProfit={actualProfit}
            profitMarginActual={profitMarginActual}
            totalPlannedRevenue={totalPlannedRevenue}
            totalRevenueVariance={totalRevenueVariance}
            totalPlannedCost={totalPlannedCost}
            totalCostVariance={totalCostVariance}
            profitVariance={profitVariance}
            formatCurrency={formatCurrency}
            getVarianceClass={getVarianceClass}
          />
        </TabsContent>

        <TabsContent value="add-cost" className="mt-6">
          <AddCostForm
            newCostItem={newCostItem}
            handleCostChange={handleCostChange}
            submitCostItem={submitCostItem}
            onCancel={() => setViewMode("costs")}
          />
        </TabsContent>

        <TabsContent value="add-revenue" className="mt-6">
          <AddRevenueForm
            newRevenueItem={newRevenueItem}
            handleRevenueChange={handleRevenueChange}
            submitRevenueItem={submitRevenueItem}
            onCancel={() => setViewMode("revenue")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetAnalysis;
