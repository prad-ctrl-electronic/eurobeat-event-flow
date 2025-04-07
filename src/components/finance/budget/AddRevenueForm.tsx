
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RevenueItem } from "./types";
import { useEvent } from "@/contexts/EventContext";
import { v4 as uuidv4 } from 'uuid';

interface AddRevenueFormProps {
  onSave: (newRevenue: RevenueItem) => void;
  onCancel?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AddRevenueForm: React.FC<AddRevenueFormProps> = ({
  onSave,
  onCancel,
  open,
  onOpenChange
}) => {
  const { events, selectedEventId } = useEvent();
  
  const [newRevenueItem, setNewRevenueItem] = useState<Partial<RevenueItem>>({
    category: "",
    subcategory: "",
    description: "",
    event: selectedEventId,
    planned: 0,
    actual: 0,
    variance: 0,
    variancePercentage: 0,
    notes: "",
    vatPercent: 21
  });

  const handleRevenueChange = (field: keyof RevenueItem, value: any) => {
    setNewRevenueItem(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'planned' || field === 'actual') {
        const planned = field === 'planned' ? parseFloat(value) || 0 : parseFloat(String(prev.planned)) || 0;
        const actual = field === 'actual' ? parseFloat(value) || 0 : parseFloat(String(prev.actual)) || 0;
        updated.variance = planned - actual;
        
        if (planned !== 0) {
          updated.variancePercentage = (updated.variance / planned) * 100;
        } else {
          updated.variancePercentage = 0;
        }
      }
      
      return updated;
    });
  };

  const submitRevenueItem = (e: React.FormEvent) => {
    e.preventDefault();
    const revenueItem: RevenueItem = {
      id: uuidv4(),
      category: newRevenueItem.category || "",
      subcategory: newRevenueItem.subcategory || "",
      description: newRevenueItem.description || "",
      event: newRevenueItem.event || selectedEventId,
      planned: Number(newRevenueItem.planned) || 0,
      actual: Number(newRevenueItem.actual) || 0,
      variance: Number(newRevenueItem.variance) || 0,
      variancePercentage: Number(newRevenueItem.variancePercentage) || 0,
      notes: newRevenueItem.notes || "",
      vatPercent: Number(newRevenueItem.vatPercent) || 21
    };
    
    onSave(revenueItem);
    
    // Reset form after submission
    setNewRevenueItem({
      category: "",
      subcategory: "",
      description: "",
      event: selectedEventId,
      planned: 0,
      actual: 0,
      variance: 0,
      variancePercentage: 0,
      notes: "",
      vatPercent: 21
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Revenue Item</CardTitle>
        <CardDescription>Enter details for a new budget revenue item</CardDescription>
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
                  <SelectItem value="Tickets">Tickets</SelectItem>
                  <SelectItem value="Sponsorships">Sponsorships</SelectItem>
                  <SelectItem value="Merchandise">Merchandise</SelectItem>
                  <SelectItem value="Concessions">Concessions</SelectItem>
                  <SelectItem value="Advertising">Advertising</SelectItem>
                  <SelectItem value="VIP Packages">VIP Packages</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue-description">Description</Label>
              <Input 
                id="revenue-description" 
                placeholder="e.g. Early Bird Tickets"
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
              <Select 
                value={newRevenueItem.event || selectedEventId} 
                onValueChange={(value) => handleRevenueChange('event', value)}
              >
                <SelectTrigger id="revenue-related-event">
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map(event => (
                    <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue-vat">VAT Percentage (%)</Label>
              <Input 
                id="revenue-vat"
                type="number"
                step="0.01"
                placeholder="21"
                value={newRevenueItem.vatPercent || ''}
                onChange={(e) => handleRevenueChange('vatPercent', e.target.value)}
              />
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
