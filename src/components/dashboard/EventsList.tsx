
import React from "react";
import { CalendarIcon, MapPin, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const upcomingEvents = [
  {
    id: 1,
    name: "Techno Fusion Festival",
    location: "Berlin, Germany",
    date: "2025-05-15",
    time: "18:00 - 04:00",
    ticketsSold: 2450,
    capacity: 3000,
    status: "upcoming"
  },
  {
    id: 2,
    name: "Bass Nation",
    location: "Amsterdam, Netherlands",
    date: "2025-06-05",
    time: "20:00 - 06:00",
    ticketsSold: 1840,
    capacity: 2500,
    status: "upcoming"
  },
  {
    id: 3,
    name: "Electronica Showcase",
    location: "Paris, France",
    date: "2025-06-19",
    time: "19:00 - 03:00",
    ticketsSold: 950,
    capacity: 1500,
    status: "upcoming"
  },
  {
    id: 4,
    name: "House Music Summit",
    location: "Barcelona, Spain",
    date: "2025-07-08",
    time: "21:00 - 05:00",
    ticketsSold: 1200,
    capacity: 2000,
    status: "upcoming"
  }
];

const EventsList = () => {
  return (
    <Card className="card-gradient">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next 30 days</CardDescription>
          </div>
          <Badge className="bg-primary-purple hover:bg-primary-purple/90">
            +4 Events
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingEvents.map((event) => (
          <div key={event.id} className="flex flex-col border border-white/10 rounded-lg p-4 bg-muted/20">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-base">{event.name}</h3>
              <Badge variant="outline" className="bg-accent-teal/20 text-accent-teal border-accent-teal/40">
                {new Date(event.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{event.time}</span>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Ticket Sales
                </span>
                <span>
                  {event.ticketsSold} / {event.capacity}
                </span>
              </div>
              <Progress 
                value={(event.ticketsSold / event.capacity) * 100} 
                className="h-2"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EventsList;
