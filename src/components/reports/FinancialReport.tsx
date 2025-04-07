
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, Download, Printer, ArrowUpDown, Filter } from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { formatCurrency, getVarianceClass } from "@/components/finance/budget/budgetData";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// Import sample data
import { budgetData, revenueData, calculateSummary } from "@/components/finance/budget/budgetData";

// Sample invoice data from CSV
const invoiceData = [
  {
    id: "INV-001",
    supplier: "Project C AB",
    invoiceNumber: "PCA/I24-000164",
    issueDate: "2024-10-11",
    dueDate: "2024-10-18",
    amount: 600,
    currency: "EUR",
    status: "Paid",
    category: "Teletech",
    comment: "Booking fee for the artist Nur Jaber"
  },
  {
    id: "INV-002",
    supplier: "Sometimescreative GmbH",
    invoiceNumber: "RE2024015",
    issueDate: "2024-11-01",
    dueDate: "2024-11-15",
    amount: 5000,
    currency: "EUR",
    status: "Paid",
    category: "Teletech",
    comment: "Digital marketing"
  },
  {
    id: "INV-003",
    supplier: "DAREKRADIO Dariusz Przepióra",
    invoiceNumber: "953/10/2024",
    issueDate: "2024-10-22",
    dueDate: "2024-10-31",
    amount: 1402.20,
    currency: "PLN",
    status: "Paid",
    category: "Burn Warsaw",
    comment: "Radio"
  },
  {
    id: "INV-004",
    supplier: "Luke Slater Productions Ltd.",
    invoiceNumber: "LSP-2024850",
    issueDate: "2024-11-08",
    dueDate: "2024-11-08",
    amount: 6500,
    currency: "EUR",
    status: "Paid",
    category: "Boiler room Warsaw",
    comment: "Artists payment"
  }
];

// Process data for charts
const processExpensesByCategory = () => {
  const categoryMap: Record<string, number> = {};
  
  budgetData.forEach(item => {
    if (!categoryMap[item.category]) {
      categoryMap[item.category] = 0;
    }
    categoryMap[item.category] += item.actual;
  });
  
  return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
};

const processRevenueBySources = () => {
  const sourceMap: Record<string, number> = {};
  
  revenueData.forEach(item => {
    if (!sourceMap[item.category]) {
      sourceMap[item.category] = 0;
    }
    sourceMap[item.category] += item.actual;
  });
  
  return Object.entries(sourceMap).map(([name, value]) => ({ name, value }));
};

const processInvoicesByCategory = () => {
  const categoryMap: Record<string, number> = {};
  
  invoiceData.forEach(item => {
    if (!categoryMap[item.category]) {
      categoryMap[item.category] = 0;
    }
    // Convert to EUR for consistency
    const amount = item.currency === "PLN" ? item.amount / 4.35 : item.amount;
    categoryMap[item.category] += amount;
  });
  
  return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
};

