
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RevenueItem } from "./budgetData";

interface AddRevenueFormProps {
  newRevenueItem: Partial<RevenueItem>;
  handleRevenueChange: (field: keyof RevenueItem, value: any) => void;
  submitRevenueItem: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const AddRevenueForm: React.FC<AddRevenueFormProps> = ({
  newRevenueItem,
  handleRevenueChange,
  submitRevenueItem,
  onCancel
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Revenue Item</CardTitle>
        <CardDescription>Enter details for a new revenue stream</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submitRevenueItem} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="revenue-category">Category</Label>
              <Select 
                value={newRevenueItem.category} 
                onValueChange={(value) => handleRevenueChange('category', value)}
                required
              >
                <SelectTrigger id="revenue-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ticket Sales">Ticket Sales</SelectItem>
                  <SelectItem value="Bar">Bar Sales</SelectItem>
                  <SelectItem value="Merchandise">Merchandise</SelectItem>
                  <SelectItem value="Sponsorships">Sponsorships</SelectItem>
                  <SelectItem value="Food">Food Sales</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue-description">Description</Label>
              <Input 
                id="revenue-description" 
                placeholder="e.g. Pre-sale Tickets"
                value={newRevenueItem.description}
                onChange={(e) => handleRevenueChange('description', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue-planned">Planned Amount (€)</Label>
              <Input 
                id="revenue-planned"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newRevenueItem.planned || ''}
                onChange={(e) => handleRevenueChange('planned', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue-actual">Actual Amount (€)</Label>
              <Input 
                id="revenue-actual"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newRevenueItem.actual || ''}
                onChange={(e) => handleRevenueChange('actual', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue-variance">Variance (€)</Label>
              <Input 
                id="revenue-variance"
                value={newRevenueItem.variance !== undefined ? newRevenueItem.variance : ''}
                className={`${newRevenueItem.variance !== undefined ? 
                  (newRevenueItem.variance < 0 ? "text-red-500" : newRevenueItem.variance > 0 ? "text-green-500" : "text-muted-foreground") 
                  : ''}`}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue-related-event">Related Event</Label>
              <Select>
                <SelectTrigger id="revenue-related-event">
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
              <Label htmlFor="revenue-notes">Notes</Label>
              <Textarea 
                id="revenue-notes"
                placeholder="Add any additional details about this revenue item"
                value={newRevenueItem.notes || ''}
                onChange={(e) => handleRevenueChange('notes', e.target.value)}
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
            <Button type="submit">Save Revenue Item</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddRevenueForm;
