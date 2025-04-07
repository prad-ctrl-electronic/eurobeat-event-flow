
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateSummary, costsData, revenueData } from "@/components/finance/budget/budgetData";
import { formatCurrency } from "@/components/finance/budget/budgetCalculations";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEvent } from "@/contexts/EventContext";

interface CategoryTotals {
  category: string;
  plannedCost: number;
  actualCost: number;
  plannedRevenue: number;
  actualRevenue: number;
}

const FinancialReport: React.FC = () => {
  const { selectedEventId, events } = useEvent();

  const filteredCosts = selectedEventId === "all" 
    ? costsData 
    : costsData.filter(cost => cost.event === selectedEventId);

  const filteredRevenues = selectedEventId === "all" 
    ? revenueData 
    : revenueData.filter(revenue => revenue.event === selectedEventId);

  // Calculate summary
  const summary = calculateSummary(filteredCosts, filteredRevenues);

  // Calculate category totals for visualization
  const getCategoryData = (): CategoryTotals[] => {
    const categories = new Set([
      ...filteredCosts.map(cost => cost.category),
      ...filteredRevenues.map(revenue => revenue.category)
    ]);

    return Array.from(categories).map(category => {
      const categoryCosts = filteredCosts.filter(cost => cost.category === category);
      const categoryRevenues = filteredRevenues.filter(revenue => revenue.category === category);

      const plannedCost = categoryCosts.reduce((sum, cost) => sum + cost.planned, 0);
      const actualCost = categoryCosts.reduce((sum, cost) => sum + cost.actual, 0);
      const plannedRevenue = categoryRevenues.reduce((sum, revenue) => sum + revenue.planned, 0);
      const actualRevenue = categoryRevenues.reduce((sum, revenue) => sum + revenue.actual, 0);

      return {
        category,
        plannedCost,
        actualCost,
        plannedRevenue,
        actualRevenue
      };
    });
  };

  const categoryData = getCategoryData();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Report</CardTitle>
          <CardDescription>
            Financial summary for {selectedEventId === "all" 
              ? "all events" 
              : events.find(e => e.id === selectedEventId)?.name || "unknown event"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{formatCurrency(summary.totalCost)}</div>
                <p className="text-xs text-muted-foreground">Total Cost</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className={`text-2xl font-bold ${summary.profit < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {formatCurrency(summary.profit)}
                </div>
                <p className="text-xs text-muted-foreground">Profit/Loss</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="bar-chart">
            <TabsList className="mb-4">
              <TabsTrigger value="bar-chart">Category Breakdown</TabsTrigger>
              <TabsTrigger value="actuals">Planned vs. Actual</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bar-chart">
              <div className="h-[400px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="plannedRevenue" name="Planned Revenue" fill="#8884d8" />
                    <Bar dataKey="actualRevenue" name="Actual Revenue" fill="#4c1d95" />
                    <Bar dataKey="plannedCost" name="Planned Cost" fill="#fca5a5" />
                    <Bar dataKey="actualCost" name="Actual Cost" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="actuals">
              <div className="h-[400px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: "Revenue",
                        planned: summary.plannedRevenue,
                        actual: summary.actualRevenue,
                      },
                      {
                        name: "Cost",
                        planned: summary.plannedCost,
                        actual: summary.actualCost,
                      },
                      {
                        name: "Profit",
                        planned: summary.plannedProfit,
                        actual: summary.profit,
                      },
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="planned" name="Planned" fill="#8884d8" />
                    <Bar dataKey="actual" name="Actual" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReport;
