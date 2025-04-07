
import React, { createContext, useState, useContext, ReactNode } from "react";

type EventContextType = {
  selectedEventId: string;
  setSelectedEventId: (eventId: string) => void;
  events: Array<{ id: string; name: string; date: string }>;
};

// Default events data
const defaultEvents = [
  { id: "all", name: "All Events", date: "" },
  { id: "tf-2025", name: "Techno Fusion Festival", date: "2025-06-15" },
  { id: "bn-2025", name: "Bass Nation", date: "2025-07-22" },
  { id: "es-2025", name: "Electronica Showcase", date: "2025-08-10" },
  { id: "boiler-room", name: "Boiler Room Warsaw", date: "2024-11-30" },
];

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedEventId, setSelectedEventId] = useState<string>("all");

  return (
    <EventContext.Provider
      value={{
        selectedEventId,
        setSelectedEventId,
        events: defaultEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = (): EventContextType => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};

// Hook to get the name of the currently selected event
export const useSelectedEventName = (): string => {
  const { selectedEventId, events } = useEvent();
  const selectedEvent = events.find(event => event.id === selectedEventId);
  return selectedEvent ? selectedEvent.name : "All Events";
};
