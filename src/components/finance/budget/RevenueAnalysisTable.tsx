
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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueItem } from "./budgetData";
import { ActionButtons } from "@/components/ui/action-buttons";
import { toast } from "sonner";

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
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Record<string, any>>({});

  const handleEdit = (id: string) => {
    const item = filteredRevenue.find(revenue => revenue.id === id);
    if (item) {
      setEditedValues({
        ...editedValues,
        [id]: { ...item }
      });
      setEditingItemId(id);
    }
  };

  const handleSave = (id: string) => {
    // In a real app, this would save to the database
    toast.success(`Changes to revenue item ${id} saved successfully`);
    setEditingItemId(null);
  };

  const handleDelete = (id: string) => {
    toast.info(`Delete functionality for revenue item ${id} will be implemented soon`);
  };

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
                <TableHead>Actions</TableHead>
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
                    <TableCell>
                      <ActionButtons
                        onEdit={() => handleEdit(item.id)}
                        onSave={() => handleSave(item.id)}
                        onDelete={() => handleDelete(item.id)}
                        isEditing={editingItemId === item.id}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
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
