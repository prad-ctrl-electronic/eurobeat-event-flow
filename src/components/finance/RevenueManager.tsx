
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Calendar, Euro, Plus, Tag, Ticket, Wallet } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VATCalculator from "./VATCalculator";
import { useEvent } from "@/contexts/EventContext";
import { ActionButtonDropdown } from "@/components/ui/action-button-dropdown";

type Revenue = {
  id: string;
  event: string;
  category: string;
  description: string;
  netAmount: number;
  vatRate: string;
  vatAmount: number;
  grossAmount: number;
  date: string;
  ticketsSold?: number;
  ticketPrice?: number;
  paymentMethod: string;
  referenceNumber: string;
  status: string;
};

type EventOption = {
  id: string;
  name: string;
  date: string;
};

// VAT rate options
export const vatRateOptions = [
  { value: "0", label: "0%" },
  { value: "5", label: "5%" },
  { value: "8", label: "8%" },
  { value: "23", label: "23%" }
];

// Status options
export const revenueStatusOptions = [
  { value: "Already paid", label: "Already paid" },
  { value: "Unpaid", label: "Unpaid" },
  { value: "Processing", label: "Processing" },
  { value: "Cancelled", label: "Cancelled" },
];

// Sample revenue categories
const revenueCategories = [
  "Ticket Sales",
  "Food & Beverage",
  "Merchandise",
  "Sponsorship",
  "VIP Packages",
  "Livestream Access",
  "Vendor Fees",
  "Donations",
  "Workshop Fees",
  "Other",
];

