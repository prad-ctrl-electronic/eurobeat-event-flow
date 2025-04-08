import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Filter } from "lucide-react";
import { RevenueItem } from "./types";
import { Input } from "@/components/ui/input";
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

export interface RevenueAnalysisTableProps {
  filteredRevenues: RevenueItem[];
  totalActualRevenue: number;
  totalRevenueVariance: number;
  revenueDataLength: number;
  formatCurrency: (amount: number) => string;
  getVarianceClass: (variance: number) => string;
  onAddRevenueClick: () => void;
  onDeleteRevenue?: (revenueId: string) => void;
}

const RevenueAnalysisTable: React.FC<RevenueAnalysisTableProps> = ({
  filteredRevenues,
  totalActualRevenue,
  totalRevenueVariance,
  revenueDataLength,
  formatCurrency,
  getVarianceClass,
  onAddRevenueClick,
  onDeleteRevenue
}) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Record<string, RevenueItem>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    const item = filteredRevenues.find(revenue => revenue.id === id);
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
        [field]: field === 'planned' || field === 'actual' || field === 'vatPercent' 
          ? Number(value) 
          : value,
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
      const itemToDelete = filteredRevenues.find(item => item.id === selectedItemId);
      
      // Call the parent component's delete handler if provided
      if (onDeleteRevenue) {
        onDeleteRevenue(selectedItemId);
      }
      
      toast.success(`Revenue item "${itemToDelete?.description}" deleted successfully`);
      setShowDeleteDialog(false);
      setSelectedItemId(null);
    }
  };

  const handleExportData = () => {
    // In a real app, this would export data to CSV or Excel
    const dataStr = JSON.stringify(filteredRevenues, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'revenue-analysis.json';
    const linkElement = document.createElement('a');
    
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Revenue data exported successfully");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Revenue Analysis</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleExportData}
          >
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
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
                {filteredRevenues.some(item => item.vatPercent) && (
                  <TableHead className="text-right">VAT %</TableHead>
                )}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRevenues.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/60">
                  <TableCell>
                    {editingItemId === item.id ? (
                      <Input 
                        value={editedValues[item.id].category} 
                        onChange={(e) => handleChange(item.id, 'category', e.target.value)}
                      />
                    ) : (
                      <>
                        <Badge variant="outline">{item.category}</Badge>
                        {item.subcategory && (
                          <Badge variant="secondary" className="ml-2">
                            {item.subcategory}
                          </Badge>
                        )}
                      </>
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
                      ? formatCurrency(editedValues[item.id].variance)
                      : formatCurrency(item.variance)
                    }
                  </TableCell>
                  {filteredRevenues.some(item => item.vatPercent) && (
                    <TableCell className="text-right">
                      {editingItemId === item.id ? (
                        <Input 
                          type="number"
                          value={editedValues[item.id].vatPercent || 0} 
                          onChange={(e) => handleChange(item.id, 'vatPercent', e.target.value)}
                          className="w-20 ml-auto"
                        />
                      ) : (
                        item.vatPercent ? `${item.vatPercent}%` : '-'
                      )}
                    </TableCell>
                  )}
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
              ))}
              <TableRow className="font-medium">
                <TableCell colSpan={3} className="text-right">Total Revenue</TableCell>
                <TableCell className="text-right">{formatCurrency(totalActualRevenue)}</TableCell>
                <TableCell className={`text-right ${getVarianceClass(totalRevenueVariance)}`}>
                  {formatCurrency(totalRevenueVariance)}
                </TableCell>
                {filteredRevenues.some(item => item.vatPercent) && <TableCell />}
                <TableCell />
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the revenue item
              {selectedItemId && filteredRevenues.find(item => item.id === selectedItemId) 
                ? ` "${filteredRevenues.find(item => item.id === selectedItemId)?.description}"` 
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
