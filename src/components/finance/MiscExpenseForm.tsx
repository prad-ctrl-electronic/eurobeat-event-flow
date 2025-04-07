
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Euro } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MiscExpenseForm = () => {
  return (
    <form className="space-y-4" onSubmit={(e) => {
      e.preventDefault();
      toast.success("Miscellaneous expense added successfully");
    }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="misc-expense-name">Expense Name</Label>
          <Input id="misc-expense-name" placeholder="e.g. Office Supplies" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="misc-category">Category</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="meals">Meals & Entertainment</SelectItem>
                      <SelectItem value="subscriptions">Subscriptions</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Select the type of miscellaneous expense</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="misc-amount">Amount</Label>
          <div className="relative">
            <Euro className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input id="misc-amount" placeholder="0.00" className="pl-9" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="misc-date">Date</Label>
          <Input id="misc-date" type="date" />
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label htmlFor="misc-description">Description</Label>
          <Textarea 
            id="misc-description" 
            placeholder="Add details about this expense"
            rows={3}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline">Cancel</Button>
        <Button>Save Expense</Button>
      </div>
    </form>
  );
};

export default MiscExpenseForm;
