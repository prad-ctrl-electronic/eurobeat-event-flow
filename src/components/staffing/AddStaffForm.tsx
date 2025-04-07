
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useStaffing } from "@/contexts/StaffingContext";
import { toast } from "sonner";

interface AddStaffFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddStaffForm: React.FC<AddStaffFormProps> = ({ open, onOpenChange }) => {
  const { departments, addStaffMember } = useStaffing();
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    department: "",
    status: "active" as const,
    contract: "Freelance",
    nationality: "",
    countryOfResidence: "",
    taxId: "",
    payrollType: "B2B" as const,
    agency: "",
    rateType: "Hourly" as const,
    rateAmount: 0,
    currency: "PLN",
    bankInfo: "",
    skills: "",
    languages: ""
  });
  
  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.role || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      const skillsArray = formData.skills ? formData.skills.split(',').map(s => s.trim()) : [];
      const languagesArray = formData.languages ? formData.languages.split(',').map(l => l.trim()) : [];
      
      // Parse the staff member data excluding id and initials which will be generated
      const staffData = {
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        contract: formData.contract,
        nationality: formData.nationality,
        countryOfResidence: formData.countryOfResidence,
        taxId: formData.taxId,
        payrollType: formData.payrollType,
        agency: formData.agency || undefined,
        rateType: formData.rateType,
        rateAmount: formData.rateAmount,
        currency: formData.currency,
        bankInfo: formData.bankInfo || undefined,
        skills: skillsArray.length > 0 ? skillsArray : undefined,
        languages: languagesArray.length > 0 ? languagesArray : undefined,
        department: formData.department || undefined,
        events: 0
      };
      
      addStaffMember(staffData);
      toast.success(`Staff member ${formData.name} added successfully`);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to add staff member");
      console.error(error);
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      email: "",
      phone: "",
      department: "",
      status: "active",
      contract: "Freelance",
      nationality: "",
      countryOfResidence: "",
      taxId: "",
      payrollType: "B2B",
      agency: "",
      rateType: "Hourly",
      rateAmount: 0,
      currency: "PLN",
      bankInfo: "",
      skills: "",
      languages: ""
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Staff Member</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role/Title *</Label>
              <Input 
                id="role" 
                value={formData.role} 
                onChange={(e) => handleChange("role", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={formData.phone} 
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select 
                value={formData.department} 
                onValueChange={(value) => handleChange("department", value)}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payrollType">Contract Type</Label>
              <Select 
                value={formData.payrollType} 
                onValueChange={(value: "B2B" | "UoD" | "UoP") => handleChange("payrollType", value)}
              >
                <SelectTrigger id="payrollType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B2B">B2B</SelectItem>
                  <SelectItem value="UoD">UoD</SelectItem>
                  <SelectItem value="UoP">UoP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input 
                id="nationality" 
                value={formData.nationality} 
                onChange={(e) => handleChange("nationality", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="residence">Country of Residence</Label>
              <Input 
                id="residence" 
                value={formData.countryOfResidence} 
                onChange={(e) => handleChange("countryOfResidence", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input 
                id="taxId" 
                value={formData.taxId} 
                onChange={(e) => handleChange("taxId", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: "active" | "inactive" | "pending") => handleChange("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input 
              id="skills" 
              value={formData.skills} 
              onChange={(e) => handleChange("skills", e.target.value)}
              placeholder="e.g. Sound Design, Lighting, Stage Management"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="languages">Languages (comma separated)</Label>
            <Input 
              id="languages" 
              value={formData.languages} 
              onChange={(e) => handleChange("languages", e.target.value)}
              placeholder="e.g. English, Polish, German"
            />
          </div>
          
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Add Staff Member</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffForm;
