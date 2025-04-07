
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ExpenseForm from "./ExpenseForm";

const ExpensesTabContent = () => {
  return (
    <div className="space-y-6">
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
          <CardDescription>Enter the details of your expense</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseForm />
        </CardContent>
      </Card>
      
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Your latest expense entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-8">
            No expenses have been added yet.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesTabContent;
