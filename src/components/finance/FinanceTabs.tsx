
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CircleDollarSign, 
  CreditCard, 
  Coins,
  Receipt, 
  Wallet, 
  BarChart4, 
  FileText, 
  Calendar, 
  Users
} from "lucide-react";
import ExpensesTabContent from "@/components/finance/ExpensesTabContent";
import InvoiceTable from "@/components/finance/InvoiceTable";
import LoansTabContent from "@/components/finance/LoansTabContent";
import BudgetAnalysis from "@/components/finance/BudgetAnalysis";
import RevenueManager from "@/components/finance/RevenueManager";
import CompanyValuation from "@/components/finance/CompanyValuation";
import TaxesTabContent from "@/components/finance/TaxesTabContent";
import FinancialReport from "@/components/reports/FinancialReport";
import MiscTabContent from "@/components/finance/MiscTabContent";
import { invoiceData } from "@/components/finance/InvoiceTable";
import { calculateInvoiceDebts } from "@/utils/debtUtils";

interface FinanceTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const FinanceTabs: React.FC<FinanceTabsProps> = ({ activeTab, setActiveTab }) => {
  // Calculate invoice debts from the invoice data
  const invoiceDebts = calculateInvoiceDebts(invoiceData);

  return (
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
  );
};

export default FinanceTabs;
