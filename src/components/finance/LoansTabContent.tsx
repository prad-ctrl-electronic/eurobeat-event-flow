
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, FileDown, Printer, Plus, ArrowDownRight, Building, ArrowUpRight, FileInput } from "lucide-react";
import { Loan, InvoiceDebt, loansData, calculateMonthlyDebtService, makeRepayment } from "@/utils/debtUtils";
import LoanForm from "./LoanForm";
import ExpenseActions from "./ExpenseActions";
import { format } from "date-fns";
import { toast } from "sonner";

const LoansTabContent: React.FC<{ invoiceDebts: InvoiceDebt[] }> = ({ invoiceDebts }) => {
  const [loans, setLoans] = useState<Loan[]>(loansData);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("loans");
  const [repaymentAmount, setRepaymentAmount] = useState<{ [key: string]: string }>({});
  
  // Filter loans based on search term
  const filteredLoans = loans.filter(
    (loan) =>
      loan.lender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter invoice debts to show only those past due
  const filteredInvoiceDebts = invoiceDebts.filter(debt => debt.daysPastDue > 0);
  
  const handleRepayment = (loanId: string) => {
    const amount = parseFloat(repaymentAmount[loanId] || "0");
    if (amount <= 0) {
      toast.error("Please enter a valid repayment amount");
      return;
    }
    
    const updatedLoans = makeRepayment(loanId, amount, loans);
    setLoans(updatedLoans);
    
    // Reset the repayment amount input for this loan
    setRepaymentAmount({
      ...repaymentAmount,
      [loanId]: ""
    });
  };
  
  const getLoanStatusBadge = (status: Loan['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-500">Active</Badge>;
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'defaulted':
        return <Badge className="bg-red-500">Defaulted</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const totalLoansOutstanding = loans.reduce((sum, loan) => sum + loan.outstandingAmount, 0);
  const totalInvoiceDebts = invoiceDebts.reduce((sum, debt) => {
    // Simplified conversion to EUR for display
    let amount = debt.amount;
    if (debt.currency === "PLN") amount /= 4.3;
    if (debt.currency === "HUF") amount /= 380;
    if (debt.currency === "USD") amount *= 0.91;
    return sum + amount;
  }, 0);
  const monthlyDebtService = calculateMonthlyDebtService(loans);
  
  const handleLoanAdded = (newLoan: Loan) => {
    setLoans([...loans, newLoan]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="invoiceDebts">Unpaid Invoices</TabsTrigger>
            <TabsTrigger value="addLoan">Add New Loan</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <ExpenseActions />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Outstanding Loans</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <Building className="mr-2 h-5 w-5 text-primary" />
              €{totalLoansOutstanding.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active loans: {loans.filter(l => l.status === "active").length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Unpaid Invoice Debt</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <FileInput className="mr-2 h-5 w-5 text-amber-500" />
              €{totalInvoiceDebts.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Overdue invoices: {filteredInvoiceDebts.length}</span>
              <span className="flex items-center text-amber-500">
                <ArrowUpRight className="h-4 w-4 mr-1" />
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Debt Service</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <ArrowDownRight className="mr-2 h-5 w-5 text-rose-500" />
              €{monthlyDebtService.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly payments due</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <TabsContent value="loans" className="mt-0 space-y-4">
        <div className="flex justify-between items-center">
          <div className="w-72">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search loans..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={() => setActiveTab("addLoan")} className="gap-1">
            <Plus className="h-4 w-4" /> Add Loan
          </Button>
        </div>
        
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableCaption>
              Total of {filteredLoans.length} loans, €{totalLoansOutstanding.toLocaleString()} outstanding
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Lender</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">{loan.id}</TableCell>
                    <TableCell>{loan.lender}</TableCell>
                    <TableCell>{loan.amount.toLocaleString()} {loan.currency}</TableCell>
                    <TableCell>{loan.interestRate}%</TableCell>
                    <TableCell>{format(new Date(loan.startDate), "PP")}</TableCell>
                    <TableCell>{format(new Date(loan.endDate), "PP")}</TableCell>
                    <TableCell className="font-medium">
                      {loan.outstandingAmount.toLocaleString()} {loan.currency}
                    </TableCell>
                    <TableCell>{getLoanStatusBadge(loan.status)}</TableCell>
                    <TableCell>
                      {loan.status === "active" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Make Payment</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Make Loan Repayment</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <p><strong>Loan:</strong> {loan.id} - {loan.lender}</p>
                                <p><strong>Outstanding:</strong> {loan.outstandingAmount.toLocaleString()} {loan.currency}</p>
                                <p><strong>Regular Payment:</strong> {loan.repaymentAmount?.toLocaleString()} {loan.currency}</p>
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="repayment-amount">Payment Amount ({loan.currency})</label>
                                <Input
                                  id="repayment-amount"
                                  type="number"
                                  value={repaymentAmount[loan.id] || ""}
                                  onChange={(e) => setRepaymentAmount({
                                    ...repaymentAmount,
                                    [loan.id]: e.target.value
                                  })}
                                  min="0"
                                  step="0.01"
                                  placeholder={loan.repaymentAmount?.toString() || "0.00"}
                                />
                              </div>
                              <Button 
                                className="w-full" 
                                onClick={() => handleRepayment(loan.id)}
                              >
                                Submit Payment
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center h-24">
                    No loans found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
      
      <TabsContent value="invoiceDebts" className="mt-0 space-y-4">
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableCaption>
              Total of {filteredInvoiceDebts.length} unpaid invoices
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Days Overdue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoiceDebts.length > 0 ? (
                filteredInvoiceDebts.map((debt, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{debt.invoiceId}</TableCell>
                    <TableCell>{debt.supplier}</TableCell>
                    <TableCell>{debt.amount.toLocaleString()} {debt.currency}</TableCell>
                    <TableCell>{debt.dueDate}</TableCell>
                    <TableCell>
                      <Badge className="bg-red-500">
                        {debt.daysPastDue} days
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No unpaid invoices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
      
      <TabsContent value="addLoan" className="mt-0">
        <LoanForm onLoanAdded={handleLoanAdded} existingLoans={loans} />
      </TabsContent>
    </div>
  );
};

export default LoansTabContent;
