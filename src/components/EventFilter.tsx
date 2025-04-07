
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

// Default event options - in a real app, this would come from an API or context
const defaultEvents = [
  { id: "all", name: "All Events", date: "" },
  { id: "tf-2025", name: "Techno Fusion Festival", date: "2025-06-15" },
  { id: "bn-2025", name: "Bass Nation", date: "2025-07-22" },
  { id: "es-2025", name: "Electronica Showcase", date: "2025-08-10" },
  { id: "boiler-room", name: "Boiler Room Warsaw", date: "2024-11-30" },
];

interface EventFilterProps {
  selectedEvent: string;
  onEventChange: (eventId: string) => void;
  events?: Array<{ id: string; name: string; date?: string }>;
  className?: string;
  showAllOption?: boolean;
}

const EventFilter: React.FC<EventFilterProps> = ({ 
  selectedEvent, 
  onEventChange, 
  events = defaultEvents,
  className = "",
  showAllOption = true 
}) => {
  // Filter out the "All Events" option if showAllOption is false
  const displayEvents = showAllOption 
    ? events 
    : events.filter(event => event.id !== "all");

  return (
    <div className={`relative ${className}`}>
      <Select value={selectedEvent} onValueChange={onEventChange}>
        <SelectTrigger className="w-full md:w-[240px]">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Filter by event" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {displayEvents.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                <div className="flex flex-col">
                  <span>{event.name}</span>
                  {event.date && (
                    <span className="text-xs text-muted-foreground">{event.date}</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default EventFilter;
