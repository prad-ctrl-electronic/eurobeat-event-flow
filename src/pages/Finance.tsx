
import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Euro, Plus, FileInput, Calculator, BarChart4, Calendar, Tag, Wallet } from "lucide-react";
import InvoiceTable from "@/components/finance/InvoiceTable";
import BudgetAnalysis from "@/components/finance/BudgetAnalysis";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import RevenueManager from "@/components/finance/RevenueManager";
import { toast } from "sonner";

const Finance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [netAmount, setNetAmount] = useState("");
  const [vatRate, setVatRate] = useState("");
  const [grossAmount, setGrossAmount] = useState("");

  // Calculate gross amount when net amount or VAT rate changes
  const calculateGrossAmount = (net: string, vat: string) => {
    if (net && vat) {
      const netValue = parseFloat(net.replace(/,/g, ''));
      const vatValue = parseFloat(vat);
      
      if (!isNaN(netValue) && !isNaN(vatValue)) {
        const gross = netValue * (1 + vatValue / 100);
        return gross.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    }
    return "";
  };

  // Handle net amount change
  const handleNetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNetAmount = e.target.value;
    setNetAmount(newNetAmount);
    setGrossAmount(calculateGrossAmount(newNetAmount, vatRate));
  };

  // Handle VAT rate change
  const handleVatRateChange = (value: string) => {
    setVatRate(value);
    setGrossAmount(calculateGrossAmount(netAmount, value));
  };

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
              <div className="space-y-6">
                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle>Add New Expense</CardTitle>
                    <CardDescription>Enter the details of your expense</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={(e) => {
                      e.preventDefault();
                      toast.success("Expense added successfully");
                      // Reset form fields
                      setNetAmount("");
                      setVatRate("");
                      setGrossAmount("");
                    }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="event">Related Event</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select event" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="techno-fusion">Techno Fusion Festival</SelectItem>
                              <SelectItem value="bass-nation">Bass Nation</SelectItem>
                              <SelectItem value="electronica">Electronica Showcase</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="expense-name">Expense Name</Label>
                          <Input id="expense-name" placeholder="e.g. Sound Equipment Rental" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="venue">Venue</SelectItem>
                              <SelectItem value="equipment">Equipment</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="staff">Staff</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="vat">VAT %</Label>
                          <Select onValueChange={handleVatRateChange} value={vatRate}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select VAT rate" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0%</SelectItem>
                              <SelectItem value="5">5%</SelectItem>
                              <SelectItem value="7">7%</SelectItem>
                              <SelectItem value="19">19%</SelectItem>
                              <SelectItem value="21">21%</SelectItem>
                              <SelectItem value="23">23%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="amount">Net Amount</Label>
                          <div className="relative">
                            <Euro className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="amount" 
                              placeholder="0.00" 
                              className="pl-9" 
                              value={netAmount}
                              onChange={handleNetAmountChange}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="gross">Gross Amount</Label>
                          <div className="relative">
                            <Euro className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="gross" 
                              placeholder="0.00" 
                              className="pl-9" 
                              value={grossAmount}
                              readOnly
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="invoice-date">Invoice Date</Label>
                          <Input id="invoice-date" type="date" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="invoice-number">Invoice Number</Label>
                          <Input id="invoice-number" placeholder="e.g. INV-2025-042" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bank-account">Bank Account</Label>
                          <Input id="bank-account" placeholder="e.g. DE89 3704 0044 0532 0130 00" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="file">Invoice Document</Label>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" className="w-full justify-start gap-2">
                              <FileInput className="h-4 w-4" />
                              <span>Upload PDF/JPG</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="description">Description/Comments</Label>
                          <Textarea 
                            id="description" 
                            placeholder="Add any additional details or notes about this expense"
                            rows={3}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" type="button">Cancel</Button>
                        <Button type="submit">Save Expense</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle>Recent Expenses</CardTitle>
                    <CardDescription>Your latest expense entries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground text-center py-8">
                      No expenses have been added yet.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="revenues">
              <RevenueManager />
            </TabsContent>
            
            <TabsContent value="invoices">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Invoice Register</CardTitle>
                  <CardDescription>Manage all your company invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <InvoiceTable />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="budgeting">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Event Budget Analysis</CardTitle>
                  <CardDescription>Track your event budgets, revenues and calculate profit & loss</CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetAnalysis />
                </CardContent>
              </Card>
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
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Miscellaneous Expenses</CardTitle>
                  <CardDescription>Record any one-off or irregular expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="misc-expense-name">Expense Name</Label>
                        <Input id="misc-expense-name" placeholder="e.g. Office Supplies" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="misc-category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="office">Office</SelectItem>
                            <SelectItem value="travel">Travel</SelectItem>
                            <SelectItem value="meals">Meals & Entertainment</SelectItem>
                            <SelectItem value="subscriptions">Subscriptions</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="misc-amount">Amount</Label>
                        <div className="relative">
                          <Euro className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input id="misc-amount" placeholder="0.00" className="pl-9" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="misc-date">Date</Label>
                        <Input id="misc-date" type="date" />
                      </div>
                      
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="misc-description">Description</Label>
                        <Textarea 
                          id="misc-description" 
                          placeholder="Add details about this expense"
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-6">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Expense</Button>
                    </div>
                  </form>
                  
                  <div className="mt-6 border-t pt-6">
                    <h3 className="font-medium text-lg mb-4">Recent Miscellaneous Expenses</h3>
                    <div className="text-sm text-muted-foreground text-center py-8">
                      No miscellaneous expenses recorded yet.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Finance;
