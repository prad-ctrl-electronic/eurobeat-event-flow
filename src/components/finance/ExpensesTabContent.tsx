
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ExpenseForm from "./ExpenseForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ExpenseActions from "./ExpenseActions";
import { formatCurrency } from "@/utils/financeUtils";
import ExportDropdown from "@/components/common/ExportDropdown";
import { exportData } from "@/utils/exportUtils";
import { useSelectedEventName } from "@/contexts/EventContext";
import { useExpenseOperations } from "@/contexts/ExpensesContext";
import { Expense } from "@/types/entities";

const ExpensesTabContent = () => {
  const [showForm, setShowForm] = useState(false);
  const { getActiveExpenses, addExpense, updateExpense, deleteExpense } = useExpenseOperations();
  const expenses = getActiveExpenses();
  const selectedEventName = useSelectedEventName();
  
  // Calculate total amount
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const handleExportExpenses = (format: "excel" | "pdf") => {
    exportData(expenses, {
      format,
      module: "finance",
      submodule: "expenses",
      eventName: selectedEventName,
      includeHeaders: true,
      dateRange: {
        start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        end: new Date()
      }
    });
  };

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    addExpense(newExpense);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {showForm ? (
        <ExpenseFormCard onCancel={() => setShowForm(false)} onSubmit={handleAddExpense} />
      ) : (
        <div className="flex justify-between mb-4">
          <ExportDropdown onExport={handleExportExpenses} />
          <Button onClick={() => setShowForm(true)}>Add New Expense</Button>
        </div>
      )}
      
      <ExpensesList 
        expenses={expenses} 
        totalAmount={totalAmount} 
        onExport={handleExportExpenses}
        onUpdate={updateExpense}
        onDelete={deleteExpense}
      />
    </div>
  );
};

const ExpenseFormCard = ({ 
  onCancel, 
  onSubmit 
}: { 
  onCancel: () => void;
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
}) => {
  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle>Add New Expense</CardTitle>
        <CardDescription>Enter the details of your expense</CardDescription>
      </CardHeader>
      <CardContent>
        <ExpenseForm onSubmit={onSubmit} />
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onCancel} className="mr-2">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface ExpensesListProps {
  expenses: Expense[];
  totalAmount: number;
  onExport: (format: "excel" | "pdf") => void;
  onUpdate: (id: string | number, updates: Partial<Expense>) => void;
  onDelete: (id: string | number, hardDelete?: boolean) => void;
}

const ExpensesList = ({ expenses, totalAmount, onExport, onUpdate, onDelete }: ExpensesListProps) => {
  return (
    <Card className="card-gradient">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Your latest expense entries</CardDescription>
        </div>
        <ExpenseActions onDownloadReport={() => onExport("excel")} />
      </CardHeader>
      <CardContent>
        <ExpensesTable expenses={expenses} onUpdate={onUpdate} onDelete={onDelete} />
        
        <div className="mt-4 text-right text-sm font-medium">
          Total: {formatCurrency(totalAmount)}
        </div>
      </CardContent>
    </Card>
  );
};

const ExpensesTable = ({ 
  expenses,
  onUpdate,
  onDelete 
}: { 
  expenses: Expense[];
  onUpdate: (id: string | number, updates: Partial<Expense>) => void;
  onDelete: (id: string | number, hardDelete?: boolean) => void;
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Vendor</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Event</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
            <TableCell>{expense.vendor}</TableCell>
            <TableCell>{expense.description}</TableCell>
            <TableCell>{expense.category}</TableCell>
            <TableCell>{expense.event}</TableCell>
            <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
            <TableCell>
              <Badge variant={expense.status === 'paid' ? 'default' : 'outline'}>
                {expense.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDelete(expense.id)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExpensesTabContent;
