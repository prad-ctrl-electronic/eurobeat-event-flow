
import React from "react";
import { useTokens } from "@/contexts/TokenContext";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const TokenHourlyAnalysis: React.FC = () => {
  const { hourlySales, isLoading } = useTokens();

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading hourly data...</div>;
  }

  // Calculate totals
  const totalSales = hourlySales.reduce((sum, hour) => sum + hour.salesPerHour, 0);
  const totalTokens = hourlySales.reduce((sum, hour) => sum + hour.tokensPerHour, 0);
  const averageTokensPerClient = (totalTokens / totalSales).toFixed(1);

  // Prepare chart data
  const chartData = hourlySales.map(hour => ({
    name: hour.hour.split(' - ')[0],
    tokens: hour.tokensPerHour,
    sales: hour.salesPerHour,
    average: hour.averageTokensPerClient
  }));

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Hourly Token Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Sales</h3>
            <p className="text-2xl font-bold">{totalSales}</p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Tokens</h3>
            <p className="text-2xl font-bold">{totalTokens.toLocaleString()}</p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Avg. Tokens/Client</h3>
            <p className="text-2xl font-bold">{averageTokensPerClient}</p>
          </div>
        </div>

        <div className="h-[400px] mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="tokens" name="Tokens Sold" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="sales" name="Transactions" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Tokens</TableHead>
                <TableHead>Avg. Tokens/Client</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hourlySales.map((hour) => (
                <TableRow key={hour.hour}>
                  <TableCell className="font-medium">{hour.hour}</TableCell>
                  <TableCell>{hour.salesPerHour}</TableCell>
                  <TableCell>{hour.tokensPerHour}</TableCell>
                  <TableCell>{hour.averageTokensPerClient}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default TokenHourlyAnalysis;
