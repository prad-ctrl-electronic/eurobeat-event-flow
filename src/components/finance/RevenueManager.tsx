
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
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Revenue = {
  id: string;
  event: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  ticketsSold?: number;
  ticketPrice?: number;
  paymentMethod: string;
  referenceNumber: string;
};

type EventOption = {
  id: string;
  name: string;
  date: string;
};

// Sample events data that would in real app come from an API or database
const eventOptions: EventOption[] = [
  { id: "tf-2025", name: "Techno Fusion Festival", date: "2025-06-15" },
  { id: "bn-2025", name: "Bass Nation", date: "2025-07-22" },
  { id: "es-2025", name: "Electronica Showcase", date: "2025-08-10" },
  { id: "boiler-room", name: "Boiler Room Warsaw", date: "2024-11-30" },
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

  const form = useForm<Omit<Revenue, "id">>({
    defaultValues: {
      event: "",
      category: "",
      description: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "",
      referenceNumber: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    const newRevenue: Revenue = {
      id: `rev-${Date.now()}`,
      ...data,
      amount: Number(data.amount),
    };

    setRevenues([...revenues, newRevenue]);
    toast({
      title: "Revenue Added",
      description: `€${newRevenue.amount.toFixed(2)} has been recorded for ${newRevenue.description}`,
    });

    // Reset the form
    form.reset({
      event: "",
      category: "",
      description: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      ticketsSold: undefined,
      ticketPrice: undefined,
      paymentMethod: "",
      referenceNumber: "",
    });
  });

  const calculateTotal = (category?: string) => {
    if (category) {
      return revenues
        .filter((rev) => rev.category === category)
        .reduce((sum, rev) => sum + rev.amount, 0);
    }
    return revenues.reduce((sum, rev) => sum + rev.amount, 0);
  };

  const getEventName = (eventId: string) => {
    const event = eventOptions.find((e) => e.id === eventId);
    return event ? event.name : eventId;
  };

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
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select event" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {eventOptions.map((event) => (
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
                            defaultValue={field.value}
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

                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (€)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Euro className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
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
                            defaultValue={field.value}
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
              {revenues.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Date</th>
                        <th className="text-left py-3 px-2">Event</th>
                        <th className="text-left py-3 px-2">Category</th>
                        <th className="text-left py-3 px-2">Description</th>
                        <th className="text-right py-3 px-2">Amount</th>
                        {revenues.some(r => r.category === "Ticket Sales") && (
                          <>
                            <th className="text-right py-3 px-2">Tickets</th>
                            <th className="text-right py-3 px-2">Ticket Price</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {revenues.map((revenue) => (
                        <tr key={revenue.id} className="border-b border-muted/20 hover:bg-muted/5">
                          <td className="py-3 px-2">{revenue.date}</td>
                          <td className="py-3 px-2">{getEventName(revenue.event)}</td>
                          <td className="py-3 px-2">{revenue.category}</td>
                          <td className="py-3 px-2">{revenue.description}</td>
                          <td className="py-3 px-2 text-right">€{revenue.amount.toFixed(2)}</td>
                          {revenues.some(r => r.category === "Ticket Sales") && (
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
                        <td colSpan={4} className="py-3 px-2 text-right">Total:</td>
                        <td className="py-3 px-2 text-right">€{calculateTotal().toFixed(2)}</td>
                        {revenues.some(r => r.category === "Ticket Sales") && <td colSpan={2}></td>}
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
              {revenues.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {revenueCategories
                      .filter(category => 
                        revenues.some(rev => rev.category === category)
                      )
                      .map(category => {
                        const categoryTotal = calculateTotal(category);
                        const categoryPercentage = (categoryTotal / calculateTotal()) * 100;
                        
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
                    <CardContent>
                      <div className="text-3xl font-bold">€{calculateTotal().toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Across {revenues.length} transactions
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