const RevenueManager = () => {
  const { toast } = useToast();
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [activeTab, setActiveTab] = useState("add");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { selectedEventId, events } = useEvent();
  
  // VAT calculator state
  const [netAmount, setNetAmount] = useState("");
  const [vatRate, setVatRate] = useState("23"); // Default to 23%
  const [grossAmount, setGrossAmount] = useState("");
  const [editingRevenueId, setEditingRevenueId] = useState<string | null>(null);

  const form = useForm<Omit<Revenue, "id" | "vatAmount" | "grossAmount">>({
    defaultValues: {
      event: selectedEventId !== "all" ? selectedEventId : "",
      category: "",
      description: "",
      netAmount: 0,
      vatRate: "23",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "",
      referenceNumber: "",
      status: "Unpaid",
    },
  });

  // Update form default event when selectedEventId changes
  React.useEffect(() => {
    if (selectedEventId !== "all") {
      form.setValue("event", selectedEventId);
    }
  }, [selectedEventId, form]);

  const handleSubmit = form.handleSubmit((data) => {
    // Calculate VAT amount and gross amount
    const netAmountValue = Number(data.netAmount);
    const vatRateValue = Number(data.vatRate);
    const vatAmount = netAmountValue * (vatRateValue / 100);
    const grossAmount = netAmountValue + vatAmount;

    const newRevenue: Revenue = {
      id: `rev-${Date.now()}`,
      ...data,
      netAmount: netAmountValue,
      vatAmount: vatAmount,
      grossAmount: grossAmount,
    };

    setRevenues([...revenues, newRevenue]);
    toast({
      title: "Revenue Added",
      description: `€${newRevenue.grossAmount.toFixed(2)} has been recorded for ${newRevenue.description}`,
    });

    // Reset the form
    form.reset({
      event: selectedEventId !== "all" ? selectedEventId : "",
      category: "",
      description: "",
      netAmount: 0,
      vatRate: "23",
      date: new Date().toISOString().split("T")[0],
      ticketsSold: undefined,
      ticketPrice: undefined,
      paymentMethod: "",
      referenceNumber: "",
      status: "Unpaid",
    });

    // Reset VAT calculator
    setNetAmount("");
    setVatRate("23");
    setGrossAmount("");
  });

  const calculateTotal = (field: 'netAmount' | 'grossAmount' | 'vatAmount', category?: string) => {
    const filteredRevenues = selectedEventId === "all" 
      ? revenues 
      : revenues.filter(rev => rev.event === selectedEventId);
      
    if (category) {
      return filteredRevenues
        .filter((rev) => rev.category === category)
        .reduce((sum, rev) => sum + rev[field], 0);
    }
    return filteredRevenues.reduce((sum, rev) => sum + rev[field], 0);
  };

  const getEventName = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    return event ? event.name : eventId;
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    const updatedRevenues = revenues.map(rev => 
      rev.id === id ? { ...rev, status: newStatus } : rev
    );
    setRevenues(updatedRevenues);
    toast({
      title: "Status Updated",
      description: `Revenue status changed to ${newStatus}`,
    });
  };

  const handleVatRateChange = (id: string, newVatRate: string) => {
    const updatedRevenues = revenues.map(rev => {
      if (rev.id === id) {
        const vatRateValue = Number(newVatRate);
        const vatAmount = rev.netAmount * (vatRateValue / 100);
        const grossAmount = rev.netAmount + vatAmount;
        
        return {
          ...rev,
          vatRate: newVatRate,
          vatAmount,
          grossAmount
        };
      }
      return rev;
    });
    
    setRevenues(updatedRevenues);
    toast({
      title: "VAT Rate Updated",
      description: `VAT rate changed to ${newVatRate}%`,
    });
  };

  // Filter revenues by selected event
  const filteredRevenues = selectedEventId === "all" 
    ? revenues 
    : revenues.filter(rev => rev.event === selectedEventId);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/40 mb-4">
          <TabsTrigger value="add">Add Revenue</TabsTrigger>
          <TabsTrigger value="list">Revenue List</TabsTrigger>
          <TabsTrigger value="summary">Revenue Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="add">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Add New Revenue
              </CardTitle>
              <CardDescription>Record a new revenue entry</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="event"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Related Event</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select event" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {events.filter(e => e.id !== "all").map((event) => (
                                <SelectItem key={event.id} value={event.id}>
                                  {event.name} ({event.date})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Revenue Category</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedCategory(value);
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {revenueCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Brief description of revenue" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date Received</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="date" {...field} className="pl-9" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="col-span-2">
                      <Label>Amount</Label>
                      <VATCalculator 
                        netAmount={netAmount}
                        setNetAmount={(value) => {
                          setNetAmount(value);
                          form.setValue("netAmount", parseFloat(value.replace(/,/g, "")) || 0);
                        }}
                        vatRate={vatRate}
                        setVatRate={(value) => {
                          setVatRate(value);
                          form.setValue("vatRate", value);
                        }}
                        grossAmount={grossAmount}
                        setGrossAmount={setGrossAmount}
                      />
                    </div>

                    {selectedCategory === "Ticket Sales" && (
                      <>
                        <FormField
                          control={form.control}
                          name="ticketsSold"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tickets Sold</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Ticket className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input 
                                    type="number" 
                                    min="0" 
                                    {...field} 
                                    placeholder="0" 
                                    className="pl-9"
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="ticketPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ticket Price (€)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input 
                                    type="number" 
                                    step="0.01" 
                                    min="0" 
                                    {...field} 
                                    placeholder="0.00" 
                                    className="pl-9"
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                              <SelectItem value="credit_card">Credit Card</SelectItem>
                              <SelectItem value="paypal">PayPal</SelectItem>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="check">Check</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {revenueStatusOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="referenceNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reference Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. Transaction ID, Invoice Number" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button type="submit" className="gap-2">
                      <Plus className="h-4 w-4" /> Add Revenue
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Revenue Entries</CardTitle>
              <CardDescription>All recorded revenue transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredRevenues.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Date</th>
                        <th className="text-left py-3 px-2">Event</th>
                        <th className="text-left py-3 px-2">Category</th>
                        <th className="text-left py-3 px-2">Description</th>
                        <th className="text-right py-3 px-2">Net Amount</th>
                        <th className="text-right py-3 px-2">VAT %</th>
                        <th className="text-right py-3 px-2">VAT Amount</th>
                        <th className="text-right py-3 px-2">Gross Amount</th>
                        <th className="text-center py-3 px-2">Status</th>
                        {filteredRevenues.some(r => r.category === "Ticket Sales") && (
                          <>
                            <th className="text-right py-3 px-2">Tickets</th>
                            <th className="text-right py-3 px-2">Ticket Price</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRevenues.map((revenue) => (
                        <tr key={revenue.id} className="border-b border-muted/20 hover:bg-muted/5">
                          <td className="py-3 px-2">{revenue.date}</td>
                          <td className="py-3 px-2">{getEventName(revenue.event)}</td>
                          <td className="py-3 px-2">{revenue.category}</td>
                          <td className="py-3 px-2">{revenue.description}</td>
                          <td className="py-3 px-2 text-right">€{revenue.netAmount.toFixed(2)}</td>
                          <td className="py-3 px-2 text-right">
                            <ActionButtonDropdown
                              value={revenue.vatRate}
                              options={vatRateOptions}
                              onValueChange={(value) => handleVatRateChange(revenue.id, value)}
                              isEditing={true}
                              showActions={false}
                              autoSave={true}
                              className="min-w-[80px]"
                            />
                          </td>
                          <td className="py-3 px-2 text-right">€{revenue.vatAmount.toFixed(2)}</td>
                          <td className="py-3 px-2 text-right">€{revenue.grossAmount.toFixed(2)}</td>
                          <td className="py-3 px-2 text-center">
                            <ActionButtonDropdown
                              value={revenue.status}
                              options={revenueStatusOptions}
                              onValueChange={(value) => handleStatusChange(revenue.id, value)}
                              isEditing={true}
                              showActions={false}
                              autoSave={true}
                              className="min-w-[120px]"
                            />
                          </td>
                          {filteredRevenues.some(r => r.category === "Ticket Sales") && (
                            <>
                              <td className="py-3 px-2 text-right">{revenue.ticketsSold || "-"}</td>
                              <td className="py-3 px-2 text-right">
                                {revenue.ticketPrice ? `€${revenue.ticketPrice.toFixed(2)}` : "-"}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                      <tr className="font-medium bg-muted/10">
                        <td colSpan={4} className="py-3 px-2 text-right">Totals:</td>
                        <td className="py-3 px-2 text-right">€{calculateTotal('netAmount').toFixed(2)}</td>
                        <td className="py-3 px-2 text-right"></td>
                        <td className="py-3 px-2 text-right">€{calculateTotal('vatAmount').toFixed(2)}</td>
                        <td className="py-3 px-2 text-right">€{calculateTotal('grossAmount').toFixed(2)}</td>
                        <td colSpan={filteredRevenues.some(r => r.category === "Ticket Sales") ? 3 : 1}></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No revenue entries have been added yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="summary">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Revenue Summary</CardTitle>
              <CardDescription>Overview of revenue by category</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredRevenues.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {revenueCategories
                      .filter(category => 
                        filteredRevenues.some(rev => rev.category === category)
                      )
                      .map(category => {
                        const categoryTotal = calculateTotal('grossAmount', category);
                        const categoryPercentage = (categoryTotal / calculateTotal('grossAmount')) * 100;
                        
                        return (
                          <Card key={category} className="bg-card/50">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base font-medium">{category}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">€{categoryTotal.toFixed(2)}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {categoryPercentage.toFixed(1)}% of total revenue
                              </div>
                              <div className="w-full bg-muted h-2 mt-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${categoryPercentage}%` }}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    }
                  </div>
                  
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Total Revenue
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Net Revenue</div>
                        <div className="text-2xl font-bold">€{calculateTotal('netAmount').toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">VAT</div>
                        <div className="text-2xl font-bold">€{calculateTotal('vatAmount').toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Gross Revenue</div>
                        <div className="text-3xl font-bold">€{calculateTotal('grossAmount').toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Across {filteredRevenues.length} transactions
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No revenue data available for summary.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RevenueManager;
