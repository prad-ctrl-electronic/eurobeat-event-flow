
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Euro, FileInput } from "lucide-react";
import VATCalculator from "./VATCalculator";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ExpenseForm = () => {
  const [netAmount, setNetAmount] = useState("");
  const [vatRate, setVatRate] = useState("");
  const [grossAmount, setGrossAmount] = useState("");
  
  return (
    <form className="space-y-4" onSubmit={(e) => {
      e.preventDefault();
      toast.success("Expense added successfully");
      // Reset form fields
      setNetAmount("");
      setVatRate("");
      setGrossAmount("");
    }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event">Related Event</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="techno-fusion">Techno Fusion Festival</SelectItem>
                      <SelectItem value="bass-nation">Bass Nation</SelectItem>
                      <SelectItem value="electronica">Electronica Showcase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Connect this expense to a specific event</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expense-name">Expense Name</Label>
          <Input id="expense-name" placeholder="e.g. Sound Equipment Rental" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="venue">Venue</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* VAT Calculator component */}
        <VATCalculator 
          netAmount={netAmount}
          setNetAmount={setNetAmount}
          vatRate={vatRate}
          setVatRate={setVatRate}
          grossAmount={grossAmount}
          setGrossAmount={setGrossAmount}
        />
        
        <div className="space-y-2">
          <Label htmlFor="invoice-date">Invoice Date</Label>
          <Input id="invoice-date" type="date" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="invoice-number">Invoice Number</Label>
          <Input id="invoice-number" placeholder="e.g. INV-2025-042" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bank-account">Bank Account</Label>
          <Input id="bank-account" placeholder="e.g. DE89 3704 0044 0532 0130 00" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="file">Invoice Document</Label>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="w-full justify-start gap-2">
              <FileInput className="h-4 w-4" />
              <span>Upload PDF/JPG</span>
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label htmlFor="description">Description/Comments</Label>
          <Textarea 
            id="description" 
            placeholder="Add any additional details or notes about this expense"
            rows={3}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" type="button">Cancel</Button>
        <Button type="submit">Save Expense</Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
