
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ExpenseForm from "./ExpenseForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileDown, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample expense data
const sampleExpenses = [
  {
    id: "exp-001",
    date: "2025-03-28",
    vendor: "Sound Equipment Ltd",
    description: "Stage equipment rental",
    category: "Equipment",
    amount: 1250,
    status: "paid",
    paymentMethod: "Bank Transfer",
    event: "Techno Fusion"
  },
  {
    id: "exp-002",
    date: "2025-03-30",
    vendor: "City Hall",
    description: "Venue permit fees",
    category: "Permits",
    amount: 750,
    status: "paid",
    paymentMethod: "Credit Card",
    event: "Burn Warsaw"
  },
  {
    id: "exp-003",
    date: "2025-04-02",
    vendor: "Digital Marketing Agency",
    description: "Facebook & Instagram ads",
    category: "Marketing",
    amount: 500,
    status: "pending",
    paymentMethod: "Pending",
    event: "Boiler Room"
  },
  {
    id: "exp-004",
    date: "2025-04-03",
    vendor: "Security Services Inc",
    description: "Event security staff",
    category: "Staff",
    amount: 1800,
    status: "paid",
    paymentMethod: "Bank Transfer",
    event: "Techno Fusion"
  },
  {
    id: "exp-005",
    date: "2025-04-05",
    vendor: "Print Masters",
    description: "Event posters and flyers",
    category: "Marketing",
    amount: 320,
    status: "pending",
    paymentMethod: "Pending",
    event: "Burn Warsaw"
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

const ExpensesTabContent = () => {
  const [showForm, setShowForm] = useState(false);
  
  const downloadExpenseReport = () => {
    // Create report data
    const reportData = {
      reportDate: new Date().toISOString(),
      generatedBy: "System",
      totalExpenses: sampleExpenses.reduce((sum, exp) => sum + exp.amount, 0),
      expensesByCategory: sampleExpenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {} as Record<string, number>),
      expensesByEvent: sampleExpenses.reduce((acc, exp) => {
        acc[exp.event] = (acc[exp.event] || 0) + exp.amount;
        return acc;
      }, {} as Record<string, number>),
      expenses: sampleExpenses
    };
    
    // Convert to JSON
    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <ExpenseForm onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-end mb-4">
          <Button onClick={() => setShowForm(true)}>Add New Expense</Button>
        </div>
      )}
      
      <Card className="card-gradient">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your latest expense entries</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={downloadExpenseReport}>
              <FileDown className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
              {sampleExpenses.map((expense) => (
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
          
          <div className="mt-4 text-right text-sm font-medium">
            Total: {formatCurrency(sampleExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesTabContent;
