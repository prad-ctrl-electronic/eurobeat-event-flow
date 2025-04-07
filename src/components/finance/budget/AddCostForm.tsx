
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CostItem {
  id?: string;
  category: string;
  description: string;
  planned: number;
  actual: number;
  variance?: number;
  notes: string;
}

interface AddCostFormProps {
  newCostItem: Partial<CostItem>;
  handleCostChange: (field: keyof CostItem, value: any) => void;
  submitCostItem: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const AddCostForm: React.FC<AddCostFormProps> = ({
  newCostItem,
  handleCostChange,
  submitCostItem,
  onCancel
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Cost Item</CardTitle>
        <CardDescription>Enter details for a new budget cost item</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submitCostItem} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost-category">Category</Label>
              <Select 
                value={newCostItem.category} 
                onValueChange={(value) => handleCostChange('category', value)}
                required
              >
                <SelectTrigger id="cost-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Venue">Venue</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Artists">Artists</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="Permits">Permits</SelectItem>
                  <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost-description">Description</Label>
              <Input 
                id="cost-description" 
                placeholder="e.g. Sound System Rental"
                value={newCostItem.description}
                onChange={(e) => handleCostChange('description', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost-planned">Planned Amount (€)</Label>
              <Input 
                id="cost-planned"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newCostItem.planned || ''}
                onChange={(e) => handleCostChange('planned', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost-actual">Actual Amount (€)</Label>
              <Input 
                id="cost-actual"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newCostItem.actual || ''}
                onChange={(e) => handleCostChange('actual', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost-variance">Variance (€)</Label>
              <Input 
                id="cost-variance"
                value={newCostItem.variance !== undefined ? newCostItem.variance : ''}
                className={`${newCostItem.variance !== undefined ? 
                  (newCostItem.variance < 0 ? "text-red-500" : newCostItem.variance > 0 ? "text-green-500" : "text-muted-foreground") 
                  : ''}`}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost-related-event">Related Event</Label>
              <Select>
                <SelectTrigger id="cost-related-event">
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="techno-fusion">Techno Fusion Festival</SelectItem>
                  <SelectItem value="bass-nation">Bass Nation</SelectItem>
                  <SelectItem value="electronica">Electronica Showcase</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="cost-notes">Notes</Label>
              <Textarea 
                id="cost-notes"
                placeholder="Add any additional details about this cost item"
                value={newCostItem.notes || ''}
                onChange={(e) => handleCostChange('notes', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit">Save Cost Item</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCostForm;
