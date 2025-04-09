
import React from "react";
import { useTokens } from "@/contexts/TokenContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExportDropdown from "@/components/common/ExportDropdown";

const TokenHourlyAnalysis: React.FC = () => {
  const { hourlySales } = useTokens();

  const handleExport = (format: "excel" | "pdf") => {
    console.log(`Exporting hourly analysis data to ${format}`);
    // Implementation for export functionality would go here
  };

  // Find peak hours
  const peakSalesHour = [...hourlySales].sort((a, b) => b.sales - a.sales)[0];
  const peakTokensHour = [...hourlySales].sort((a, b) => b.tokens - a.tokens)[0];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hourly Analysis</h2>
        <ExportDropdown onExport={handleExport} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Peak Sales Hour</CardDescription>
            <CardTitle>{peakSalesHour.hour}</CardTitle>
            <CardDescription>{peakSalesHour.sales} zł in sales</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Peak Tokens Hour</CardDescription>
            <CardTitle>{peakTokensHour.hour}</CardTitle>
            <CardDescription>{peakTokensHour.tokens} tokens sold</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hourly Distribution</CardTitle>
          <CardDescription>Token sales and revenue by hour</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tokens" className="space-y-4">
            <TabsList>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="sales">Sales (zł)</TabsTrigger>
              <TabsTrigger value="average">Avg. Per Client</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tokens" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlySales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#9ca3af" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(30, 30, 40, 0.95)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }}
                    formatter={(value) => [`${value} tokens`, '']}
                  />
                  <Bar dataKey="tokens" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="sales" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlySales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#9ca3af" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(30, 30, 40, 0.95)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }}
                    formatter={(value) => [`${value} zł`, '']}
                  />
                  <Bar dataKey="sales" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="average" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlySales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#9ca3af" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(30, 30, 40, 0.95)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }}
                    formatter={(value) => [`${value} tokens per client`, '']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="averagePerClient" 
                    stroke="#2DD4BF" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hourly Data Table</CardTitle>
          <CardDescription>Detailed hourly breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Hour
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Sales (zł)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tokens
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Avg. Per Client
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {hourlySales.map((hourData, i) => {
                  const totalTokens = hourlySales.reduce((sum, h) => sum + h.tokens, 0);
                  const percentageOfTotal = ((hourData.tokens / totalTokens) * 100).toFixed(1);
                  
                  return (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {hourData.hour}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {hourData.sales}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {hourData.tokens}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {hourData.averagePerClient}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {percentageOfTotal}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenHourlyAnalysis;
