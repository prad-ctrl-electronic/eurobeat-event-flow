
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTokens } from "@/contexts/TokenContext";
import { ArrowUpRight, ArrowDownRight, Coins, CreditCard, Users, Clock } from "lucide-react";
import ExportDropdown from "@/components/common/ExportDropdown";
import { cn } from "@/lib/utils";

const TokenDashboard: React.FC = () => {
  const { tokenSales } = useTokens();

  const handleExport = (format: "excel" | "pdf") => {
    console.log(`Exporting token dashboard data to ${format}`);
    // Implementation for export functionality would go here
  };

  const tokenRedemptionRate = ((tokenSales.totalCollected / tokenSales.totalSold) * 100).toFixed(1);

  // Create custom CSS classes for the progress bars
  const purpleProgressClass = "token-purple-progress";
  const blueProgressClass = "token-blue-progress";
  const tealProgressClass = "token-teal-progress";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Token Dashboard</h2>
        <ExportDropdown onExport={handleExport} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-gradient">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground">Total Tokens Sold</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <Coins className="mr-2 h-5 w-5 text-primary-purple" />
              {tokenSales.totalSold.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Revenue: {tokenSales.actualRevenue.toLocaleString()} zł</span>
              <span className="flex items-center text-emerald-500">
                <ArrowUpRight className="h-4 w-4 mr-1" /> 10%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-gradient">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground">Tokens Collected</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-secondary-blue" />
              {tokenSales.totalCollected.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Redemption Rate</span>
              <span className="text-sm">{tokenRedemptionRate}%</span>
            </div>
            <Progress value={Number(tokenRedemptionRate)} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card className="card-gradient">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground">Transactions</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <Users className="mr-2 h-5 w-5 text-accent-teal" />
              {tokenSales.totalTransactions.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Avg. {tokenSales.averagePerClient} tokens per client
              </span>
              <span className="flex items-center text-emerald-500">
                <ArrowUpRight className="h-4 w-4 mr-1" /> 5%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-gradient">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground">Unredeemed Tokens</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <Clock className="mr-2 h-5 w-5 text-rose-500" />
              {tokenSales.difference.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {tokenSales.differencePercentage}% of all tokens
              </span>
              <span className="flex items-center text-rose-500">
                <ArrowDownRight className="h-4 w-4 mr-1" /> {tokenSales.differencePercentage}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Token Distribution</CardTitle>
            <CardDescription>Distribution of collected tokens by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bar Tokens</span>
                  <span className="text-sm font-medium">
                    {tokenSales.barTokens.toLocaleString()} 
                    ({((tokenSales.barTokens / tokenSales.totalCollected) * 100).toFixed(1)}%)
                  </span>
                </div>
                <Progress 
                  value={(tokenSales.barTokens / tokenSales.totalCollected) * 100} 
                  className={cn("h-2", purpleProgressClass)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Food Tokens</span>
                  <span className="text-sm font-medium">
                    {tokenSales.foodTokens.toLocaleString()} 
                    ({((tokenSales.foodTokens / tokenSales.totalCollected) * 100).toFixed(1)}%)
                  </span>
                </div>
                <Progress 
                  value={(tokenSales.foodTokens / tokenSales.totalCollected) * 100} 
                  className={cn("h-2", blueProgressClass)}
                />
              </div>
              
              {tokenSales.cloakroomTokens && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cloakroom Tokens</span>
                    <span className="text-sm font-medium">
                      {tokenSales.cloakroomTokens.toLocaleString()} 
                      ({((tokenSales.cloakroomTokens / tokenSales.totalCollected) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <Progress 
                    value={(tokenSales.cloakroomTokens / tokenSales.totalCollected) * 100} 
                    className={cn("h-2", tealProgressClass)}
                  />
                </div>
              )}
            </div>

            {/* Custom CSS for progress colors */}
            <style dangerouslySetInnerHTML={{
              __html: `
                .${purpleProgressClass} > div {
                  background-color: rgb(147, 51, 234); /* primary-purple equivalent */
                }
                .${blueProgressClass} > div {
                  background-color: rgb(59, 130, 246); /* secondary-blue equivalent */
                }
                .${tealProgressClass} > div {
                  background-color: rgb(20, 184, 166); /* accent-teal equivalent */
                }
              `
            }} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>Expected vs. actual token revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <CardDescription>Expected Revenue</CardDescription>
                  <p className="text-2xl font-bold">{tokenSales.expectedRevenue.toLocaleString()} zł</p>
                </div>
                <div className="space-y-2">
                  <CardDescription>Actual Revenue</CardDescription>
                  <p className="text-2xl font-bold">{tokenSales.actualRevenue.toLocaleString()} zł</p>
                </div>
              </div>

              <div className="pt-2 border-t border-muted-foreground/20">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Discrepancy</span>
                  <span className={`font-medium ${tokenSales.discrepancy > 0 ? 'text-rose-500' : 'text-green-500'}`}>
                    {(tokenSales.discrepancy > 0 ? '-' : '+')} {Math.abs(tokenSales.discrepancy).toLocaleString()} zł
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {tokenSales.discrepancy > 0 
                    ? `${((tokenSales.discrepancy / tokenSales.expectedRevenue) * 100).toFixed(2)}% less than expected` 
                    : `${((Math.abs(tokenSales.discrepancy) / tokenSales.expectedRevenue) * 100).toFixed(2)}% more than expected`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TokenDashboard;
