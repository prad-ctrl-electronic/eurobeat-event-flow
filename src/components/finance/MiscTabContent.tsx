
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MiscExpenseForm from "./MiscExpenseForm";

const MiscTabContent = () => {
  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle>Miscellaneous Expenses</CardTitle>
        <CardDescription>Record any one-off or irregular expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <MiscExpenseForm />
        
        <div className="mt-6 border-t pt-6">
          <h3 className="font-medium text-lg mb-4">Recent Miscellaneous Expenses</h3>
          <div className="text-sm text-muted-foreground text-center py-8">
            No miscellaneous expenses recorded yet.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiscTabContent;
