import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ExpenseForm from "./ExpenseForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ExpenseActions from "./ExpenseActions";
import { formatCurrency } from "@/utils/financeUtils";
import { useExpenses } from "./hooks/useExpenses";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FilePdf } from "lucide-react";
import { exportData } from "@/utils/exportUtils";
import { useSelectedEventName } from "@/contexts/EventContext";

const ExpensesTabContent = () => {
  const [showForm, setShowForm] = useState(false);
  const { expenses, totalAmount } = useExpenses();
  const selectedEventName = useSelectedEventName();
  
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

  return (
    <div className="space-y-6">
      {showForm ? (
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
            <CardDescription>Enter the details of your expense</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseForm />
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowForm(false)} className="mr-2">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-between mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="mr-2">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExportExpenses("excel")}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportExpenses("pdf")}>
                <FilePdf className="h-4 w-4 mr-2" />
                Export to PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setShowForm(true)}>Add New Expense</Button>
        </div>
      )}
      
      <Card className="card-gradient">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your latest expense entries</CardDescription>
          </div>
          <ExpenseActions onDownloadReport={() => handleExportExpenses("excel")} />
        </CardHeader>
        <CardContent>
          <ExpensesTable expenses={expenses} />
          
          <div className="mt-4 text-right text-sm font-medium">
            Total: {formatCurrency(totalAmount)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface Expense {
  id: string;
  date: string;
  vendor: string;
  description: string;
  category: string;
  amount: number;
  status: string;
  paymentMethod: string;
  event: string;
}

const ExpensesTable = ({ expenses }: { expenses: Expense[] }) => {
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExpensesTabContent;
