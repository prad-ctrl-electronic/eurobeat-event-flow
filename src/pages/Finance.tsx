
import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  BarChart4, 
  Plus, 
  CreditCard, 
  FileText, 
  Wallet, 
  Receipt, 
  Calendar, 
  CircleDollarSign, 
  Coins,
  Users
} from "lucide-react";
import InvoiceTable from "@/components/finance/InvoiceTable";
import BudgetAnalysis from "@/components/finance/BudgetAnalysis";
import RevenueManager from "@/components/finance/RevenueManager";
import ExpensesTabContent from "@/components/finance/ExpensesTabContent";
import MiscTabContent from "@/components/finance/MiscTabContent";
import CompanyValuation from "@/components/finance/CompanyValuation";
import LoansTabContent from "@/components/finance/LoansTabContent";
import { invoiceData } from "@/components/finance/InvoiceTable";
import { calculateInvoiceDebts } from "@/utils/debtUtils";
import EventFilter from "@/components/EventFilter";
import { useEvent } from "@/contexts/EventContext";
import TaxesTabContent from "@/components/finance/TaxesTabContent";
import FinancialReport from "@/components/reports/FinancialReport";

const Finance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("expenses");
  const { selectedEventId, setSelectedEventId } = useEvent();
  
  // Calculate invoice debts from the invoice data
  const invoiceDebts = calculateInvoiceDebts(invoiceData);

  const handleShowAddExpense = () => {
    if (activeTab === "expenses") {
      // Logic to show add expense form within expenses tab
      return;
    }
    
    // If not on expenses tab, switch to it
    setActiveTab("expenses");
  };

  const handleShowTaxCalculator = () => {
    setActiveTab("taxes");
    // Wait for the tab to activate, then switch to the calculator sub-tab
    setTimeout(() => {
      const calculatorTab = document.querySelector('[value="calculator"]') as HTMLElement;
      if (calculatorTab) {
        calculatorTab.click();
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <AppHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
            
            <EventFilter 
              selectedEvent={selectedEventId}
              onEventChange={setSelectedEventId}
              className="w-full md:w-auto"
            />
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button variant="outline" className="gap-2" onClick={handleShowTaxCalculator}>
                <Calculator className="h-4 w-4" /> Tax Calculator
              </Button>
              <Button variant="outline" className="gap-2">
                <BarChart4 className="h-4 w-4" /> Budget Report
              </Button>
              <Button className="gap-2" onClick={handleShowAddExpense}>
                <Plus className="h-4 w-4" /> Add Expense
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-muted/40 mb-4 flex-wrap">
              <TabsTrigger value="dashboard">
                <CircleDollarSign className="h-4 w-4 mr-2" /> Dashboard
              </TabsTrigger>
              <TabsTrigger value="expenses">
                <CreditCard className="h-4 w-4 mr-2" /> Expenses
              </TabsTrigger>
              <TabsTrigger value="revenues">
                <Coins className="h-4 w-4 mr-2" /> Revenues
              </TabsTrigger>
              <TabsTrigger value="invoices">
                <Receipt className="h-4 w-4 mr-2" /> Invoices
              </TabsTrigger>
              <TabsTrigger value="loans">
                <Wallet className="h-4 w-4 mr-2" /> Loans
              </TabsTrigger>
              <TabsTrigger value="budgeting">
                <BarChart4 className="h-4 w-4 mr-2" /> Budgeting
              </TabsTrigger>
              <TabsTrigger value="reports">
                <FileText className="h-4 w-4 mr-2" /> Reports
              </TabsTrigger>
              <TabsTrigger value="calendar">
                <Calendar className="h-4 w-4 mr-2" /> Calendar
              </TabsTrigger>
              <TabsTrigger value="payroll">
                <Users className="h-4 w-4 mr-2" /> Payroll
              </TabsTrigger>
              <TabsTrigger value="valuation">Company Valuation</TabsTrigger>
              <TabsTrigger value="taxes">Taxes</TabsTrigger>
              <TabsTrigger value="profitloss">Profit & Loss</TabsTrigger>
              <TabsTrigger value="miscellaneous">Miscellaneous</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <FinancialReport />
            </TabsContent>
            
            <TabsContent value="expenses">
              <ExpensesTabContent />
            </TabsContent>
            
            <TabsContent value="revenues">
              <RevenueManager />
            </TabsContent>
            
            <TabsContent value="invoices">
              <InvoiceTable />
            </TabsContent>
            
            <TabsContent value="loans">
              <LoansTabContent invoiceDebts={invoiceDebts} />
            </TabsContent>
            
            <TabsContent value="budgeting">
              <BudgetAnalysis />
            </TabsContent>
            
            <TabsContent value="reports">
              <FinancialReport />
            </TabsContent>
            
            <TabsContent value="calendar">
              <div className="grid-card min-h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Payment calendar will appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="payroll">
              <div className="grid-card min-h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Staff payroll management will appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="valuation">
              <CompanyValuation />
            </TabsContent>
            
            <TabsContent value="taxes">
              <TaxesTabContent />
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
