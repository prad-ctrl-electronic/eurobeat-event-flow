
import React, { useState } from "react";
import { useTokens } from "@/contexts/TokenContext";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ExportDropdown from "@/components/common/ExportDropdown";

const TokenStaff: React.FC = () => {
  const { staffTokens, addStaffToken, updateStaffToken, deleteStaffToken } = useTokens();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaffToken, setSelectedStaffToken] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    tokenType: "Common",
    amount: 0,
    comments: "",
  });

  const handleOpenEditDialog = (staffToken: StaffToken) => {
    setSelectedStaffToken(staffToken.id);
    setFormData({
      name: staffToken.name,
      tokenType: staffToken.tokenType,
      amount: staffToken.amount,
      comments: staffToken.comments || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleAddStaffToken = () => {
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }

    if (formData.amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    addStaffToken({
      name: formData.name,
      tokenType: formData.tokenType,
      amount: formData.amount,
      comments: formData.comments,
    });

    toast.success("Staff token added successfully");
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditStaffToken = () => {
    if (selectedStaffToken === null) return;
    
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }

    if (formData.amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    updateStaffToken(selectedStaffToken, {
      name: formData.name,
      tokenType: formData.tokenType,
      amount: formData.amount,
      comments: formData.comments,
    });

    toast.success("Staff token updated successfully");
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteStaffToken = (id: number) => {
    deleteStaffToken(id);
    toast.success("Staff token deleted successfully");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      tokenType: "Common",
      amount: 0,
      comments: "",
    });
    setSelectedStaffToken(null);
  };

  const handleExport = (format: "excel" | "pdf") => {
    console.log(`Exporting staff tokens to ${format}`);
    // Implementation for export functionality would go here
  };

  // Calculate totals
  const totalTokens = staffTokens.reduce((sum, token) => sum + token.amount, 0);
  const totalFoodTokens = staffTokens.filter(token => token.tokenType === 'Food')
    .reduce((sum, token) => sum + token.amount, 0);
  const totalCommonTokens = staffTokens.filter(token => token.tokenType === 'Common')
    .reduce((sum, token) => sum + token.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Staff Tokens</h2>
        <div className="flex gap-2">
          <ExportDropdown onExport={handleExport} />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Staff Token
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Staff Token</DialogTitle>
                <DialogDescription>
                  Add a new staff token assignment. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tokenType" className="text-right">
                    Token Type
                  </Label>
                  <Select 
                    value={formData.tokenType} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, tokenType: value }))}
                  >
                    <SelectTrigger className="col-span-3" id="tokenType">
                      <SelectValue placeholder="Select token type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Common">Common</SelectItem>
                      <SelectItem value="Drink">Drink</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="comments" className="text-right">
                    Comments
                  </Label>
                  <Input
                    id="comments"
                    value={formData.comments}
                    onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStaffToken}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Staff Tokens</CardDescription>
            <CardTitle>{totalTokens}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Food Tokens</CardDescription>
            <CardTitle>{totalFoodTokens}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Common Tokens</CardDescription>
            <CardTitle>{totalCommonTokens}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Token Assignments</CardTitle>
          <CardDescription>
            Manage tokens assigned to staff members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Token Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffTokens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No staff tokens assigned
                    </TableCell>
                  </TableRow>
                ) : (
                  staffTokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell className="font-medium">{token.name}</TableCell>
                      <TableCell>{token.tokenType}</TableCell>
                      <TableCell className="text-right">{token.amount}</TableCell>
                      <TableCell>{token.comments || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleOpenEditDialog(token as any)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteStaffToken(token.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff Token</DialogTitle>
            <DialogDescription>
              Update staff token assignment. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-tokenType" className="text-right">
                Token Type
              </Label>
              <Select 
                value={formData.tokenType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, tokenType: value }))}
              >
                <SelectTrigger className="col-span-3" id="edit-tokenType">
                  <SelectValue placeholder="Select token type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Common">Common</SelectItem>
                  <SelectItem value="Drink">Drink</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-amount" className="text-right">
                Amount
              </Label>
              <Input
                id="edit-amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-comments" className="text-right">
                Comments
              </Label>
              <Input
                id="edit-comments"
                value={formData.comments}
                onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditStaffToken}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface StaffToken {
  id: number;
  name: string;
  tokenType: string;
  amount: number;
  comments?: string;
}

export default TokenStaff;
