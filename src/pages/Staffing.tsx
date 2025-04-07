
import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgePlus, Search, Users, Calendar, CircleDollarSign, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActionButtons } from "@/components/ui/action-buttons";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface StaffMember {
  id: number;
  name: string;
  role: string;
  email: string;
  initials: string;
  status: string;
  events: number;
  contract: string;
}

const staffMembers: StaffMember[] = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Event Manager",
    email: "alex@beatflow.com",
    initials: "AJ",
    status: "active",
    events: 8,
    contract: "Full-time"
  },
  {
    id: 2,
    name: "Maria Gonzalez",
    role: "Sound Engineer",
    email: "maria@beatflow.com",
    initials: "MG",
    status: "active",
    events: 12,
    contract: "Freelance"
  },
  {
    id: 3,
    name: "Daniel Weber",
    role: "Lighting Technician",
    email: "daniel@beatflow.com",
    initials: "DW",
    status: "inactive",
    events: 5,
    contract: "Part-time"
  },
  {
    id: 4,
    name: "Sophie Klein",
    role: "Marketing Specialist",
    email: "sophie@beatflow.com",
    initials: "SK",
    status: "active",
    events: 15,
    contract: "Full-time"
  }
];

const Staffing = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState<number | null>(null);
  const [editedValues, setEditedValues] = useState<Record<number, StaffMember>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [staff, setStaff] = useState<StaffMember[]>(staffMembers);
  
  const filteredStaff = staff.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEdit = (staffId: number) => {
    const member = staff.find(s => s.id === staffId);
    if (member) {
      setEditedValues({
        ...editedValues,
        [staffId]: { ...member }
      });
      setEditingStaff(staffId);
    }
  };

  const handleChange = (staffId: number, field: keyof StaffMember, value: string | number) => {
    setEditedValues({
      ...editedValues,
      [staffId]: {
        ...editedValues[staffId],
        [field]: value
      }
    });
  };

  const handleSave = (staffId: number) => {
    // In a real app, this would save to a database
    setStaff(staff.map(member => 
      member.id === staffId ? editedValues[staffId] : member
    ));
    toast.success(`Staff member ${editedValues[staffId].name} updated successfully`);
    setEditingStaff(null);
  };
  
  const handleCancel = () => {
    setEditingStaff(null);
    toast.info("Edit cancelled");
  };

  const handleDelete = (staffId: number) => {
    setSelectedStaff(staffId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedStaff !== null) {
      const memberToDelete = staff.find(s => s.id === selectedStaff);
      setStaff(staff.filter(s => s.id !== selectedStaff));
      toast.success(`Staff member ${memberToDelete?.name} deleted successfully`);
      setShowDeleteDialog(false);
      setSelectedStaff(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <AppHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="container mx-auto py-6 px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Staffing</h1>
            <div className="flex w-full sm:w-auto gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search staff..." 
                  className="pl-9" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="gap-2">
                <BadgePlus className="h-4 w-4" /> Add Staff
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <Card className="card-gradient">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary-purple/20 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary-purple" />
                </div>
                <CardTitle className="text-2xl mb-1">{staff.length}</CardTitle>
                <CardDescription>Total Staff</CardDescription>
              </CardContent>
            </Card>
            
            <Card className="card-gradient">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-secondary-blue/20 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-secondary-blue" />
                </div>
                <CardTitle className="text-2xl mb-1">{staff.filter(s => s.status === "active").length}</CardTitle>
                <CardDescription>Active This Month</CardDescription>
              </CardContent>
            </Card>
            
            <Card className="card-gradient">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-accent-pink/20 flex items-center justify-center mb-4">
                  <CircleDollarSign className="h-6 w-6 text-accent-pink" />
                </div>
                <CardTitle className="text-2xl mb-1">€42,850</CardTitle>
                <CardDescription>Monthly Payroll</CardDescription>
              </CardContent>
            </Card>
            
            <Card className="card-gradient">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-accent-teal/20 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-accent-teal" />
                </div>
                <CardTitle className="text-2xl mb-1">12</CardTitle>
                <CardDescription>Pending Contracts</CardDescription>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="bg-muted/40 mb-4">
              <TabsTrigger value="all">All Staff</TabsTrigger>
              <TabsTrigger value="fulltime">Full-time</TabsTrigger>
              <TabsTrigger value="freelance">Freelance</TabsTrigger>
              <TabsTrigger value="parttime">Part-time</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
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
                              <label className="text-xs text-muted-foreground mb-1 block">Events</label>
                              <Input
                                type="number"
                                value={editedValues[member.id]?.events || member.events}
                                onChange={(e) => handleChange(member.id, 'events', parseInt(e.target.value))}
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Contract</label>
                              <Input
                                value={editedValues[member.id]?.contract || member.contract}
                                onChange={(e) => handleChange(member.id, 'contract', e.target.value)}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="hidden md:flex items-center gap-4">
                            <div className="text-sm">
                              <p className="text-muted-foreground">Email</p>
                              <p className="font-medium">{member.email}</p>
                            </div>
                            
                            <div className="text-sm">
                              <p className="text-muted-foreground">Events</p>
                              <p className="font-medium">{member.events}</p>
                            </div>
                            
                            <div className="text-sm">
                              <p className="text-muted-foreground">Contract</p>
                              <p className="font-medium">{member.contract}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          {editingStaff === member.id ? (
                            <Input
                              className="w-24"
                              value={editedValues[member.id]?.status || member.status}
                              onChange={(e) => handleChange(member.id, 'status', e.target.value)}
                            />
                          ) : (
                            <Badge className={member.status === "active" ? "bg-emerald-500" : "bg-slate-500"}>
                              {member.status === "active" ? "Active" : "Inactive"}
                            </Badge>
                          )}
                          {!editingStaff && <Button variant="outline" size="sm">View</Button>}
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
            </TabsContent>
            
            <TabsContent value="fulltime">
              <div className="grid-card min-h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Full-time staff will appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="freelance">
              <div className="grid-card min-h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Freelance staff will appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="parttime">
              <div className="grid-card min-h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Part-time staff will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the staff member
              {selectedStaff !== null && staff.find(s => s.id === selectedStaff) 
                ? ` "${staff.find(s => s.id === selectedStaff)?.name}"` 
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
    </div>
  );
};

export default Staffing;
