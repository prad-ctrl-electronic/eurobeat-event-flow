
import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, ChartBar, Download, FileText, Printer } from "lucide-react";

const Reports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <AppHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>

          <Tabs defaultValue="financial" className="space-y-4">
            <TabsList>
              <TabsTrigger value="financial">Financial Reports</TabsTrigger>
              <TabsTrigger value="events">Event Reports</TabsTrigger>
              <TabsTrigger value="sales">Sales Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="financial" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Profit & Loss Statement
                    </CardTitle>
                    <CardDescription>Comprehensive P&L reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">View detailed profit and loss statements for all your events or the entire company.</p>
                    <Button variant="secondary" size="sm">Generate Report</Button>
                  </CardContent>
                </Card>

                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChartBar className="h-5 w-5" />
                      Revenue Analysis
                    </CardTitle>
                    <CardDescription>Revenue breakdown by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Analyze revenue streams across different categories and time periods.</p>
                    <Button variant="secondary" size="sm">Generate Report</Button>
                  </CardContent>
                </Card>

                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Quarterly Reports
                    </CardTitle>
                    <CardDescription>Q1-Q4 financial summaries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Comprehensive quarterly financial reports for tax filing and business review.</p>
                    <Button variant="secondary" size="sm">Generate Report</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Event Performance
                    </CardTitle>
                    <CardDescription>Detailed event metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Analyze attendance, revenue, and profitability metrics for each event.</p>
                    <Button variant="secondary" size="sm">Generate Report</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sales" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Ticket Sales
                    </CardTitle>
                    <CardDescription>Ticket sales analytics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Detailed reports on ticket sales volumes, timing, and revenue.</p>
                    <Button variant="secondary" size="sm">Generate Report</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Reports;