// Current time period data
const currentPeriod = {
  start: "2024-10-01",
  end: "2024-11-30",
  label: "Oct-Nov 2024"
};

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const FinancialReport: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState("summary");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const summary = calculateSummary();
  const expensesByCategory = processExpensesByCategory();
  const revenueBySource = processRevenueBySources();
  const invoicesByCategory = processInvoicesByCategory();
  
  // Calculate KPIs
  const totalRevenue = summary.totalActualRevenue;
  const totalExpenses = summary.totalActualCost;
  const netProfit = summary.actualProfit;
  const profitMargin = parseFloat(summary.profitMarginActual);
  
  const downloadReport = () => {
    // Compile all financial data
    const reportData = {
      reportTitle: "Comprehensive Financial Report",
      generatedDate: new Date().toISOString(),
      period: currentPeriod,
      summary: {
        totalRevenue,
        totalExpenses,
        netProfit,
        profitMargin
      },
      budgetComparison: {
        revenue: {
          planned: summary.totalPlannedRevenue,
          actual: summary.totalActualRevenue,
          variance: summary.totalRevenueVariance
        },
        expenses: {
          planned: summary.totalPlannedCost,
          actual: summary.totalActualCost,
          variance: summary.totalCostVariance
        },
        profit: {
          planned: summary.plannedProfit,
          actual: summary.actualProfit,
          variance: summary.profitVariance
        }
      },
      detailedBudget: {
        expenses: budgetData,
        revenue: revenueData
      },
      invoices: invoiceData
    };
    
    // Convert to JSON
    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const printReport = () => {
    window.print();
  };
  
  return (
    <div className="space-y-6 print:space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Financial Report</h2>
          <p className="text-muted-foreground">Period: {currentPeriod.label}</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Categories</h4>
                <div className="grid gap-2">
                  {['Venue', 'Technical', 'Artists', 'Marketing', 'Staff', 'Permits', 'Miscellaneous'].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category}`} 
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => {
                          setSelectedCategories(
                            checked 
                              ? [...selectedCategories, category]
                              : selectedCategories.filter(c => c !== category)
                          );
                        }}
                      />
                      <Label htmlFor={`category-${category}`}>{category}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={printReport} variant="outline" size="sm" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button onClick={downloadReport} size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className={`text-xs ${summary.totalRevenueVariance >= 0 ? "text-green-500" : "text-red-500"}`}>
              {summary.totalRevenueVariance >= 0 ? "+" : ""}{formatCurrency(summary.totalRevenueVariance)} vs Budget
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className={`text-xs ${summary.totalCostVariance >= 0 ? "text-green-500" : "text-red-500"}`}>
              {summary.totalCostVariance >= 0 ? "+" : ""}{formatCurrency(summary.totalCostVariance)} vs Budget
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(netProfit)}</div>
            <p className={`text-xs ${summary.profitVariance >= 0 ? "text-green-500" : "text-red-500"}`}>
              {summary.profitVariance >= 0 ? "+" : ""}{formatCurrency(summary.profitVariance)} vs Budget
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profitMargin}%</div>
            <p className={`text-xs ${parseFloat(summary.profitMarginPlanned) <= profitMargin ? "text-green-500" : "text-red-500"}`}>
              {parseFloat(summary.profitMarginPlanned) <= profitMargin ? "+" : ""}
              {(profitMargin - parseFloat(summary.profitMarginPlanned)).toFixed(2)}% vs Budget
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/40">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">Revenue vs Expenses</CardTitle>
                <CardDescription>Comparison of actual revenue and expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Revenue', value: totalRevenue, planned: summary.totalPlannedRevenue },
                        { name: 'Expenses', value: totalExpenses, planned: summary.totalPlannedCost },
                        { name: 'Profit', value: netProfit, planned: summary.plannedProfit }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar name="Actual" dataKey="value" fill="#0088FE" />
                      <Bar name="Planned" dataKey="planned" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Budget Summary</CardTitle>
                <CardDescription>Planned vs actual budget figures</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Planned</TableHead>
                      <TableHead className="text-right">Actual</TableHead>
                      <TableHead className="text-right">Variance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Revenue</TableCell>
                      <TableCell className="text-right">{formatCurrency(summary.totalPlannedRevenue)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(summary.totalActualRevenue)}</TableCell>
                      <TableCell className={`text-right ${getVarianceClass(summary.totalRevenueVariance)}`}>
                        {summary.totalRevenueVariance >= 0 ? "+" : ""}{formatCurrency(summary.totalRevenueVariance)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Expenses</TableCell>
                      <TableCell className="text-right">{formatCurrency(summary.totalPlannedCost)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(summary.totalActualCost)}</TableCell>
                      <TableCell className={`text-right ${getVarianceClass(-summary.totalCostVariance)}`}>
                        {summary.totalCostVariance >= 0 ? "+" : ""}{formatCurrency(summary.totalCostVariance)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="font-medium">
                      <TableCell>Profit</TableCell>
                      <TableCell className="text-right">{formatCurrency(summary.plannedProfit)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(summary.actualProfit)}</TableCell>
                      <TableCell className={`text-right ${getVarianceClass(summary.profitVariance)}`}>
                        {summary.profitVariance >= 0 ? "+" : ""}{formatCurrency(summary.profitVariance)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="font-medium">
                      <TableCell>Profit Margin</TableCell>
                      <TableCell className="text-right">{summary.profitMarginPlanned}%</TableCell>
                      <TableCell className="text-right">{summary.profitMarginActual}%</TableCell>
                      <TableCell className={`text-right ${parseFloat(summary.profitMarginActual) >= parseFloat(summary.profitMarginPlanned) ? "text-green-500" : "text-red-500"}`}>
                        {(parseFloat(summary.profitMarginActual) - parseFloat(summary.profitMarginPlanned)).toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">Revenue by Source</CardTitle>
                <CardDescription>Distribution of revenue across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueBySource}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {revenueBySource.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Details</CardTitle>
                <CardDescription>Breakdown of revenue sources</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Planned</TableHead>
                      <TableHead className="text-right">Actual</TableHead>
                      <TableHead className="text-right">Variance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.planned)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.actual)}</TableCell>
                        <TableCell className={`text-right ${getVarianceClass(item.variance)}`}>
                          {item.variance >= 0 ? "+" : ""}{formatCurrency(item.variance)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="expenses">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">Expenses by Category</CardTitle>
                <CardDescription>Distribution of expenses across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expense Details</CardTitle>
                <CardDescription>Breakdown of expense categories</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Planned</TableHead>
                      <TableHead className="text-right">Actual</TableHead>
                      <TableHead className="text-right">Variance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgetData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.planned)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.actual)}</TableCell>
                        <TableCell className={`text-right ${getVarianceClass(item.variance)}`}>
                          {item.variance >= 0 ? "+" : ""}{formatCurrency(item.variance)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoices</CardTitle>
              <CardDescription>List of all invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Comment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceData.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.supplier}</TableCell>
                      <TableCell>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{invoice.category}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(invoice.amount)} {invoice.currency}
                      </TableCell>
                      <TableCell>
                        <Badge variant={invoice.status === "Paid" ? "default" : "outline"}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={invoice.comment}>
                        {invoice.comment}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="pt-6 print:hidden">
        <Button onClick={downloadReport} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Download Complete Financial Report
        </Button>
      </CardFooter>
    </div>
  );
};

export default FinancialReport;
