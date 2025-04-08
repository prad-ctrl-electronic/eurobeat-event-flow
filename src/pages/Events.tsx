
import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import EventList from "@/components/events/EventList";
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
import { EventsProvider, useEventOperations } from "@/contexts/EventsContext";

const Events = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<number | string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleEdit = (eventId: number | string) => {
    setSelectedEvent(eventId);
  };
  
  const handleDelete = (eventId: number | string) => {
    setSelectedEvent(eventId);
    setShowDeleteDialog(true);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <AppHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="container mx-auto py-6 px-4">
          <EventsProvider>
            <EventsContent 
              selectedEvent={selectedEvent}
              showDeleteDialog={showDeleteDialog}
              setShowDeleteDialog={setShowDeleteDialog}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </EventsProvider>
        </main>
      </div>
    </div>
  );
};

// Separate component that uses hooks from the EventsContext
const EventsContent = ({ 
  selectedEvent,
  showDeleteDialog,
  setShowDeleteDialog,
  onEdit,
  onDelete
}: { 
  selectedEvent: number | string | null;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  onEdit: (eventId: number | string) => void;
  onDelete: (eventId: number | string) => void;
}) => {
  const { getActiveEvents, deleteEvent } = useEventOperations();
  const events = getActiveEvents();
  
  const confirmDelete = () => {
    if (selectedEvent !== null) {
      deleteEvent(selectedEvent, true); // true for hard delete
      setShowDeleteDialog(false);
    }
  };
  
  const selectedEventData = selectedEvent !== null 
    ? events.find(e => e.id === selectedEvent) 
    : null;
  
  return (
    <>
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
          <TabsTrigger value="deleted">Deleted</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <EventList onEdit={onEdit} onDelete={onDelete} />
          
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
        
        <TabsContent value="deleted">
          <div className="grid-card min-h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">Deleted events can be restored from here</p>
          </div>
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event
              {selectedEventData ? ` "${selectedEventData.name}"` : ""}.
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

export default Events;
