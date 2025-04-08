
import React, { ReactNode, useEffect } from 'react';
import { Event } from '@/types/entities';
import { createEntityContext, useCoreEntity } from './EntityContext';

// Create specific context for Events
const { EntityProvider, useEntity, EntityContext } = createEntityContext<Event>();

// Initial events data for the provider
const initialEvents: Event[] = [
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

// Enhanced provider that connects to the core entity context
export const EventsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { syncEntities } = useCoreEntity();
  
  return (
    <EntityProvider initialEntities={initialEvents}>
      <EventsSyncHandler>
        {children}
      </EventsSyncHandler>
    </EntityProvider>
  );
};

// Component to handle syncing events with other entities
const EventsSyncHandler: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state, dispatch } = useEntity();
  const { syncEntities } = useCoreEntity();
  
  // Listen for changes in the events and trigger syncs
  useEffect(() => {
    // This would typically connect to backend APIs or other state
    // For now, just log that we'd sync data on state changes
    console.log('Events state changed, would sync with backend and related entities');
  }, [state.entities]);
  
  // Intercept dispatches to trigger syncs
  const originalDispatch = dispatch;
  const syncingDispatch: typeof dispatch = (action) => {
    // First perform the original dispatch
    originalDispatch(action);
    
    // Then trigger syncs based on the action
    switch (action.type) {
      case 'ADD':
        syncEntities('event', 'add');
        break;
      case 'UPDATE':
        syncEntities('event', 'update', action.id);
        break;
      case 'DELETE':
      case 'SOFT_DELETE':
        syncEntities('event', 'delete', action.id);
        break;
      case 'RESTORE':
        syncEntities('event', 'restore', action.id);
        break;
    }
  };
  
  return (
    <EventContext.Provider 
      value={{
        ...useEntity(),
        dispatch: syncingDispatch
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

// Export the hook for consuming components
export const useEvents = useEntity;

// Additional event-specific operations can be added here
export const useEventOperations = () => {
  const { getEntities, addEntity, updateEntity, deleteEntity, restoreEntity } = useEvents();
  
  // Get active events (not deleted)
  const getActiveEvents = () => getEntities(false);
  
  // Get all events including deleted ones
  const getAllEvents = () => getEntities(true);
  
  // Add a new event
  const addEvent = (event: Omit<Event, 'id'>) => {
    return addEntity(event);
  };
  
  // Update an event
  const updateEvent = (id: string | number, updates: Partial<Event>) => {
    updateEntity(id, updates);
  };
  
  // Delete an event (soft delete by default)
  const deleteEvent = (id: string | number, hardDelete = false) => {
    deleteEntity(id, hardDelete);
  };
  
  // Restore a soft-deleted event
  const restoreEvent = (id: string | number) => {
    restoreEntity(id);
  };
  
  return {
    getActiveEvents,
    getAllEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    restoreEvent
  };
};
