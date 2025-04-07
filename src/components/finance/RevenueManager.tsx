import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, FileDown, Edit, Trash, Printer } from "lucide-react";
import { toast } from "sonner";

// Add mock data if needed
const revenueCategories = [
  "Ticket Sales",
  "Merchandise",
  "Food & Beverage",
  "Sponsorships",
  "Advertising",
  "Donations",
  "Other",
];

const mockRevenueItems = [
  {
    id: "1",
    date: "2024-04-01",
    category: "Ticket Sales",
    description: "General admission tickets",
    netAmount: 10000,
    vatPercent: 23,
    grossAmount: 12300,
    status: "Received",
    notes: "Online sales via ticketing platform",
  },
  {
    id: "2",
    date: "2024-04-05",
    category: "Sponsorships",
    description: "Main event sponsor",
    netAmount: 5000,
    vatPercent: 23,
    grossAmount: 6150,
    status: "Pending",
    notes: "Contract signed, invoice sent",
  },
  {
    id: "3",
    date: "2024-04-10",
    category: "Merchandise",
    description: "T-shirts and posters",
    netAmount: 2500,
    vatPercent: 23,
    grossAmount: 3075,
    status: "Received",
    notes: "Sales during event",
  },
];

const RevenueManager: React.FC = () => {
  const [newRevenueOpen, setNewRevenueOpen] = useState(false);
  const [editRevenueOpen, setEditRevenueOpen] = useState(false);
  const [selectedRevenue, setSelectedRevenue] = useState<any>(null);
  const [revenueItems, setRevenueItems] = useState(mockRevenueItems);

  const handleRevenueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      selectedRevenue ? "Revenue item updated!" : "Revenue item added!"
    );
    setNewRevenueOpen(false);
    setEditRevenueOpen(false);
  };

  const handleEditRevenue = (item: any) => {
    setSelectedRevenue(item);
    setEditRevenueOpen(true);
  };

  const handleDeleteRevenue = (id: string) => {
    setRevenueItems(revenueItems.filter((item) => item.id !== id));
    toast.success("Revenue item deleted!");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-2xl font-semibold">Revenue Manager</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" /> Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => setNewRevenueOpen(true)}
          >
            <Plus className="h-4 w-4" /> Add Revenue
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Items</CardTitle>
          <CardDescription>Manage all revenue streams</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Net Amount</TableHead>
                <TableHead className="text-right">VAT %</TableHead>
                <TableHead className="text-right">Gross Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">
                    ${item.netAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">{item.vatPercent}%</TableCell>
                  <TableCell className="text-right">
                    ${item.grossAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === "Received"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditRevenue(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteRevenue(item.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={newRevenueOpen} onOpenChange={setNewRevenueOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Revenue</DialogTitle>
            <DialogDescription>
              Enter the details for the new revenue item.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRevenueSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {revenueCategories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" required />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="netAmount">Net Amount</Label>
                  <Input id="netAmount" type="number" min="0" step="0.01" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatPercent">VAT %</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select VAT %" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="8">8%</SelectItem>
                      <SelectItem value="23">23%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grossAmount">Gross Amount</Label>
                  <Input id="grossAmount" type="number" min="0" step="0.01" disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewRevenueOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Revenue</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editRevenueOpen} onOpenChange={setEditRevenueOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Revenue Item</DialogTitle>
            <DialogDescription>
              Update the details for this revenue item.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRevenueSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    defaultValue={selectedRevenue?.date}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    defaultValue={selectedRevenue?.status.toLowerCase()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  defaultValue={selectedRevenue?.category.toLowerCase()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {revenueCategories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  defaultValue={selectedRevenue?.description}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="netAmount">Net Amount</Label>
                  <Input
                    id="netAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={selectedRevenue?.netAmount}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatPercent">VAT %</Label>
                  <Select defaultValue={selectedRevenue?.vatPercent.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select VAT %" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="8">8%</SelectItem>
                      <SelectItem value="23">23%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grossAmount">Gross Amount</Label>
                  <Input
                    id="grossAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={selectedRevenue?.grossAmount}
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  defaultValue={selectedRevenue?.notes}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditRevenueOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Revenue</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RevenueManager;
