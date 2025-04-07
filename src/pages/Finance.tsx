
import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calculator, BarChart4, Plus } from "lucide-react";
import InvoiceTable from "@/components/finance/InvoiceTable";
import BudgetAnalysis from "@/components/finance/BudgetAnalysis";
import RevenueManager from "@/components/finance/RevenueManager";
import ExpensesTabContent from "@/components/finance/ExpensesTabContent";
import MiscTabContent from "@/components/finance/MiscTabContent";

const Finance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <AppHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="container mx-auto py-6 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Calculator className="h-4 w-4" /> Tax Calculator
              </Button>
              <Button variant="outline" className="gap-2">
                <BarChart4 className="h-4 w-4" /> Budget Report
              </Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add Expense
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="expenses" className="space-y-6">
            <TabsList className="bg-muted/40 mb-4">
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="revenues">Revenues</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="budgeting">Budgeting</TabsTrigger>
              <TabsTrigger value="taxes">Taxes</TabsTrigger>
              <TabsTrigger value="profitloss">Profit & Loss</TabsTrigger>
              <TabsTrigger value="miscellaneous">Miscellaneous</TabsTrigger>
            </TabsList>
            
            <TabsContent value="expenses">
              <ExpensesTabContent />
            </TabsContent>
            
            <TabsContent value="revenues">
              <RevenueManager />
            </TabsContent>
            
            <TabsContent value="invoices">
              <InvoiceTable />
            </TabsContent>
            
            <TabsContent value="budgeting">
              <BudgetAnalysis />
            </TabsContent>
            
            <TabsContent value="taxes">
              <div className="grid-card min-h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Tax calculations will appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="profitloss">
              <div className="grid-card min-h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Profit & Loss statements will appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="miscellaneous">
              <MiscTabContent />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Finance;
