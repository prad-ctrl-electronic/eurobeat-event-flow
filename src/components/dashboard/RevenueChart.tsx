
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const data = [
  { name: "Jan", revenue: 35000, expenses: 22000, profit: 13000 },
  { name: "Feb", revenue: 42000, expenses: 25000, profit: 17000 },
  { name: "Mar", revenue: 58000, expenses: 28000, profit: 30000 },
  { name: "Apr", revenue: 69000, expenses: 32000, profit: 37000 },
  { name: "May", revenue: 84000, expenses: 35000, profit: 49000 },
  { name: "Jun", revenue: 95000, expenses: 40000, profit: 55000 },
  { name: "Jul", revenue: 89000, expenses: 43000, profit: 46000 },
];

const RevenueChart = () => {
  return (
    <Card className="card-gradient h-[400px]">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Financial performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-muted/40">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary-purple mr-1.5"></div>
                Revenue
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-secondary-blue mr-1.5"></div>
                Expenses
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-accent-teal mr-1.5"></div>
                Profit
              </div>
            </div>
          </div>
          <TabsContent value="monthly" className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(30, 30, 40, 0.95)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#f8fafc'
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                  formatter={(value) => [`€${value.toLocaleString()}`, '']}
                />
                <Bar dataKey="revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="#2DD4BF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="quarterly" className="h-[280px]">
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Quarterly data will appear here
            </div>
          </TabsContent>
          <TabsContent value="yearly" className="h-[280px]">
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Yearly data will appear here
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
