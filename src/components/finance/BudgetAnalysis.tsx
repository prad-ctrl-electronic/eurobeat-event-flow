import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileDown, Printer, Search, PieChart, BarChart3, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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
          <Card className="card-gradient">
            <CardHeader className="flex flex-row justify-between">
              <div>
                <CardTitle>Event Cost Analysis</CardTitle>
                <CardDescription>Planned vs. actual costs breakdown</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setViewMode("add-cost")}>
                <Plus className="h-4 w-4 mr-2" /> Add Cost
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableCaption>
                    <div className="flex justify-between items-center px-4">
                      <span>Showing {filteredCosts.length} of {budgetData.length} budget items</span>
                      <span className="font-medium">
                        Total Cost: {formatCurrency(totalActualCost)} 
                        <span className={getVarianceClass(totalCostVariance)}>
                          {" "}{totalCostVariance > 0 ? "+" : ""}{formatCurrency(totalCostVariance)}
                        </span>
                      </span>
                    </div>
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Planned (€)</TableHead>
                      <TableHead className="text-right">Actual (€)</TableHead>
                      <TableHead className="text-right">Variance (€)</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCosts.length > 0 ? (
                      filteredCosts.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/60">
                          <TableCell className="font-medium">{item.category}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.planned)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.actual)}</TableCell>
                          <TableCell className={`text-right ${getVarianceClass(item.variance)}`}>
                            {item.variance > 0 ? "+" : ""}{formatCurrency(item.variance)}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{item.notes}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          No budget items found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <Card className="card-gradient">
            <CardHeader className="flex flex-row justify-between">
              <div>
                <CardTitle>Event Revenue Analysis</CardTitle>
                <CardDescription>Planned vs. actual revenue breakdown</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setViewMode("add-revenue")}>
                <Plus className="h-4 w-4 mr-2" /> Add Revenue
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableCaption>
                    <div className="flex justify-between items-center px-4">
                      <span>Showing {filteredRevenue.length} of {revenueData.length} revenue items</span>
                      <span className="font-medium">
                        Total Revenue: {formatCurrency(totalActualRevenue)} 
                        <span className={getVarianceClass(totalRevenueVariance)}>
                          {" "}{totalRevenueVariance > 0 ? "+" : ""}{formatCurrency(totalRevenueVariance)}
                        </span>
                      </span>
                    </div>
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Planned (€)</TableHead>
                      <TableHead className="text-right">Actual (€)</TableHead>
                      <TableHead className="text-right">Variance (€)</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRevenue.length > 0 ? (
                      filteredRevenue.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/60">
                          <TableCell className="font-medium">{item.category}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.planned)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.actual)}</TableCell>
                          <TableCell className={`text-right ${getVarianceClass(item.variance)}`}>
                            {item.variance > 0 ? "+" : ""}{formatCurrency(item.variance)}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{item.notes}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          No revenue items found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Profit & Loss Summary</CardTitle>
              <CardDescription>Event financial performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <PieChart className="h-6 w-6 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Financial Summary</h3>
                    <BarChart3 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  
                  <div className="space-y-3 rounded-md border p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Revenue:</span>
                      <span className="font-medium">{formatCurrency(totalActualRevenue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Costs:</span>
                      <span className="font-medium">{formatCurrency(totalActualCost)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between items-center">
                      <span className="font-medium">Net Profit:</span>
                      <span className={`font-bold ${actualProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {formatCurrency(actualProfit)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Profit Margin:</span>
                      <span className={`font-medium ${Number(profitMarginActual) >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {profitMarginActual}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Variance Analysis</h3>
                  <div className="space-y-3 rounded-md border p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Planned Revenue:</span>
                      <span className="font-medium">{formatCurrency(totalPlannedRevenue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Revenue Variance:</span>
                      <span className={`font-medium ${getVarianceClass(totalRevenueVariance)}`}>
                        {totalRevenueVariance > 0 ? "+" : ""}{formatCurrency(totalRevenueVariance)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Planned Costs:</span>
                      <span className="font-medium">{formatCurrency(totalPlannedCost)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Cost Variance:</span>
                      <span className={`font-medium ${getVarianceClass(-totalCostVariance)}`}>
                        {totalCostVariance > 0 ? "-" : "+"}{formatCurrency(Math.abs(totalCostVariance))}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between items-center">
                      <span className="font-medium">Profit Variance:</span>
                      <span className={`font-bold ${getVarianceClass(profitVariance)}`}>
                        {profitVariance > 0 ? "+" : ""}{formatCurrency(profitVariance)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-cost" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Cost Item</CardTitle>
              <CardDescription>Enter details for a new budget cost item</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitCostItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cost-category">Category</Label>
                    <Select 
                      value={newCostItem.category} 
                      onValueChange={(value) => handleCostChange('category', value)}
                      required
                    >
                      <SelectTrigger id="cost-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Venue">Venue</SelectItem>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Artists">Artists</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                        <SelectItem value="Permits">Permits</SelectItem>
                        <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cost-description">Description</Label>
                    <Input 
                      id="cost-description" 
                      placeholder="e.g. Sound System Rental"
                      value={newCostItem.description}
                      onChange={(e) => handleCostChange('description', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cost-planned">Planned Amount (€)</Label>
                    <Input 
                      id="cost-planned"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newCostItem.planned || ''}
                      onChange={(e) => handleCostChange('planned', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cost-actual">Actual Amount (€)</Label>
                    <Input 
                      id="cost-actual"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newCostItem.actual || ''}
                      onChange={(e) => handleCostChange('actual', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cost-variance">Variance (€)</Label>
                    <Input 
                      id="cost-variance"
                      value={newCostItem.variance !== undefined ? newCostItem.variance : ''}
                      className={`${newCostItem.variance !== undefined ? getVarianceClass(newCostItem.variance) : ''}`}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cost-related-event">Related Event</Label>
                    <Select>
                      <SelectTrigger id="cost-related-event">
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="techno-fusion">Techno Fusion Festival</SelectItem>
                        <SelectItem value="bass-nation">Bass Nation</SelectItem>
                        <SelectItem value="electronica">Electronica Showcase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="cost-notes">Notes</Label>
                    <Textarea 
                      id="cost-notes"
                      placeholder="Add any additional details about this cost item"
                      value={newCostItem.notes || ''}
                      onChange={(e) => handleCostChange('notes', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => setViewMode("costs")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Cost Item</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-revenue" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Revenue Item</CardTitle>
              <CardDescription>Enter details for a new revenue stream</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitRevenueItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="revenue-category">Category</Label>
                    <Select 
                      value={newRevenueItem.category} 
                      onValueChange={(value) => handleRevenueChange('category', value)}
                      required
                    >
                      <SelectTrigger id="revenue-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ticket Sales">Ticket Sales</SelectItem>
                        <SelectItem value="Bar">Bar Sales</SelectItem>
                        <SelectItem value="Merchandise">Merchandise</SelectItem>
                        <SelectItem value="Sponsorships">Sponsorships</SelectItem>
                        <SelectItem value="Food">Food Sales</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenue-description">Description</Label>
                    <Input 
                      id="revenue-description" 
                      placeholder="e.g. Pre-sale Tickets"
                      value={newRevenueItem.description}
                      onChange={(e) => handleRevenueChange('description', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenue-planned">Planned Amount (€)</Label>
                    <Input 
                      id="revenue-planned"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newRevenueItem.planned || ''}
                      onChange={(e) => handleRevenueChange('planned', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenue-actual">Actual Amount (€)</Label>
                    <Input 
                      id="revenue-actual"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newRevenueItem.actual || ''}
                      onChange={(e) => handleRevenueChange('actual', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenue-variance">Variance (€)</Label>
                    <Input 
                      id="revenue-variance"
                      value={newRevenueItem.variance !== undefined ? newRevenueItem.variance : ''}
                      className={`${newRevenueItem.variance !== undefined ? getVarianceClass(newRevenueItem.variance) : ''}`}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenue-related-event">Related Event</Label>
                    <Select>
                      <SelectTrigger id="revenue-related-event">
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="techno-fusion">Techno Fusion Festival</SelectItem>
                        <SelectItem value="bass-nation">Bass Nation</SelectItem>
                        <SelectItem value="electronica">Electronica Showcase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="revenue-notes">Notes</Label>
                    <Textarea 
                      id="revenue-notes"
                      placeholder="Add any additional details about this revenue item"
                      value={newRevenueItem.notes || ''}
                      onChange={(e) => handleRevenueChange('notes', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => setViewMode("revenue")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Revenue Item</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetAnalysis;
