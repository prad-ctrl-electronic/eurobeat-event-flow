
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ActionButtons } from "@/components/ui/action-buttons";
import { useStaffing } from "@/contexts/StaffingContext";
import { StaffMember } from "@/components/finance/budget/types";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StaffMember as EntityStaffMember } from "@/types/entities";

interface StaffListProps {
  onDeleteStaffMember?: (staffMember: EntityStaffMember) => void;
}

const getDepartmentName = (departmentId: string | undefined, departments: { id: string; name: string }[]): string => {
  if (!departmentId) return "Not Assigned";
  const department = departments.find(d => d.id === departmentId);
  return department ? department.name : "Unknown";
};

const StaffList: React.FC<StaffListProps> = ({ onDeleteStaffMember }) => {
  const { 
    filteredStaff, 
    updateStaffMember, 
    deleteStaffMember, 
    departments 
  } = useStaffing();
  
  const navigate = useNavigate();
  const [editingStaff, setEditingStaff] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null);
  const [editedValues, setEditedValues] = useState<Record<number, StaffMember>>({});
  
  const handleEdit = (staffId: number) => {
    const member = filteredStaff.find(s => s.id === staffId);
    if (member) {
      setEditedValues({
        ...editedValues,
        [staffId]: { ...member }
      });
      setEditingStaff(staffId);
    }
  };

  const handleChange = (staffId: number, field: keyof StaffMember, value: any) => {
    setEditedValues({
      ...editedValues,
      [staffId]: {
        ...editedValues[staffId],
        [field]: value
      }
    });
  };

  const handleSave = (staffId: number) => {
    updateStaffMember(staffId, editedValues[staffId]);
    toast.success(`Staff member ${editedValues[staffId].name} updated successfully`);
    setEditingStaff(null);
  };
  
  const handleCancel = () => {
    setEditingStaff(null);
    toast.info("Edit cancelled");
  };

  const handleDelete = (staffId: number) => {
    const memberToDelete = filteredStaff.find(s => s.id === staffId);
    
    if (onDeleteStaffMember && memberToDelete) {
      // Convert to EntityStaffMember type
      const entityStaffMember: EntityStaffMember = {
        id: memberToDelete.id,
        name: memberToDelete.name,
        initials: memberToDelete.initials,
        role: memberToDelete.role,
        email: memberToDelete.email,
        phone: memberToDelete.phone,
        status: memberToDelete.status,
        department: memberToDelete.department,
        payrollType: memberToDelete.payrollType as "B2B" | "UoD" | "UoP" | undefined,
        contract: memberToDelete.contract || "Standard",
        rateType: memberToDelete.rateType as "Hourly" | "Daily" | "Flat" | undefined,
        rateAmount: memberToDelete.rateAmount,
        events: memberToDelete.events,
        currency: memberToDelete.currency,
        nationality: memberToDelete.nationality,
        countryOfResidence: memberToDelete.countryOfResidence,
        taxId: memberToDelete.taxId,
        agency: memberToDelete.agency,
        documentsCompliance: memberToDelete.documentsCompliance,
        documentsExpiry: memberToDelete.documentsExpiry
      };
      
      onDeleteStaffMember(entityStaffMember);
    } else {
      setSelectedStaff(staffId);
      setShowDeleteDialog(true);
    }
  };

  const confirmDelete = () => {
    if (selectedStaff !== null) {
      const memberToDelete = filteredStaff.find(s => s.id === selectedStaff);
      deleteStaffMember(selectedStaff);
      toast.success(`Staff member ${memberToDelete?.name} deleted successfully`);
      setShowDeleteDialog(false);
      setSelectedStaff(null);
    }
  };

  const handleViewProfile = (staffId: number) => {
    navigate(`/staffing/${staffId}`);
  };

  return (
    <>
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
          <CardDescription>Manage your team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStaff.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-muted/20">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border border-white/10">
                    <AvatarFallback className="bg-primary-purple/20 text-primary-purple">
                      {editingStaff === member.id ? 
                        editedValues[member.id]?.name
                          .split(' ')
                          .map(n => n[0])
                          .join('') :
                        member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    {editingStaff === member.id ? (
                      <Input
                        className="font-medium mb-1"
                        value={editedValues[member.id]?.name || member.name}
                        onChange={(e) => handleChange(member.id, 'name', e.target.value)}
                      />
                    ) : (
                      <h3 className="font-medium">{member.name}</h3>
                    )}
                    {editingStaff === member.id ? (
                      <Input
                        className="text-sm text-muted-foreground"
                        value={editedValues[member.id]?.role || member.role}
                        onChange={(e) => handleChange(member.id, 'role', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    )}
                  </div>
                </div>
                
                {editingStaff === member.id ? (
                  <div className="grid grid-cols-3 gap-4 flex-1 mx-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                      <Input
                        value={editedValues[member.id]?.email || member.email}
                        onChange={(e) => handleChange(member.id, 'email', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Department</label>
                      <Select 
                        value={editedValues[member.id]?.department || ""} 
                        onValueChange={(value) => handleChange(member.id, 'department', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Contract</label>
                      <Select
                        value={editedValues[member.id]?.payrollType || ""} 
                        onValueChange={(value) => handleChange(member.id, 'payrollType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select contract type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="B2B">B2B</SelectItem>
                          <SelectItem value="UoD">UoD</SelectItem>
                          <SelectItem value="UoP">UoP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="hidden md:flex items-center gap-4">
                    <div className="text-sm">
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{member.email}</p>
                    </div>
                    
                    <div className="text-sm">
                      <p className="text-muted-foreground">Department</p>
                      <p className="font-medium">
                        {getDepartmentName(member.department, departments)}
                      </p>
                    </div>
                    
                    <div className="text-sm">
                      <p className="text-muted-foreground">Contract</p>
                      <p className="font-medium">{member.payrollType || 'Not specified'}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  {editingStaff === member.id ? (
                    <Select
                      value={editedValues[member.id]?.status || "active"}
                      onValueChange={(value: "active" | "inactive" | "pending") => 
                        handleChange(member.id, 'status', value)
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={
                      member.status === "active" ? "bg-emerald-500" : 
                      member.status === "pending" ? "bg-amber-500" : 
                      "bg-slate-500"
                    }>
                      {member.status === "active" ? "Active" : 
                       member.status === "pending" ? "Pending" : 
                       "Inactive"}
                    </Badge>
                  )}
                  {!editingStaff && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewProfile(member.id)}
                    >
                      View
                    </Button>
                  )}
                  <ActionButtons
                    onEdit={() => handleEdit(member.id)}
                    onSave={() => handleSave(member.id)}
                    onCancel={handleCancel}
                    onDelete={() => handleDelete(member.id)}
                    isEditing={editingStaff === member.id}
                  />
                </div>
              </div>
            ))}

            {filteredStaff.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No staff members found</p>
              </div>  
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the staff member
              {selectedStaff !== null && filteredStaff.find(s => s.id === selectedStaff) 
                ? ` "${filteredStaff.find(s => s.id === selectedStaff)?.name}"` 
                : ""}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StaffList;
