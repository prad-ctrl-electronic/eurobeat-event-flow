
import React from "react";
import { ArrowUpRight, ArrowDownRight, EuroIcon, DollarSign, Percent, Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { loansData } from "@/utils/debtUtils";

const FinancialOverview = () => {
  // Calculate total outstanding debt from loans
  const outstandingDebt = loansData.reduce((sum, loan) => {
    // Only include active loans
    if (loan.status === "active") {
      return sum + loan.outstandingAmount;
    }
    return sum;
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="card-gradient">
        <CardHeader className="pb-2">
          <CardDescription className="text-muted-foreground">Total Revenue</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            <EuroIcon className="mr-2 h-5 w-5 text-primary-purple" />
            248,540
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">+12% from last month</span>
            <span className="flex items-center text-emerald-500">
              <ArrowUpRight className="h-4 w-4 mr-1" /> 12%
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="card-gradient">
        <CardHeader className="pb-2">
          <CardDescription className="text-muted-foreground">Outstanding Debts</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            <Building className="mr-2 h-5 w-5 text-secondary-blue" />
            {outstandingDebt.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Active loans: {loansData.filter(l => l.status === "active").length}</span>
            <span className="flex items-center text-rose-500">
              <ArrowDownRight className="h-4 w-4 mr-1" /> 3%
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="card-gradient">
        <CardHeader className="pb-2">
          <CardDescription className="text-muted-foreground">Ticket Sales</CardDescription>
          <CardTitle className="text-2xl">15,842</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly goal</span>
              <span className="text-sm">72%</span>
            </div>
            <Progress value={72} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="card-gradient">
        <CardHeader className="pb-2">
          <CardDescription className="text-muted-foreground">EBITDA</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            <Percent className="mr-2 h-5 w-5 text-accent-teal" />
            24.8
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">+2.4% from forecast</span>
            <span className="flex items-center text-emerald-500">
              <ArrowUpRight className="h-4 w-4 mr-1" /> 2.4%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialOverview;
