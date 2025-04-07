
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Download,
  Edit,
  Trash,
  BarChart,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileUp,
  MessageCircle,
  Star,
  Clock,
  Calendar as CalendarIcon,
  Tag
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EventFilter from "@/components/EventFilter";
import { useEvent } from "@/contexts/EventContext";
import { 
  vendors, 
  vendorDocuments, 
  vendorCommunications, 
  vendorRefunds,
  vendorAssignments,
  complianceFlags,
  getVendorInvoices,
  getVendorStatistics
} from "@/data/vendorData";
import { VendorRating } from "@/types/vendor";
import VendorDocumentList from "@/components/vendors/VendorDocumentList";
import VendorInvoiceList from "@/components/vendors/VendorInvoiceList";
import VendorCommunicationList from "@/components/vendors/VendorCommunicationList";
import VendorRefundsList from "@/components/vendors/VendorRefundsList";
import VendorAssignmentList from "@/components/vendors/VendorAssignmentList";

const VendorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { selectedEventId, setSelectedEventId } = useEvent();
  
  const vendor = vendors.find(v => v.id === id);
  
  // Handle vendor not found
  if (!vendor) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:ml-64">
          <AppHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="container mx-auto py-6 px-4">
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Vendor Not Found</h2>
                <p className="text-muted-foreground">The vendor you're looking for doesn't exist.</p>
                <Button onClick={() => navigate("/vendors")}>Back to Vendors</Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  // Get vendor data
  const stats = getVendorStatistics(vendor.id);
  const documents = vendorDocuments.filter(doc => doc.vendorId === vendor.id);
  const communications = vendorCommunications.filter(comm => comm.vendorId === vendor.id);
  const refunds = vendorRefunds.filter(refund => refund.vendorId === vendor.id);
  const assignments = vendorAssignments.filter(assign => assign.vendorId === vendor.id);
  const flags = complianceFlags.filter(flag => flag.vendorId === vendor.id);
  
  // Filter vendor invoices
  const allInvoices = getVendorInvoices().filter(invoice => {
    const matchedVendor = vendors.find(v => v.name === invoice.supplier);
    return matchedVendor?.id === vendor.id;
  });
  
  const invoices = selectedEventId === "all" 
    ? allInvoices 
    : allInvoices.filter(invoice => invoice.event === selectedEventId);

  // Get status color for badges
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "inactive": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      case "do not use": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "new": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "verified": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "blocked": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };
  
  // Rating components
  const RatingBar = ({ label, value }: { label: string; value: number }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{value.toFixed(1)}</span>
      </div>
      <Progress value={value * 20} className="h-1.5" />
    </div>
  );
  
  const handleEdit = () => {
    toast.info(`Edit vendor ${vendor.name}`);
  };
  
  const handleDelete = () => {
    toast.error("Delete vendor functionality is not implemented yet");
  };
  
  const handleAddDocument = () => {
    toast.info("Add document functionality is not implemented yet");
  };
  
  const handleAddCommunication = () => {
    toast.info("Add communication functionality is not implemented yet");
  };
  
  const handleAddAssignment = () => {
    toast.info("Add assignment functionality is not implemented yet");
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <AppHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{vendor.name}</h1>
                <Badge variant="secondary" className={getStatusColor(vendor.status)}>
                  {vendor.status}
                </Badge>
                <Badge variant="outline" className={getStatusColor(vendor.verificationStatus)}>
                  {vendor.verificationStatus}
                </Badge>
              </div>
              {vendor.serviceCategories.length > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  <span>{vendor.serviceCategories.join(", ")}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <EventFilter 
              selectedEvent={selectedEventId}
              onEventChange={setSelectedEventId}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-muted/40 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="refunds">Refunds</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="ratings">Ratings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-xl">Vendor Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {vendor.contactName && (
                          <div>
                            <p className="text-sm text-muted-foreground">Contact Name</p>
                            <p className="font-medium">{vendor.contactName}</p>
                          </div>
                        )}
                        
                        {vendor.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <p>{vendor.email}</p>
                          </div>
                        )}
                        
                        {vendor.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <p>{vendor.phone}</p>
                          </div>
                        )}
                        
                        {vendor.address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <p>{vendor.address}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {vendor.vatId && (
                          <div>
                            <p className="text-sm text-muted-foreground">VAT ID</p>
                            <p className="font-medium">{vendor.vatId}</p>
                          </div>
                        )}
                        
                        {vendor.taxNumber && (
                          <div>
                            <p className="text-sm text-muted-foreground">Tax Number</p>
                            <p className="font-medium">{vendor.taxNumber}</p>
                          </div>
                        )}
                        
                        {vendor.servicesProvided && (
                          <div>
                            <p className="text-sm text-muted-foreground">Services Provided</p>
                            <p>{vendor.servicesProvided}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <p>Added on {new Date(vendor.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    {vendor.notes && (
                      <div className="mt-6">
                        <p className="text-sm text-muted-foreground mb-1">Notes</p>
                        <p className="p-3 bg-muted/50 rounded-md">{vendor.notes}</p>
                      </div>
                    )}
                    
                    {flags.length > 0 && (
                      <div className="mt-6">
                        <p className="text-sm font-medium mb-2">Compliance Flags</p>
                        <div className="space-y-2">
                          {flags.map(flag => (
                            <div 
                              key={flag.id} 
                              className={`p-3 rounded-md ${
                                flag.status === 'Active' 
                                  ? 'bg-red-100 dark:bg-red-900/20' 
                                  : 'bg-amber-100 dark:bg-amber-900/20'
                              }`}
                            >
                              <div className="flex justify-between">
                                <p className="font-medium">{flag.type}</p>
                                <Badge variant="outline">{flag.status}</Badge>
                              </div>
                              <p className="text-sm">{flag.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(flag.date).toLocaleDateString()} • {flag.createdBy}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Financial Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount Paid</p>
                      <p className="text-2xl font-bold">PLN {stats.totalPaid.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                      <p className="text-xl font-semibold text-amber-500">
                        PLN {stats.outstandingBalance.toLocaleString()}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Events</p>
                        <p className="text-lg font-medium">{stats.eventsWorkedOn}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Invoices</p>
                        <p className="text-lg font-medium">{stats.totalInvoices}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Payment Time</p>
                        <p className="text-lg font-medium">{stats.avgPaymentTime} days</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Refunds</p>
                        <p className="text-lg font-medium">{stats.totalRefunds}</p>
                      </div>
                    </div>
                    
                    {vendor.rating && (
                      <>
                        <Separator />
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium">Rating</p>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                              <span className="font-bold">{vendor.rating.average.toFixed(1)}</span>
                            </div>
                          </div>
                          <RatingBar label="Reliability" value={vendor.rating.reliability} />
                          <RatingBar label="Quality" value={vendor.rating.quality} />
                          <RatingBar label="Communication" value={vendor.rating.communication} />
                          <RatingBar label="Budget Adherence" value={vendor.rating.budgetAdherence} />
                          <RatingBar label="Rehire Likelihood" value={vendor.rating.rehireLikelihood} />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Upcoming Payments</CardTitle>
                      <CardDescription>Due within 30 days</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">View All</Button>
                  </CardHeader>
                  <CardContent>
                    {invoices.filter(inv => inv.status !== "Already paid").length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Invoice #</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoices
                            .filter(inv => inv.status !== "Already paid")
                            .slice(0, 5)
                            .map((invoice, index) => (
                              <TableRow key={index}>
                                <TableCell>{invoice.invoiceNumber}</TableCell>
                                <TableCell>{invoice.dueDate}</TableCell>
                                <TableCell className="text-right font-medium">
                                  {invoice.currency} {invoice.amountGross}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        No upcoming payments
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Assigned Events</CardTitle>
                      <CardDescription>Current and upcoming assignments</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="gap-2"
                      onClick={handleAddAssignment}
                    >
                      <Plus className="h-4 w-4" /> Assign
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {assignments.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Budget</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {assignments.map((assignment) => {
                            const event = useEvent().events.find(e => e.id === assignment.eventId);
                            return (
                              <TableRow key={assignment.id}>
                                <TableCell>{event?.name || assignment.eventId}</TableCell>
                                <TableCell>{assignment.role}</TableCell>
                                <TableCell className="text-right font-medium">
                                  EUR {assignment.budgetedAmount.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        No event assignments
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="invoices">
              <VendorInvoiceList vendorId={vendor.id} selectedEventId={selectedEventId} />
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">Documents</CardTitle>
                  <Button onClick={handleAddDocument}>
                    <Plus className="h-4 w-4 mr-2" /> Add Document
                  </Button>
                </CardHeader>
                <CardContent>
                  <VendorDocumentList vendorId={vendor.id} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="communication">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">Communication Log</CardTitle>
                  <Button onClick={handleAddCommunication}>
                    <Plus className="h-4 w-4 mr-2" /> Add Entry
                  </Button>
                </CardHeader>
                <CardContent>
                  <VendorCommunicationList vendorId={vendor.id} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="refunds">
              <VendorRefundsList vendorId={vendor.id} selectedEventId={selectedEventId} />
            </TabsContent>
            
            <TabsContent value="assignments">
              <VendorAssignmentList vendorId={vendor.id} selectedEventId={selectedEventId} />
            </TabsContent>
            
            <TabsContent value="ratings">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Performance Ratings</CardTitle>
                  <CardDescription>Average ratings across all events</CardDescription>
                </CardHeader>
                <CardContent>
                  {vendor.rating ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-center">
                        <div className="w-36 h-36 rounded-full bg-muted flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-4xl font-bold">{vendor.rating.average.toFixed(1)}</p>
                            <p className="text-sm text-muted-foreground">Average Rating</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <RatingBar label="Reliability" value={vendor.rating.reliability} />
                        <RatingBar label="Quality" value={vendor.rating.quality} />
                        <RatingBar label="Communication" value={vendor.rating.communication} />
                        <RatingBar label="Budget Adherence" value={vendor.rating.budgetAdherence} />
                        <RatingBar label="Rehire Likelihood" value={vendor.rating.rehireLikelihood} />
                      </div>
                      
                      <div className="flex justify-center">
                        <Button>Add New Rating</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-4">
                      <p className="text-muted-foreground">No ratings available for this vendor yet.</p>
                      <Button>Add First Rating</Button>
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

export default VendorDetail;
