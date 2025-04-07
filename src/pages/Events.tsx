
import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, MapPin, Users, Clock, Euro, Search, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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

const events = [
  {
    id: 1,
    name: "Techno Fusion Festival",
    location: "Berlin, Germany",
    date: "May 15, 2025",
    time: "18:00 - 04:00",
    capacity: "3,000",
    revenue: "€149,500",
    status: "upcoming"
  },
  {
    id: 2,
    name: "Bass Nation",
    location: "Amsterdam, Netherlands",
    date: "June 5, 2025",
    time: "20:00 - 06:00",
    capacity: "2,500",
    revenue: "€125,000",
    status: "upcoming"
  },
  {
    id: 3,
    name: "Electronica Showcase",
    location: "Paris, France",
    date: "June 19, 2025",
    time: "19:00 - 03:00",
    capacity: "1,500",
    revenue: "€85,000",
    status: "upcoming"
  }
];

const Events = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<number | null>(null);
  const [editedValues, setEditedValues] = useState<Record<string, any>>({});

  const handleEdit = (eventId: number) => {
    setEditingEvent(eventId);
    setEditedValues({
      ...editedValues,
      [eventId]: { ...events.find(e => e.id === eventId) }
    });
    toast.info(`Edit mode enabled for event ${eventId}`);
  };

  const handleSave = (eventId: number) => {
    toast.success(`Event ${eventId} updated successfully`);
    setEditingEvent(null);
  };

  const handleDelete = (eventId: number) => {
    setSelectedEvent(eventId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedEvent !== null) {
      toast.success(`Event ${selectedEvent} deleted successfully`);
      setShowDeleteDialog(false);
      // In a real application, you would remove the event from the data source
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <AppHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="container mx-auto py-6 px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Events</h1>
            <div className="flex w-full sm:w-auto gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search events..." className="pl-9" />
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> New Event
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="bg-muted/40 mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="card-gradient overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-primary-purple/40 to-accent-pink/40 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-2xl font-bold text-white/90 text-center">{event.name}</h3>
                      </div>
                      <div className="absolute top-2 right-2">
                        <ActionButtons
                          onEdit={() => handleEdit(event.id)}
                          onSave={() => handleSave(event.id)}
                          onDelete={() => handleDelete(event.id)}
                          isEditing={editingEvent === event.id}
                        />
                      </div>
                    </div>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{event.capacity} capacity</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Euro className="h-4 w-4 text-muted-foreground" />
                          <span>{event.revenue} projected revenue</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-6">
                        <Badge className="bg-primary-purple hover:bg-primary-purple/90">
                          Upcoming
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card className="card-gradient mt-8">
                <CardHeader>
                  <CardTitle>Create New Event</CardTitle>
                  <CardDescription>Add details for your next event</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="event-name">Event Name</Label>
                        <Input id="event-name" placeholder="e.g. Summer Beats Festival" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="event-location">Location</Label>
                        <Input id="event-location" placeholder="e.g. Club XYZ, Berlin" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="event-country">Country</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="de">Germany</SelectItem>
                            <SelectItem value="nl">Netherlands</SelectItem>
                            <SelectItem value="fr">France</SelectItem>
                            <SelectItem value="es">Spain</SelectItem>
                            <SelectItem value="pl">Poland</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="event-capacity">Capacity</Label>
                        <Input id="event-capacity" type="number" placeholder="e.g. 1000" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="event-date">Date</Label>
                        <Input id="event-date" type="date" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="event-start">Start Time</Label>
                          <Input id="event-start" type="time" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="event-end">End Time</Label>
                          <Input id="event-end" type="time" />
                        </div>
                      </div>
                      
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="event-description">Description</Label>
                        <Textarea 
                          id="event-description" 
                          placeholder="Enter details about the event..." 
                          rows={4} 
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-6">
                      <Button variant="outline">Cancel</Button>
                      <Button>Create Event</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="past">
              <div className="grid-card min-h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Past events will appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="draft">
              <div className="grid-card min-h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Draft events will appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="templates">
              <div className="grid-card min-h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Event templates will appear here</p>
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
              This action cannot be undone. This will permanently delete the event
              {selectedEvent !== null && events.find(e => e.id === selectedEvent) 
                ? ` "${events.find(e => e.id === selectedEvent)?.name}"` 
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

export default Events;
