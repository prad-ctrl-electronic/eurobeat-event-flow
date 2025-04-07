import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { RevenueItem } from "./types";

export interface RevenueAnalysisTableProps {
  filteredRevenues: RevenueItem[];
  totalActualRevenue: number;
  totalRevenueVariance: number;
  revenueDataLength: number;
  formatCurrency: (amount: number) => string;
  getVarianceClass: (variance: number) => string;
  onAddRevenueClick: () => void;
}

const RevenueAnalysisTable: React.FC<RevenueAnalysisTableProps> = ({
  filteredRevenues,
  totalActualRevenue,
  totalRevenueVariance,
  revenueDataLength,
  formatCurrency,
  getVarianceClass,
  onAddRevenueClick
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {filteredRevenues.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Planned (€)</TableHead>
                <TableHead className="text-right">Actual (€)</TableHead>
                <TableHead className="text-right">Variance (€)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRevenues.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.planned)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.actual)}</TableCell>
                  <TableCell className={`text-right ${getVarianceClass(item.variance)}`}>
                    {formatCurrency(item.variance)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-medium">
                <TableCell colSpan={3} className="text-right">Total Revenue</TableCell>
                <TableCell className="text-right">{formatCurrency(totalActualRevenue)}</TableCell>
                <TableCell className={`text-right ${getVarianceClass(totalRevenueVariance)}`}>
                  {formatCurrency(totalRevenueVariance)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <p className="text-muted-foreground mb-4">No revenue data available for the selected filters</p>
            <Button onClick={onAddRevenueClick} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Revenue Item
            </Button>
          </div>
        )}
      </CardContent>
      {filteredRevenues.length > 0 && (
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredRevenues.length} of {revenueDataLength} revenue items
          </div>
          <Button onClick={onAddRevenueClick} size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Revenue Item
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RevenueAnalysisTable;
