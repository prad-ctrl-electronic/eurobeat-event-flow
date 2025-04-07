
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { useStaffing } from "@/contexts/StaffingContext";
import { useEvent } from "@/contexts/EventContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Briefcase, 
  MapPin, 
  FileText, 
  CreditCard, 
  UserCheck, 
  Flag, 
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import EventFilter from "@/components/EventFilter";

const StaffProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getStaffMemberById, departments } = useStaffing();
  const { selectedEventId, setSelectedEventId } = useEvent();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const staffMember = getStaffMemberById(Number(id));
  
  if (!staffMember) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Staff Member Not Found</h1>
          <Button onClick={() => navigate('/staffing')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Staffing
          </Button>
        </div>
      </div>
    );
  }
  
  const getDepartmentName = (departmentId: string | undefined): string => {
    if (!departmentId) return "Not Assigned";
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : "Unknown";
  };

  const documentCount = staffMember.documentsCompliance ? Object.keys(staffMember.documentsCompliance).length : 0;
  const compliantDocCount = staffMember.documentsCompliance ? 
    Object.values(staffMember.documentsCompliance).filter(Boolean).length : 0;
  const compliancePercentage = documentCount > 0 ? 
    Math.round((compliantDocCount / documentCount) * 100) : 0;
    
  const upcomingDocExpiry = staffMember.documentsExpiry ? 
    Object.entries(staffMember.documentsExpiry)
      .filter(([_, date]) => new Date(date) > new Date())
      .sort(([_, dateA], [__, dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())[0] : null;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <AppHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="container mx-auto py-6 px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <Button 
              variant="outline"
              onClick={() => navigate('/staffing')} 
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Staffing
            </Button>
            
            <EventFilter 
              selectedEvent={selectedEventId}
              onEventChange={setSelectedEventId}
              className="w-full sm:w-auto"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <Card className="col-span-1 card-gradient">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Profile</CardTitle>
                  <Badge className={
                    staffMember.status === "active" ? "bg-emerald-500" : 
                    staffMember.status === "pending" ? "bg-amber-500" : 
                    "bg-slate-500"
                  }>
                    {staffMember.status === "active" ? "Active" : 
                     staffMember.status === "pending" ? "Pending" : 
                     "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-col items-center">
                  <Avatar className="h-20 w-20 border border-white/10 mb-4">
                    <AvatarFallback className="bg-primary-purple/20 text-primary-purple text-2xl">
                      {staffMember.initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-bold">{staffMember.name}</h2>
                  <p className="text-muted-foreground mb-4">{staffMember.role}</p>
                  
                  <div className="w-full space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{staffMember.email}</span>
                    </div>
                    
                    {staffMember.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{staffMember.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {getDepartmentName(staffMember.department)}
                      </span>
                    </div>
                    
                    {staffMember.nationality && (
                      <div className="flex items-center">
                        <Flag className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{staffMember.nationality}</span>
                      </div>
                    )}
                    
                    {staffMember.countryOfResidence && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{staffMember.countryOfResidence}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 lg:col-span-3 card-gradient">
              <CardHeader>
                <CardTitle>Staff Summary</CardTitle>
                <CardDescription>
                  Overview of {staffMember.name}'s contract and payroll information
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Contract Type</h3>
                      <p className="font-medium">{staffMember.contract}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Payroll Type</h3>
                      <p className="font-medium">{staffMember.payrollType || "Not specified"}</p>
                    </div>
                    
                    {staffMember.agency && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Agency</h3>
                        <p className="font-medium">{staffMember.agency}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Rate Type</h3>
                      <p className="font-medium">{staffMember.rateType || "Not specified"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Rate Amount</h3>
                      <p className="font-medium">
                        {staffMember.rateAmount 
                          ? `${staffMember.rateAmount} ${staffMember.currency || ''}` 
                          : "Not specified"}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Tax ID</h3>
                      <p className="font-medium">{staffMember.taxId || "Not specified"}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Events Count</h3>
                      <p className="font-medium">{staffMember.events}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Document Compliance</h3>
                      <p className="font-medium">
                        {compliancePercentage}% Complete 
                        ({compliantDocCount}/{documentCount})
                      </p>
                    </div>
                    
                    {upcomingDocExpiry && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Next Document Expiry</h3>
                        <p className="font-medium">
                          {upcomingDocExpiry[0]}: {format(new Date(upcomingDocExpiry[1]), "dd MMM yyyy")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="assignments" className="space-y-6">
            <TabsList className="bg-muted/40">
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assignments">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Event Assignments</CardTitle>
                  <CardDescription>
                    View and manage event assignments for {staffMember.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <p className="text-muted-foreground mb-2">No assignments found</p>
                    <Button onClick={() => toast.info("Assignment feature coming soon")}>
                      Create Assignment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Track and manage required documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <p className="text-muted-foreground mb-2">Document management coming soon</p>
                    <Button onClick={() => toast.info("Document upload feature coming soon")}>
                      Upload Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payments">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    View and manage payments for {staffMember.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12">
                    <CreditCard className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <p className="text-muted-foreground mb-2">No payment history found</p>
                    <Button onClick={() => toast.info("Payment feature coming soon")}>
                      Create Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="availability">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Availability Calendar</CardTitle>
                  <CardDescription>
                    View and manage availability for {staffMember.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <p className="text-muted-foreground mb-2">Availability calendar coming soon</p>
                    <Button onClick={() => toast.info("Availability calendar feature coming soon")}>
                      Set Availability
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="feedback">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Performance Feedback</CardTitle>
                  <CardDescription>
                    View and manage feedback for {staffMember.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {staffMember.ratings && staffMember.ratings.length > 0 ? (
                    <div className="space-y-4">
                      {staffMember.ratings.map((rating, index) => (
                        <div key={index} className="border border-white/10 rounded-lg p-4">
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                            <div>
                              <h3 className="text-sm text-muted-foreground">Reliability</h3>
                              <p className="font-medium">{rating.reliability}/5</p>
                            </div>
                            <div>
                              <h3 className="text-sm text-muted-foreground">Skill</h3>
                              <p className="font-medium">{rating.skill}/5</p>
                            </div>
                            <div>
                              <h3 className="text-sm text-muted-foreground">Punctuality</h3>
                              <p className="font-medium">{rating.punctuality}/5</p>
                            </div>
                            <div>
                              <h3 className="text-sm text-muted-foreground">Team Fit</h3>
                              <p className="font-medium">{rating.teamFit}/5</p>
                            </div>
                            <div>
                              <h3 className="text-sm text-muted-foreground">Communication</h3>
                              <p className="font-medium">{rating.communication}/5</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-sm text-muted-foreground">Average Rating</h3>
                              <p className="font-medium">{rating.average.toFixed(1)}/5</p>
                            </div>
                            {rating.notes && (
                              <div className="text-sm">
                                <p className="italic">{rating.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <UserCheck className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                      <p className="text-muted-foreground mb-2">No feedback available yet</p>
                      <Button onClick={() => toast.info("Feedback feature coming soon")}>
                        Add Feedback
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default StaffProfile;
