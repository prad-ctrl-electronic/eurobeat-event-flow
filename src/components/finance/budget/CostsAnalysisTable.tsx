
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
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CostItem } from "./budgetData";
import { ActionButtons } from "@/components/ui/action-buttons";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Record<string, CostItem>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    const item = filteredCosts.find(cost => cost.id === id);
    if (item) {
      setEditedValues({
        ...editedValues,
        [id]: { ...item }
      });
      setEditingItemId(id);
    }
  };

  const handleChange = (id: string, field: keyof CostItem, value: any) => {
    setEditedValues({
      ...editedValues,
      [id]: {
        ...editedValues[id],
        [field]: field === 'planned' || field === 'actual' ? Number(value) : value,
        variance: field === 'planned' ? Number(value) - editedValues[id].actual : 
                 field === 'actual' ? editedValues[id].planned - Number(value) : 
                 editedValues[id].variance
      }
    });
  };

  const handleSave = (id: string) => {
    // In a real app, this would save to a database
    // For now, we'll just show a success toast
    toast.success(`Changes to cost item "${editedValues[id].description}" saved successfully`);
    setEditingItemId(null);
  };

  const handleDelete = (id: string) => {
    setSelectedItemId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedItemId) {
      const itemToDelete = filteredCosts.find(item => item.id === selectedItemId);
      // In a real app, you would delete from database
      toast.success(`Cost item "${itemToDelete?.description}" deleted successfully`);
      setShowDeleteDialog(false);
      setSelectedItemId(null);
    }
  };

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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCosts.length > 0 ? (
                filteredCosts.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/60">
                    <TableCell className="font-medium">
                      {editingItemId === item.id ? (
                        <Input 
                          value={editedValues[item.id].category} 
                          onChange={(e) => handleChange(item.id, 'category', e.target.value)}
                        />
                      ) : (
                        item.category
                      )}
                    </TableCell>
                    <TableCell>
                      {editingItemId === item.id ? (
                        <Input 
                          value={editedValues[item.id].description} 
                          onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                        />
                      ) : (
                        item.description
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingItemId === item.id ? (
                        <Input 
                          type="number"
                          value={editedValues[item.id].planned} 
                          onChange={(e) => handleChange(item.id, 'planned', e.target.value)}
                          className="w-24 ml-auto"
                        />
                      ) : (
                        formatCurrency(item.planned)
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingItemId === item.id ? (
                        <Input 
                          type="number"
                          value={editedValues[item.id].actual} 
                          onChange={(e) => handleChange(item.id, 'actual', e.target.value)}
                          className="w-24 ml-auto"
                        />
                      ) : (
                        formatCurrency(item.actual)
                      )}
                    </TableCell>
                    <TableCell className={`text-right ${getVarianceClass(
                      editingItemId === item.id ? editedValues[item.id].variance : item.variance
                    )}`}>
                      {editingItemId === item.id 
                        ? (editedValues[item.id].variance > 0 ? "+" : "") + formatCurrency(editedValues[item.id].variance)
                        : (item.variance > 0 ? "+" : "") + formatCurrency(item.variance)
                      }
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {editingItemId === item.id ? (
                        <Input 
                          value={editedValues[item.id].notes} 
                          onChange={(e) => handleChange(item.id, 'notes', e.target.value)}
                        />
                      ) : (
                        item.notes
                      )}
                    </TableCell>
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
                    No budget items found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the cost item
              {selectedItemId && filteredCosts.find(item => item.id === selectedItemId) 
                ? ` "${filteredCosts.find(item => item.id === selectedItemId)?.description}"` 
                : ""}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default CostsAnalysisTable;
