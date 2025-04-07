
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CostItem } from "./budgetData";

interface CostsAnalysisTableProps {
  filteredCosts: CostItem[];
  totalActualCost: number;
  totalCostVariance: number;
  budgetDataLength: number;
  formatCurrency: (amount: number) => string;
  getVarianceClass: (variance: number) => string;
  onAddCostClick: () => void;
}

const CostsAnalysisTable: React.FC<CostsAnalysisTableProps> = ({
  filteredCosts,
  totalActualCost,
  totalCostVariance,
  budgetDataLength,
  formatCurrency,
  getVarianceClass,
  onAddCostClick
}) => {
  return (
    <Card className="card-gradient">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Event Cost Analysis</CardTitle>
          <CardDescription>Planned vs. actual costs breakdown</CardDescription>
        </div>
        <Button variant="outline" onClick={onAddCostClick}>
          <Plus className="h-4 w-4 mr-2" /> Add Cost
        </Button>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableCaption>
              <div className="flex justify-between items-center px-4">
                <span>Showing {filteredCosts.length} of {budgetDataLength} budget items</span>
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
  );
};

export default CostsAnalysisTable;
