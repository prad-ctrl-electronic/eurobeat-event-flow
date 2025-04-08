
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActionButtons } from "@/components/ui/action-buttons";
import { CalendarIcon, MapPin, Users, Clock, Euro } from "lucide-react";
import { useEventOperations } from "@/contexts/EventsContext";
import { Event } from "@/types/entities";

interface EventListProps {
  onEdit: (eventId: number | string) => void;
  onDelete: (eventId: number | string) => void;
}

const EventList: React.FC<EventListProps> = ({ onEdit, onDelete }) => {
  const { getActiveEvents, updateEvent } = useEventOperations();
  const [editingEvent, setEditingEvent] = useState<string | number | null>(null);
  const [editedValues, setEditedValues] = useState<Record<string, any>>({});
  
  const events = getActiveEvents();

  const handleEdit = (eventId: number | string) => {
    setEditingEvent(eventId);
    setEditedValues({
      ...editedValues,
      [eventId]: { ...events.find(e => e.id === eventId) }
    });
    onEdit(eventId);
  };

  const handleSave = (eventId: number | string) => {
    if (editedValues[eventId]) {
      updateEvent(eventId, editedValues[eventId]);
    }
    setEditingEvent(null);
  };

  const handleDelete = (eventId: number | string) => {
    onDelete(eventId);
  };

  return (
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
                {event.status}
              </Badge>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EventList;
