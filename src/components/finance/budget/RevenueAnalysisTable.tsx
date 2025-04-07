
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
import { RevenueItem } from "./budgetData";
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
  const [editedValues, setEditedValues] = useState<Record<string, RevenueItem>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

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

  const handleChange = (id: string, field: keyof RevenueItem, value: any) => {
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
    toast.success(`Changes to revenue item "${editedValues[id].description}" saved successfully`);
    setEditingItemId(null);
  };

  const handleCancel = () => {
    setEditingItemId(null);
    toast.info("Edit cancelled");
  };

  const handleDelete = (id: string) => {
    setSelectedItemId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedItemId) {
      const itemToDelete = filteredRevenue.find(item => item.id === selectedItemId);
      // In a real app, you would delete from database
      toast.success(`Revenue item "${itemToDelete?.description}" deleted successfully`);
      setShowDeleteDialog(false);
      setSelectedItemId(null);
    }
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
                        onCancel={handleCancel}
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the revenue item
              {selectedItemId && filteredRevenue.find(item => item.id === selectedItemId) 
                ? ` "${filteredRevenue.find(item => item.id === selectedItemId)?.description}"` 
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

export default RevenueAnalysisTable;
