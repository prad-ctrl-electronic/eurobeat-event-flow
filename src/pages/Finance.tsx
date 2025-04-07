
import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Euro, Plus, FileInput, Calculator } from "lucide-react";

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
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add Expense
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="expenses" className="space-y-6">
            <TabsList className="bg-muted/40 mb-4">
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="revenues">Revenues</TabsTrigger>
              <TabsTrigger value="taxes">Taxes</TabsTrigger>
              <TabsTrigger value="profitloss">Profit & Loss</TabsTrigger>
            </TabsList>
            
            <TabsContent value="expenses">
              <div className="space-y-6">
                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle>Add New Expense</CardTitle>
                    <CardDescription>Enter the details of your expense</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
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
                          <Select>
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
                            <Input id="amount" placeholder="0.00" className="pl-9" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="gross">Gross Amount</Label>
                          <div className="relative">
                            <Euro className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="gross" placeholder="0.00" className="pl-9" />
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
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Expense</Button>
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
              <div className="grid-card min-h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Revenue management will appear here</p>
              </div>
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
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Finance;
