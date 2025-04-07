
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

interface RevenueItem {
  id: string;
  category: string;
  description: string;
  planned: number;
  actual: number;
  variance: number;
  notes: string;
}

interface RevenueAnalysisTableProps {
  filteredRevenue: RevenueItem[];
  totalActualRevenue: number;
  totalRevenueVariance: number;
  revenueDataLength: number;
  formatCurrency: (amount: number) => string;
  getVarianceClass: (variance: number) => string;
  onAddRevenueClick: () => void;
}

const RevenueAnalysisTable: React.FC<RevenueAnalysisTableProps> = ({
  filteredRevenue,
  totalActualRevenue,
  totalRevenueVariance,
  revenueDataLength,
  formatCurrency,
  getVarianceClass,
  onAddRevenueClick
}) => {
  return (
    <Card className="card-gradient">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Event Revenue Analysis</CardTitle>
          <CardDescription>Planned vs. actual revenue breakdown</CardDescription>
        </div>
        <Button variant="outline" onClick={onAddRevenueClick}>
          <Plus className="h-4 w-4 mr-2" /> Add Revenue
        </Button>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableCaption>
              <div className="flex justify-between items-center px-4">
                <span>Showing {filteredRevenue.length} of {revenueDataLength} revenue items</span>
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
  );
};

export default RevenueAnalysisTable;
