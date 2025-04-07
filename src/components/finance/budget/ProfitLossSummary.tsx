
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, BarChart3 } from "lucide-react";

interface ProfitLossSummaryProps {
  totalActualRevenue: number;
  totalActualCost: number;
  actualProfit: number;
  profitMarginActual: string;
  totalPlannedRevenue: number;
  totalRevenueVariance: number;
  totalPlannedCost: number;
  totalCostVariance: number;
  profitVariance: number;
  formatCurrency: (amount: number) => string;
  getVarianceClass: (variance: number) => string;
}

const ProfitLossSummary: React.FC<ProfitLossSummaryProps> = ({
  totalActualRevenue,
  totalActualCost,
  actualProfit,
  profitMarginActual,
  totalPlannedRevenue,
  totalRevenueVariance,
  totalPlannedCost,
  totalCostVariance,
  profitVariance,
  formatCurrency,
  getVarianceClass
}) => {
  return (
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
  );
};

export default ProfitLossSummary;
