
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
import { Expense } from "@/types/entities";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ExpenseFormProps {
  onSubmit?: (expense: Omit<Expense, "id">) => void;
  onDelete?: (expenseId: string | number) => void;
  expense?: Expense;
  mode?: 'create' | 'edit';
}

const ExpenseForm = ({ onSubmit, onDelete, expense, mode = 'create' }: ExpenseFormProps) => {
  const [netAmount, setNetAmount] = useState(expense?.amount ? (expense.amount / 1.19).toFixed(2) : "");
  const [vatRate, setVatRate] = useState("19");
  const [grossAmount, setGrossAmount] = useState(expense?.amount ? expense.amount.toString() : "");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract form data
    const formData = new FormData(e.target as HTMLFormElement);
    const event = formData.get('event') as string;
    const expenseName = formData.get('expense-name') as string;
    const category = formData.get('category') as string;
    const invoiceDate = formData.get('invoice-date') as string;
    const invoiceNumber = formData.get('invoice-number') as string;
    const bankAccount = formData.get('bank-account') as string;
    const description = formData.get('description') as string;
    
    const newExpense: Omit<Expense, "id"> = {
      date: invoiceDate || new Date().toISOString(),
      vendor: "Vendor Name", // In a real app, this would come from form values
      description: expenseName || "Description",
      category: category || "Equipment",
      amount: parseFloat(grossAmount || "0"),
      status: "pending",
      paymentMethod: "bank transfer",
      event: event || "Event Name"
    };
    
    if (onSubmit) {
      onSubmit(newExpense);
    }
    
    toast.success("Expense added successfully");
    
    // Reset form fields if in create mode
    if (mode === 'create') {
      setNetAmount("");
      setVatRate("");
      setGrossAmount("");
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (expense && onDelete) {
      onDelete(expense.id);
      toast.success("Expense deleted successfully");
    }
    setShowDeleteDialog(false);
  };
  
  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="event">Related Event</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Select name="event" defaultValue={expense?.event}>
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
            <Input id="expense-name" name="expense-name" placeholder="e.g. Sound Equipment Rental" defaultValue={expense?.description} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={expense?.category}>
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
            <Input id="invoice-date" name="invoice-date" type="date" defaultValue={
              expense?.date ? new Date(expense.date).toISOString().split('T')[0] : undefined
            } />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invoice-number">Invoice Number</Label>
            <Input id="invoice-number" name="invoice-number" placeholder="e.g. INV-2025-042" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bank-account">Bank Account</Label>
            <Input id="bank-account" name="bank-account" placeholder="e.g. DE89 3704 0044 0532 0130 00" />
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
              name="description"
              placeholder="Add any additional details or notes about this expense"
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          {mode === 'edit' && expense && onDelete && (
            <Button variant="destructive" type="button" onClick={handleDelete}>Delete</Button>
          )}
          <Button variant="outline" type="button">Cancel</Button>
          <Button type="submit">{mode === 'create' ? 'Save Expense' : 'Update Expense'}</Button>
        </div>
      </form>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the expense
              {expense ? ` "${expense.description}"` : ""}.
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
    </>
  );
};

export default ExpenseForm;
